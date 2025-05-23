import React, { createContext, useEffect, useState } from "react";
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

  // Escuchar eventos personalizados para actualizar campos de texto
  useEffect(() => {
    const handleQuoteUpdate = (e: CustomEvent) => {
      setQuote(e.detail);
    };

    const handleSignatureUpdate = (e: CustomEvent) => {
      setSignature(e.detail);
    };

    window.addEventListener('quoteUpdate', handleQuoteUpdate as EventListener);
    window.addEventListener('signatureUpdate', handleSignatureUpdate as EventListener);

    return () => {
      window.removeEventListener('quoteUpdate', handleQuoteUpdate as EventListener);
      window.removeEventListener('signatureUpdate', handleSignatureUpdate as EventListener);
    };
  }, [setQuote, setSignature]);

  // Cambiar formato del canvas
  const handleFormatChange = (format: 'square' | 'portrait') => {
    setCanvasFormat(format);

    const canvas = canvasInstance.current;
    if (!canvas) return;

    // Guardar objetos y posiciones actuales
    const objects = canvas.getObjects();
    const savedObjects = objects.map(obj => {
      return {
        object: obj,
        left: obj.left,
        top: obj.top,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        width: (obj as any).width,
        height: (obj as any).height
      };
    });

    // Configurar dimensiones según formato
    const scale = 0.5;
    const oldWidth = canvas.getWidth();
    const oldHeight = canvas.getHeight();

    let newWidth, newHeight;

    if (format === 'square') {
      // Instagram Square: 1080x1080
      newWidth = 1080 * scale;
      newHeight = 1080 * scale;
    } else {
      // Instagram Portrait: 1080x1350
      newWidth = 1080 * scale;
      newHeight = 1350 * scale;
    }

    canvas.setWidth(newWidth);
    canvas.setHeight(newHeight);
    canvas.setDimensions({ width: newWidth, height: newHeight });

    // Reposicionar objetos proporcionalmente
    const widthRatio = newWidth / oldWidth;
    const heightRatio = newHeight / oldHeight;

    savedObjects.forEach(saved => {
      const obj = saved.object;
      const isText = obj.type === 'textbox' || obj.type === 'i-text';

      if (isText) {
        if (obj.name === 'quote') {
          obj.set({
            left: newWidth / 2,
            top: newHeight / 3,
            width: newWidth * 0.8
          });
        } else if (obj.name === 'signature') {
          obj.set({
            left: newWidth / 2,
            top: newHeight * 0.85,
            width: newWidth * 0.6
          });
        }
      } else {
        // Para formas, ajustar proporcionalmente
        obj.set({
          left: saved.left * widthRatio,
          top: saved.top * heightRatio
        });
      }
    });

    canvas.renderAll();
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

    // Solo actualizar objetos de texto, no formas
    canvas.getObjects().forEach((obj) => {
      if (obj.type === "textbox" || obj.type === "i-text") {
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
        <div className="app-container">
          <TopBar 
            onChangeFormat={handleFormatChange}
            currentFormat={canvasFormat}
          />

          <div className="main-content">
            <div className="sidebar sidebar-left w-64">
              <LeftSidebar />
            </div>

            <div className="canvas-container">
              <CanvasEditor canvasRef={canvasRef} />
            </div>

            <div className="sidebar sidebar-right w-80">
              <RightSidebar
                uploadedBgImage={uploadedBgImage}
                palette={palette}
                bgColor={bgColor}
                textColor={textColor}
                showBgPicker={showBgPicker}
                showTextPicker={showTextPicker}
                quote={quote}
                signature={signature}
                quoteFontSize={quoteFontSize}
                signatureFontSize={signatureFontSize}
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