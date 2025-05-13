// src/utils/templateManager.ts
import { fabric } from "fabric";

export interface Plantilla {
  id: string;
  name: string;
  thumbnail: string;
  bgType: string;
  bgValue: string;
  quote: any;
  signature: any;
  shapes: any[];
}

const DB_NAME = "CardGPT_DB";
const STORE_NAME = "plantillas";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
          console.log("IndexedDB: Store creado");
        }
      };

      request.onsuccess = () => {
        console.log("IndexedDB: Base de datos abierta");
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("Error al abrir la base de datos:", request.error);
        reject(request.error);
      };
    } catch (error) {
      console.error("Error crítico al abrir IndexedDB:", error);
      reject(error);
    }
  });
}

export async function guardarPlantillaIndexedDB(canvas: fabric.Canvas, nombre: string): Promise<Plantilla> {
  try {
    if (!canvas) {
      throw new Error("El canvas no está definido");
    }

    console.log("Canvas recibido para guardar:", canvas);

    const objects = canvas.getObjects();
    console.log("Objetos en el canvas:", objects);

    // Procesar objetos de texto
    const quote = objects.find((o) => (o.type === "textbox" || o.type === "i-text") && (o as any).name !== "signature") as fabric.Textbox;
    const signature = objects.find((o) => (o.type === "textbox" || o.type === "i-text") && (o as any).name === "signature") as fabric.Textbox;

    // Process shapes with better type handling
    const shapes = objects.filter((o) => o.type !== "textbox" && o.type !== "i-text").map(shape => {
      // Base shape properties
      const baseProps = {
        type: shape.type,
        left: shape.left,
        top: shape.top,
        width: (shape as any).width,
        height: (shape as any).height,
        radius: (shape as any).radius,
        stroke: (shape as any).stroke,
        strokeWidth: (shape as any).strokeWidth,
      };

      // Special handling for group objects (arrows)
      if (shape.type === 'group') {
        // Save additional information about group contents
        return {
          ...baseProps,
          isArrow: true,
          objects: (shape as fabric.Group).getObjects().map(obj => ({
            type: obj.type,
            left: obj.left,
            top: obj.top,
            width: (obj as any).width,
            height: (obj as any).height,
            angle: obj.angle,
            fill: (obj as any).fill,
            stroke: (obj as any).stroke,
            strokeWidth: (obj as any).strokeWidth
          }))
        };
      }

      return baseProps;
    });

    // Determinar tipo y valor de fondo
    let bgType = "color";
    let bgValue = "#ffffff"; // Default blanco

    if (canvas.backgroundImage) {
      bgType = "image";
      // Intentar obtener la URL de la imagen de fondo
      const bgImage = canvas.backgroundImage as any;
      try {
        bgValue = bgImage.src || bgImage._element?.src || "";
        console.log("Imagen de fondo encontrada:", bgValue);
      } catch (e) {
        console.error("Error al obtener la URL de la imagen de fondo:", e);
      }
    } else if (canvas.backgroundColor) {
      bgType = "color";
      bgValue = canvas.backgroundColor as string;
      console.log("Color de fondo encontrado:", bgValue);
    }

    // Generar miniatura
    let thumbnail;
    try {
      thumbnail = canvas.toDataURL({ format: "png", quality: 0.5 });
      console.log("Miniatura generada correctamente");
    } catch (error) {
      console.error("Error al generar miniatura:", error);
      // Miniatura de respaldo en caso de error
      thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    }

    // Save text properties more comprehensively
    const quoteData = quote ? {
      text: quote.text,
      left: quote.left,
      top: quote.top,
      width: quote.width,
      height: quote.height,
      fontSize: quote.fontSize,
      fontFamily: quote.fontFamily,
      textAlign: quote.textAlign,
      originX: quote.originX,
      originY: quote.originY,
      fill: quote.fill,
      styles: quote.styles || {},
    } : null;

    const signatureData = signature ? {
      text: signature.text,
      left: signature.left,
      top: signature.top,
      width: signature.width,
      height: signature.height,
      fontSize: signature.fontSize,
      fontFamily: signature.fontFamily,
      textAlign: signature.textAlign,
      originX: signature.originX,
      originY: signature.originY,
      fill: signature.fill,
      styles: signature.styles || {},
    } : null;

    const plantilla: Plantilla = {
      id: Date.now().toString(),
      name: nombre,
      thumbnail: thumbnail,
      bgType: bgType,
      bgValue: bgValue,
      quote: quoteData,
      signature: signatureData,
      shapes: shapes
    };

    console.log("Plantilla preparada para guardar:", plantilla);

    return new Promise(async (resolve, reject) => {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const request = store.put(plantilla);

        request.onsuccess = () => {
          console.log("IndexedDB: Plantilla guardada con ID:", request.result);
          resolve(plantilla);
        };

        request.onerror = () => {
          console.error("Error al guardar plantilla en IndexedDB:", request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error("Error en la transacción de IndexedDB:", error);
        reject(error);
      }
    });
  } catch (error) {
    console.error("Error al preparar la plantilla:", error);
    throw error;
  }
}

export async function loadAllPlantillasIndexedDB(): Promise<Plantilla[]> {
  try {
    console.log("Intentando cargar todas las plantillas...");
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result as Plantilla[];
        console.log(`IndexedDB: ${result.length} plantillas recuperadas`);
        resolve(result);
      };

      request.onerror = () => {
        console.error("Error al recuperar plantillas:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error al abrir la base de datos para recuperar plantillas:", error);
    return [];
  }
}

export async function cargarPlantillaIndexedDB(id: string): Promise<Plantilla | null> {
  try {
    console.log("Intentando cargar plantilla con ID:", id);
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = () => {
        const resultado = request.result || null;
        if (resultado) {
          console.log("IndexedDB: Plantilla recuperada:", resultado.name);
        } else {
          console.warn("IndexedDB: No se encontró plantilla con ID:", id);
        }
        resolve(resultado);
      };

      request.onerror = () => {
        console.error("Error al recuperar plantilla:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error al abrir la base de datos para cargar plantilla:", error);
    return null;
  }
}