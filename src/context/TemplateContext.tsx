import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define el tipo para los valores de la plantilla
interface TemplateValues {
  currentBgColor: string;
  currentTextColor: string;
  currentQuoteFontSize: number;
  currentSignatureFontSize: number;
  currentQuoteFont: string;
  currentSignatureFont: string;
  currentQuoteAlign: string;
  currentSignatureAlign: string;
  currentQuoteText: string;
  currentSignatureText: string;
}

// Define el tipo para el contexto
interface TemplateContextType {
  values: TemplateValues;
  updateValues: (newValues: Partial<TemplateValues>) => void;
}

// Valores por defecto
const defaultValues: TemplateValues = {
  currentBgColor: "#ffffff",
  currentTextColor: "#000000",
  currentQuoteFontSize: 96, // Cambiado de 48 a 96
  currentSignatureFontSize: 64, // Cambiado de 32 a 64
  currentQuoteFont: "serif",
  currentSignatureFont: "serif",
  currentQuoteAlign: "left",
  currentSignatureAlign: "right",
  currentQuoteText: "",
  currentSignatureText: ""
};

// Crear el contexto
const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Proveedor del contexto
export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [values, setValues] = useState<TemplateValues>(defaultValues);

  const updateValues = (newValues: Partial<TemplateValues>) => {
    console.log("Actualizando valores de plantilla:", newValues);
    setValues(prev => ({ ...prev, ...newValues }));
  };

  return (
    <TemplateContext.Provider value={{ values, updateValues }}>
      {children}
    </TemplateContext.Provider>
  );
};

// Hook para usar el contexto
export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate debe usarse dentro de un TemplateProvider');
  }
  return context;
};