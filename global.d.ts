declare module 'colorthief';
declare module 'react-color';

// Declaración correcta para fabric
declare module 'fabric' {
  export const fabric: any;
}

// Declaración para window.fs
declare global {
  interface Window {
    fs: any;
  }
}