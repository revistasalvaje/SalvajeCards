import React, { createContext, useEffect, useState } from "react";
import "./index.css";
import ColorThief from "colorthief";
import { fabric } from "fabric";
import LeftSidebar from "./components/LeftSidebar";
import CanvasEditor from "./components/CanvasEditor";
import RightSidebar from "./components/RightSidebar";
import TopBar from "./components/TopBar";
import { useEditor } from "./components/useEditor";
import { NotificationProvider } from "./context/NotificationContext";

// Contexto global para el canvas
export const EditorContext = createContext<{
  canvasInstance: React.MutableRefObject<fabric.Canvas | null>;
}>({ canvasInstance: { current: null } });

function App() {
  // Set default format to portrait
  const [canvasFormat, setCanvasFormat] = useState<'square' | 'portrait'>('portrait');

  const {
    canvasRef,
    canvasInstance,
    quote,
    setQuote,
    signature,
    setSignature,
    uploadedBgImage,
    setUploadedBgImage,
    palette,
    setPalette,
    bgColor,
    setBgColor,
    textColor,
    setTextColor,
    showBgPicker,
    setShowBgPicker,
    showTextPicker,
    setShowTextPicker,
    paletteClickCount,
    setPaletteClickCount,
    strokeColor,
    strokeWidth,
    addShape,
    handleStrokeColorChange,
    handleStrokeWidthChange,
    updateTextField,
    updateTextStyle,
    quoteFontSize,
    setQuoteFontSize,
    signatureFontSize,
    setSignatureFontSize,
    quoteFont,
    setQuoteFont,
    signatureFont,
    setSignatureFont,
    quoteAlign,
    setQuoteAlign,
    signatureAlign,
    setSignatureAlign
  } = useEditor();

  // Cambiar formato del canvas
  const handleFormatChange = (format: 'square' | 'portrait') => {
    setCanvasFormat(format);

    const canvas = canvasInstance.current;
    if (!canvas) return;

    // Configurar dimensiones según formato
    const scale = 0.5;
    if (format === 'square') {
      // Instagram Square: 1080x1080
      canvas.setWidth(1080 * scale);
      canvas.setHeight(1080 * scale);
      canvas.setDimensions({ width: 1080 * scale, height: 1080 * scale });
    } else {
      // Instagram Portrait: 1080x1350
      canvas.setWidth(1080 * scale);
      canvas.setHeight(1350 * scale);
      canvas.setDimensions({ width: 1080 * scale, height: 1350 * scale });
    }

    // Update text field positions
    repositionTextFields(canvas);
    canvas.renderAll();
  };

  // Reposition text fields after canvas resize
  const repositionTextFields = (canvas: fabric.Canvas) => {
    const quoteObj = canvas.getObjects().find(obj => obj.name === 'quote') as fabric.Textbox;
    const signatureObj = canvas.getObjects().find(obj => obj.name === 'signature') as fabric.Textbox;

    if (quoteObj) {
      quoteObj.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 3,
        width: canvas.getWidth() * 0.8
      });
    }

    if (signatureObj) {
      signatureObj.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() * 0.85,
        width: canvas.getWidth() * 0.6
      });
    }
  };

  const updateCanvasBackgroundColor = (color: string) => {
    setBgColor(color);
    const canvas = canvasInstance.current;
    if (!canvas) return;
    canvas.setBackgroundImage(null, () => {
      canvas.setBackgroundColor(color);
      canvas.renderAll();
    });
  };

  const updateCanvasTextColor = (color: string) => {
    setTextColor(color);
    const canvas = canvasInstance.current;
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      if (obj.type === "textbox") {
        (obj as fabric.Textbox).set({ fill: color });
      }
    });
    canvas.renderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (f) {
      const dataUrl = f.target?.result as string;
      setUploadedBgImage(dataUrl);

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = dataUrl;

      img.onload = () => {
        const thief = new ColorThief();
        const colors = thief.getPalette(img, 6);
        const hexColors = colors.map(
          ([r, g, b]) =>
            `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`,
        );
        setPalette(hexColors);
        setPaletteClickCount(0);
      };
    };
    reader.readAsDataURL(file);
  };

  const applyImageAsBackground = () => {
    if (!uploadedBgImage || !canvasInstance.current) return;
    fabric.Image.fromURL(uploadedBgImage, (img) => {
      img.scaleToWidth(1080);
      const canvas = canvasInstance.current!;
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  };

  const handlePaletteClick = (color: string) => {
    if (paletteClickCount % 2 === 0) {
      updateCanvasBackgroundColor(color);
    } else {
      updateCanvasTextColor(color);
    }
    setPaletteClickCount((count) => count + 1);
  };

  // Handler for quote text changes
  const handleQuoteChange = (text: string) => {
    setQuote(text);
    updateTextField("quote", text);
  };

  // Handler for signature text changes
  const handleSignatureChange = (text: string) => {
    setSignature(text);
    updateTextField("signature", text);
  };

  // Font size handlers
  const handleQuoteFontSizeChange = (size: number) => {
    setQuoteFontSize(size);
    updateTextStyle("quote", { fontSize: size });
  };

  const handleSignatureFontSizeChange = (size: number) => {
    setSignatureFontSize(size);
    updateTextStyle("signature", { fontSize: size });
  };

  // Font family handlers
  const handleQuoteFontChange = (font: string) => {
    setQuoteFont(font);
    updateTextStyle("quote", { fontFamily: font });
  };

  const handleSignatureFontChange = (font: string) => {
    setSignatureFont(font);
    updateTextStyle("signature", { fontFamily: font });
  };

  // Text alignment handlers
  const handleQuoteAlignChange = (align: string) => {
    setQuoteAlign(align);
    updateTextStyle("quote", { textAlign: align });
  };

  const handleSignatureAlignChange = (align: string) => {
    setSignatureAlign(align);
    updateTextStyle("signature", { textAlign: align });
  };

  // Handlers for text style toggles
  const toggleTextStyle = (field: "quote" | "signature", style: string, value: any) => {
    updateTextStyle(field, { [style]: value });
  };

  return (
    <EditorContext.Provider value={{ canvasInstance }}>
      <NotificationProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
          <TopBar 
            onChangeFormat={handleFormatChange}
            currentFormat={canvasFormat}
          />

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-shrink-0 w-1/6 min-w-[180px] border-r border-gray-200">
              <LeftSidebar />
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-200">
              <CanvasEditor canvasRef={canvasRef} />
            </div>

            <div className="flex-shrink-0 w-1/4 min-w-[280px] max-w-[360px] border-l border-gray-200">
              <RightSidebar
                uploadedBgImage={uploadedBgImage}
                palette={palette}
                bgColor={bgColor}
                textColor={textColor}
                showBgPicker={showBgPicker}
                showTextPicker={showTextPicker}
                quote={quote}
                signature={signature}
                onImageUpload={handleImageUpload}
                onApplyImageBg={applyImageAsBackground}
                onPaletteClick={handlePaletteClick}
                onBgColorChange={updateCanvasBackgroundColor}
                onTextColorChange={updateCanvasTextColor}
                toggleBgPicker={() => setShowBgPicker(!showBgPicker)}
                toggleTextPicker={() => setShowTextPicker(!showTextPicker)}
                onQuoteChange={handleQuoteChange}
                onSignatureChange={handleSignatureChange}
                onToggleStyle={(style, value) => toggleTextStyle("quote", style, value)}
                onToggleSignatureStyle={(style, value) => toggleTextStyle("signature", style, value)}
                onFontSizeChange={handleQuoteFontSizeChange}
                onFontSizeSignatureChange={handleSignatureFontSizeChange}
                onFontChange={handleQuoteFontChange}
                onFontSignatureChange={handleSignatureFontChange}
                onAlignChange={handleQuoteAlignChange}
                onAlignSignatureChange={handleSignatureAlignChange}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                addShape={addShape}
                handleStrokeColorChange={handleStrokeColorChange}
                handleStrokeWidthChange={handleStrokeWidthChange}
              />
            </div>
          </div>
        </div>
      </NotificationProvider>
    </EditorContext.Provider>
  );
}

export default App;