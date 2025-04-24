// src/utils/templateManager.ts
import { fabric } from "fabric";

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
          console.log("Detalles de la plantilla:", JSON.stringify(resultado, null, 2));
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

export async function guardarPlantillaIndexedDB(canvas: fabric.Canvas, nombre: string): Promise<Plantilla> {
  try {
    if (!canvas) {
      throw new Error("El canvas no está definido");
    }

    console.log("Canvas recibido para guardar:", canvas);

    const objects = canvas.getObjects();
    console.log("Objetos en el canvas:", objects);

    // Procesar objetos de texto
    const quote = objects.find((o) => (o.type === "textbox" || o.type === "i-text") && (o as any).name === "quote") as fabric.Textbox | fabric.IText;
    const signature = objects.find((o) => (o.type === "textbox" || o.type === "i-text") && (o as any).name === "signature") as fabric.Textbox | fabric.IText;
    const shapes = objects.filter((o) => o.type !== "textbox" && o.type !== "i-text" && !((o as any).name === "quote" || (o as any).name === "signature"));

    console.log("Quote object encontrado:", quote);
    console.log("Signature object encontrado:", signature);
    console.log("Formas encontradas:", shapes.length);

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

    // Compensamos el factor de escala 0.5 multiplicando las coordenadas por 2
    // para guardar las posiciones en escala 1.0
    const scaleCompensation = 2.0;

    console.log("Quote antes de guardar:", quote ? {
      text: quote.text,
      left: quote.left,
      top: quote.top,
      fontSize: quote.fontSize,
      fill: quote.fill
    } : "No hay quote");

    console.log("Signature antes de guardar:", signature ? {
      text: signature.text,
      left: signature.left,
      top: signature.top,
      fontSize: signature.fontSize,
      fill: signature.fill
    } : "No hay signature");

    const plantilla: Plantilla = {
      id: Date.now().toString(),
      name: nombre,
      thumbnail: thumbnail,
      bgType: bgType,
      bgValue: bgValue,
      quote: quote
        ? {
            text: quote.text,
            left: quote.left * scaleCompensation, // Compensar escala
            top: quote.top * scaleCompensation, // Compensar escala
            fontSize: (quote.fontSize || 24) * scaleCompensation, // Compensar escala
            fontFamily: quote.fontFamily || "serif",
            textAlign: quote.textAlign || "left",
            fill: quote.fill as string || "#000000",
            styles: quote.styles || {},
            width: (quote as any).width ? (quote as any).width * scaleCompensation : undefined,
          }
        : null,
      signature: signature
        ? {
            text: signature.text,
            left: signature.left * scaleCompensation, // Compensar escala
            top: signature.top * scaleCompensation, // Compensar escala
            fontSize: (signature.fontSize || 16) * scaleCompensation, // Compensar escala
            fontFamily: signature.fontFamily || "serif",
            textAlign: signature.textAlign || "right",
            fill: signature.fill as string || "#000000",
            styles: signature.styles || {},
            width: (signature as any).width ? (signature as any).width * scaleCompensation : undefined,
          }
        : null,
      shapes: shapes.map((s) => ({
        type: s.type,
        left: s.left * scaleCompensation, // Compensar escala
        top: s.top * scaleCompensation, // Compensar escala
        stroke: (s as any).stroke || "#000000",
        strokeWidth: ((s as any).strokeWidth || 1) * scaleCompensation, // Compensar escala
        width: (s as any).width ? (s as any).width * scaleCompensation : undefined,
        height: (s as any).height ? (s as any).height * scaleCompensation : undefined,
        radius: (s as any).radius ? (s as any).radius * scaleCompensation : undefined,
      })),
    };

    console.log("Plantilla preparada para guardar:", JSON.stringify(plantilla, null, 2));

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