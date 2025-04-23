import React from "react";
import ImagePaletteUploader from "./ImagePaletteUploader";
import QuoteControls from "./QuoteControls";
import SignatureControls from "./SignatureControls";
import ShapeControls from "./ShapeControls";
import ColorPickers from "./ColorPickers";
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
    <div className="sidebar p-4 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">Controles</h2>

      <Accordion type="multiple" className="w-full" defaultValue={["paleta", "texto", "formas"]}>
        <AccordionItem value="paleta" className="border-none mb-2">
          <AccordionTrigger className="text-sm py-2 font-semibold">Paleta</AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <ImagePaletteUploader
              uploadedBgImage={uploadedBgImage}
              palette={palette}
              onImageUpload={onImageUpload}
              onApplyImageBg={onApplyImageBg}
              onPaletteClick={onPaletteClick}
            />

            {/* Componente de ColorPickers */}
            <ColorPickers 
              bgColor={bgColor}
              textColor={textColor}
              showBgPicker={showBgPicker}
              showTextPicker={showTextPicker}
              toggleBgPicker={toggleBgPicker}
              toggleTextPicker={toggleTextPicker}
              onBgColorChange={onBgColorChange}
              onTextColorChange={onTextColorChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="texto" className="border-none mb-2">
          <AccordionTrigger className="text-sm py-2 font-semibold">Texto</AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
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
              onToggleStyle={onToggleStyle}
              onFontSizeChange={onFontSizeSignatureChange}
              onFontChange={onFontSignatureChange}
              onAlignChange={onAlignSignatureChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="formas" className="border-none mb-2">
          <AccordionTrigger className="text-sm py-2 font-semibold">Formas</AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <ShapeControls
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              addShape={addShape}
              onStrokeColorChange={handleStrokeColorChange}
              onStrokeWidthChange={handleStrokeWidthChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RightSidebar;