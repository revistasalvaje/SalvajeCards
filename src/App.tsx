import React, { createContext } from "react";
import "./styles.css";
import ColorThief from "colorthief";
import { fabric } from "fabric";
import LeftSidebar from "./components/LeftSidebar";
import CanvasEditor from "./components/CanvasEditor";
import UpdatedRightSidebar from "./components/UpdatedRightSidebar";
import TopBar from "./components/TopBar";
import { useEditor } from "./components/useEditor";
import { NotificationProvider } from "./context/NotificationContext";

// Contexto global para el canvas
export const EditorContext = createContext<{
  canvasInstance: React.MutableRefObject<fabric.Canvas | null>;
}>({ canvasInstance: { current: null } });

function App() {
  const [canvasFormat, setCanvasFormat] = React.useState<'square' | 'portrait'>('square');

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
    updateText,
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
    canvas.getObjects().forEach((obj) => {
      if (obj.type === "textbox" || obj.type === "i-text") {
        (obj as fabric.Textbox | fabric.IText).set({ fill: color });
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
      img.scaleToWidth(canvasInstance.current!.getWidth() * 2);  // Multiplicar por 2 debido al zoom 0.5
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

  const applyGlobalStyle = (type: "quote" | "signature", style: object) => {
    const canvas = canvasInstance.current;
    if (!canvas) return;
    const target = canvas
      .getObjects()
      .find(
        (o) =>
          (o.type === "textbox" || o.type === "i-text") &&
          (type === "quote" ? o.name !== "signature" : o.name === "signature"),
      ) as fabric.Textbox | fabric.IText;
    if (target) {
      target.set(style);
      canvas.renderAll();
    }
  };

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
    <EditorContext.Provider value={{ canvasInstance }}>
      <NotificationProvider>
        <div className="app-container">
          {/* Barra superior */}
          <TopBar 
            onChangeFormat={handleFormatChange}
            currentFormat={canvasFormat}
          />

          {/* Área de trabajo */}
          <div className="main-content">
            <div className="sidebar left-sidebar">
              <LeftSidebar />
            </div>

            <div className="canvas-container">
              <div className="canvas-wrapper">
                <CanvasEditor canvasRef={canvasRef} />
              </div>
            </div>

            <UpdatedRightSidebar
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
              onQuoteChange={(text) => updateText(text, "quote")}
              onSignatureChange={(text) => updateText(text, "signature")}
              onToggleStyle={toggleTextStyle}
              onFontSizeChange={(size) =>
                applyGlobalStyle("quote", { fontSize: size })
              }
              onFontSizeSignatureChange={(size) =>
                applyGlobalStyle("signature", { fontSize: size })
              }
              onFontChange={(font) =>
                applyGlobalStyle("quote", { fontFamily: font })
              }
              onFontSignatureChange={(font) =>
                applyGlobalStyle("signature", { fontFamily: font })
              }
              onAlignChange={(align) =>
                applyGlobalStyle("quote", { textAlign: align })
              }
              onAlignSignatureChange={(align) =>
                applyGlobalStyle("signature", { textAlign: align })
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