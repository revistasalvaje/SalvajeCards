import React, { createContext } from "react";
import "./styles.css";
import ColorThief from "colorthief";
import { fabric } from "fabric";
import LeftSidebar from "./components/Layout/LeftSidebar";
import CanvasEditor from "./components/Editor/CanvasEditor";
import RightSidebar from "./components/Layout/RightSidebar";
import TopBar from "./components/Layout/TopBar";
import { useEditor } from "./hooks/useEditor";
import { NotificationProvider } from "./context/NotificationContext";

export const EditorContext = createContext<{
  canvasInstance: React.MutableRefObject<fabric.Canvas | null>;
  quoteTextRef?: React.MutableRefObject<fabric.Textbox | null>;
  signatureTextRef?: React.MutableRefObject<fabric.Textbox | null>;
}>({ canvasInstance: { current: null } });

function App() {
  const [canvasFormat, setCanvasFormat] = React.useState<'square' | 'portrait'>('square');
  const [paletteClickCount, setPaletteClickCount] = React.useState(0);

  const editorState = useEditor();

  const {
    canvasRef,
    canvasInstance,
    quoteTextRef,
    signatureTextRef,
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
    strokeColor,
    strokeWidth,
    addShape,
    handleStrokeColorChange,
    handleStrokeWidthChange,
    updateText,
    applyTextStyle
  } = editorState;

  // Handle canvas format change
  const handleFormatChange = (format: 'square' | 'portrait') => {
    setCanvasFormat(format);

    const canvas = canvasInstance.current;
    if (!canvas) return;

    const scale = 0.5;
    if (format === 'square') {
      canvas.setWidth(1080 * scale);
      canvas.setHeight(1080 * scale);
      canvas.setDimensions({ width: 1080 * scale, height: 1080 * scale });
    } else {
      canvas.setWidth(1080 * scale);
      canvas.setHeight(1350 * scale);
      canvas.setDimensions({ width: 1080 * scale, height: 1350 * scale });
    }

    // Adjust signature position
    if (signatureTextRef.current) {
      signatureTextRef.current.set({
        left: canvas.getWidth() - 60,
        top: canvas.getHeight() - 60
      });
    }

    canvas.renderAll();
  };

  // Update canvas background color
  const updateCanvasBackgroundColor = (color: string) => {
    setBgColor(color);
    const canvas = canvasInstance.current;
    if (!canvas) return;

    canvas.setBackgroundImage(null, () => {
      canvas.setBackgroundColor(color);
      canvas.renderAll();
    });
  };

  // Update canvas text color
  const updateCanvasTextColor = (color: string) => {
    setTextColor(color);

    if (quoteTextRef.current) {
      quoteTextRef.current.set({ fill: color });
    }

    if (signatureTextRef.current) {
      signatureTextRef.current.set({ fill: color });
    }

    canvasInstance.current?.renderAll();
  };

  // Handle image upload
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

  // Apply image as background
  const applyImageAsBackground = () => {
    if (!uploadedBgImage || !canvasInstance.current) return;

    fabric.Image.fromURL(uploadedBgImage, (img) => {
      img.scaleToWidth(canvasInstance.current!.getWidth() * 2);
      const canvas = canvasInstance.current!;
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  };

  // Handle palette color click
  const handlePaletteClick = (color: string) => {
    if (paletteClickCount % 2 === 0) {
      updateCanvasBackgroundColor(color);
    } else {
      updateCanvasTextColor(color);
    }
    setPaletteClickCount((count) => count + 1);
  };

  // Toggle text style
  const toggleTextStyle = (style: string, value: any) => {
    const canvas = canvasInstance.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active || (active.type !== "textbox" && active.type !== "i-text")) return;

    const textObj = active as fabric.Textbox | fabric.IText;
    const start = textObj.selectionStart || 0;
    const end = textObj.selectionEnd || 0;
    if (start === end) return;

    for (let i = start; i < end; i++) {
      const current = textObj.getSelectionStyles(i)[0] || {};
      const applied = current?.[style] === value;
      const newStyle = { ...current };
      if (applied) delete newStyle[style];
      else newStyle[style] = value;
      textObj.setSelectionStyles(newStyle, i, i + 1);
    }
    canvas.renderAll();
  };

  return (
    <EditorContext.Provider value={{ canvasInstance, quoteTextRef, signatureTextRef }}>
      <NotificationProvider>
        <div className="app-container">
          <TopBar 
            onChangeFormat={handleFormatChange}
            currentFormat={canvasFormat}
          />

          <div className="main-content">
            <div className="sidebar left-sidebar">
              <LeftSidebar />
            </div>

            <div className="canvas-container">
              <CanvasEditor canvasRef={canvasRef} />
            </div>

            <RightSidebar
              uploadedBgImage={uploadedBgImage}
              palette={palette}
              bgColor={bgColor}
              textColor={textColor}
              quote={quote}
              signature={signature}
              onImageUpload={handleImageUpload}
              onApplyImageBg={applyImageAsBackground}
              onPaletteClick={handlePaletteClick}
              onBgColorChange={updateCanvasBackgroundColor}
              onTextColorChange={updateCanvasTextColor}
              onQuoteChange={(text) => updateText(text, "quote")}
              onSignatureChange={(text) => updateText(text, "signature")}
              onToggleStyle={toggleTextStyle}
              onFontSizeChange={(size) =>
                applyTextStyle("quote", { fontSize: size * 0.5 })
              }
              onFontSizeSignatureChange={(size) =>
                applyTextStyle("signature", { fontSize: size * 0.5 })
              }
              onFontChange={(font) =>
                applyTextStyle("quote", { fontFamily: font })
              }
              onFontSignatureChange={(font) =>
                applyTextStyle("signature", { fontFamily: font })
              }
              onAlignChange={(align) =>
                applyTextStyle("quote", { textAlign: align })
              }
              onAlignSignatureChange={(align) =>
                applyTextStyle("signature", { textAlign: align })
              }
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              addShape={addShape}
              handleStrokeColorChange={handleStrokeColorChange}
              handleStrokeWidthChange={handleStrokeWidthChange}
            />
          </div>
        </div>
      </NotificationProvider>
    </EditorContext.Provider>
  );
}

export default App;