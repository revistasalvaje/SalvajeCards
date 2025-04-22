import React, { createContext, useEffect, useState } from "react";
import "./index.css";
import "./styles.css";
import "./styles-enhanced.css";
import ColorThief from "colorthief";
import { fabric } from 'fabric';
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
  const [canvasFormat, setCanvasFormat] = useState<'square' | 'portrait'>('square');

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
      if (obj.type === "i-text") {
        (obj as fabric.IText).set({ fill: color });
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

  const updateText = (content: string, type: "quote" | "signature") => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const name = type === "signature" ? "signature" : undefined;
    const text = type === "signature" ? signature : quote;
    const setText = type === "signature" ? setSignature : setQuote;
    const isSignature = type === "signature";

    setText(content);

    let obj = canvas
      .getObjects()
      .find(
        (o) =>
          o.type === "i-text" &&
          (isSignature ? o.name === "signature" : o.name !== "signature"),
      ) as fabric.IText;

    if (obj) {
      obj.text = content;
      canvas.renderAll();
    } else {
      const newText = new fabric.IText(content, {
        left: isSignature ? canvas.getWidth() - 60 : 100,
        top: isSignature ? canvas.getHeight() - 60 : 100,
        originX: isSignature ? "right" : "left",
        originY: isSignature ? "bottom" : "top",
        fontSize: isSignature ? 32 : 48,
        fill: textColor,
        fontFamily: "serif",
        editable: true,
        name,
      });
      canvas.add(newText).setActiveObject(newText);
      canvas.renderAll();
    }
  };

  const applyGlobalStyle = (type: "quote" | "signature", style: object) => {
    const canvas = canvasInstance.current;
    if (!canvas) return;
    const target = canvas
      .getObjects()
      .find(
        (o) =>
          o.type === "i-text" &&
          (type === "quote" ? o.name !== "signature" : o.name === "signature"),
      ) as fabric.IText;
    if (target) {
      target.set(style);
      canvas.renderAll();
    }
  };

  const toggleTextStyle = (style: string, value: any) => {
    const canvas = canvasInstance.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active || active.type !== "i-text") return;
    const itext = active as fabric.IText;
    const start = itext.selectionStart || 0;
    const end = itext.selectionEnd || 0;
    if (start === end) return;

    for (let i = start; i < end; i++) {
      const current = itext.getSelectionStyles(i)[0] || {};
      const applied = current?.[style] === value;
      const newStyle = { ...current };
      if (applied) delete newStyle[style];
      else newStyle[style] = value;
      itext.setSelectionStyles(newStyle, i, i + 1);
    }
    canvas.renderAll();
  };

  return (
    <EditorContext.Provider value={{ canvasInstance }}>
      <NotificationProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
          {/* Barra superior */}
          <TopBar 
            onChangeFormat={handleFormatChange}
            currentFormat={canvasFormat}
          />

          {/* Área de trabajo */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-shrink-0 w-1/6 min-w-[180px] border-r border-gray-200">
              <LeftSidebar />
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-300">
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
        </div>
      </NotificationProvider>
    </EditorContext.Provider>
  );
}

export default App;