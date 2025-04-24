// Storage operations for IndexedDB
import { Plantilla } from '../../types/template';

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

export async function getAllTemplates(): Promise<Plantilla[]> {
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

export async function getTemplateById(id: string): Promise<Plantilla | null> {
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

export async function saveTemplate(template: Plantilla): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.put(template);

      request.onsuccess = () => {
        console.log("IndexedDB: Plantilla guardada con ID:", request.result);
        resolve();
      };

      request.onerror = () => {
        console.error("Error al guardar plantilla en IndexedDB:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error en la transacción de IndexedDB:", error);
    throw error;
  }
}