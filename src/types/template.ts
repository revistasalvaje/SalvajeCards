// Template type definitions
export interface Plantilla {
  id: string;
  name: string;
  thumbnail: string;
  bgType: string;
  bgValue: string;
  quote: {
    text: string;
    left: number;
    top: number;
    fontSize: number;
    fontFamily: string;
    textAlign: string;
    fill?: string;
    styles?: any;
    width?: number;
  } | null;
  signature: {
    text: string;
    left: number;
    top: number;
    fontSize: number;
    fontFamily: string;
    textAlign: string;
    fill?: string;
    styles?: any;
    width?: number;
  } | null;
  shapes: Array<{
    type: string;
    left: number;
    top: number;
    width?: number;
    height?: number;
    stroke: string;
    strokeWidth: number;
    radius?: number;
  }>;
}