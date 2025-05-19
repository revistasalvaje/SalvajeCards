import React from "react";
import ImagePaletteUploader from "./ImagePaletteUploader";
import QuoteControls from "./QuoteControls";
import SignatureControls from "./SignatureControls";
import ShapeControls from "./ShapeControls";
import PaletteAccordionContent from "./PaletteAccordionContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

interface RightSidebarProps {
  uploadedBgImage: string | null;
  palette: string[];
  bgColor: string;
  textColor: string;
  showBgPicker: boolean;
  showTextPicker: boolean;
  quote: string;
  signature: string;
  strokeColor: string;
  strokeWidth: number;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyImageBg: () => void;
  onPaletteClick: (color: string) => void;
  onBgColorChange: (hex: string) => void;
  onTextColorChange: (hex: string) => void;
  toggleBgPicker: () => void;
  toggleTextPicker: () => void;
  onQuoteChange: (text: string) => void;
  onSignatureChange: (text: string) => void;
  onToggleStyle: (style: string, value: any) => void;
  onToggleSignatureStyle: (style: string, value: any) => void;
  onFontSizeChange: (size: number) => void;
  onFontSizeSignatureChange: (size: number) => void;
  onFontChange: (font: string) => void;
  onFontSignatureChange: (font: string) => void;
  onAlignChange: (align: string) => void;
  onAlignSignatureChange: (align: string) => void;
  addShape: (type: "line" | "arrow" | "rect" | "circle") => void;
  handleStrokeColorChange: (color: string) => void;
  handleStrokeWidthChange: (width: number) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  uploadedBgImage,
  palette,
  bgColor,
  textColor,
  showBgPicker,
  showTextPicker,
  quote,
  signature,
  strokeColor,
  strokeWidth,
  onImageUpload,
  onApplyImageBg,
  onPaletteClick,
  onBgColorChange,
  onTextColorChange,
  toggleBgPicker,
  toggleTextPicker,
  onQuoteChange,
  onSignatureChange,
  onToggleStyle,
  onToggleSignatureStyle,
  onFontSizeChange,
  onFontSizeSignatureChange,
  onFontChange,
  onFontSignatureChange,
  onAlignChange,
  onAlignSignatureChange,
  addShape,
  handleStrokeColorChange,
  handleStrokeWidthChange,
}) => {
  return (
    <div className="sidebar">
      <h2>Controles</h2>

      <Accordion type="multiple" className="w-full" defaultValue={["paleta", "texto", "formas"]}>
        <AccordionItem value="paleta" className="accordion mb-3">
          <AccordionTrigger className="accordion-header">
            Paleta de colores
          </AccordionTrigger>
          <AccordionContent>
            <PaletteAccordionContent 
              uploadedBgImage={uploadedBgImage}
              palette={palette}
              bgColor={bgColor}
              textColor={textColor}
              showBgPicker={showBgPicker}
              showTextPicker={showTextPicker}
              onImageUpload={onImageUpload}
              onApplyImageBg={onApplyImageBg}
              onPaletteClick={onPaletteClick}
              onBgColorChange={onBgColorChange}
              onTextColorChange={onTextColorChange}
              toggleBgPicker={toggleBgPicker}
              toggleTextPicker={toggleTextPicker}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="texto" className="accordion mb-3">
          <AccordionTrigger className="accordion-header">
            Contenido de texto
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <QuoteControls
                quote={quote}
                onQuoteChange={onQuoteChange}
                onToggleStyle={onToggleStyle}
                onFontSizeChange={onFontSizeChange}
                onFontChange={onFontChange}
                onAlignChange={onAlignChange}
              />
              <SignatureControls
                signature={signature}
                onChange={onSignatureChange}
                onToggleStyle={onToggleSignatureStyle}
                onFontSizeChange={onFontSizeSignatureChange}
                onFontChange={onFontSignatureChange}
                onAlignChange={onAlignSignatureChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="formas" className="accordion mb-3">
          <AccordionTrigger className="accordion-header">
            Elementos gráficos
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <ShapeControls
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                addShape={addShape}
                onStrokeColorChange={handleStrokeColorChange}
                onStrokeWidthChange={handleStrokeWidthChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RightSidebar;