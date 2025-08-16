import type { Cancion } from './cancion'
import { HelperJSON } from './HelperJSON'
import type { OrigenCancion } from './origencancion'

export class CancionIndexedDBManager {
  public static async GetCancion(
    origencancion: OrigenCancion,
    db: IDBDatabase,
  ): Promise<Cancion> {
    if (!db) {
      return Promise.reject(new Error('Base de datos no inicializada'))
    }

    return new Promise<Cancion>((resolve, reject) => {
      const transaction = db.transaction('canciones', 'readonly')
      const store = transaction.objectStore('canciones')
      const request = store.get(origencancion.fileName)

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result
        if (result) {
          console.log('Canción recuperada de IndexedDB:', result)
          const cancion = HelperJSON.JSONToCancion(result.contenido)
          cancion.archivo = origencancion.fileName
          resolve(cancion)
        } else {
          reject(new Error(`Canción no encontrada: ${origencancion.fileName}`))
        }
      }

      request.onerror = (event) => {
        console.error('Error al recuperar canción de IndexedDB:', event)
        reject(event)
      }
    })
  }

  static SaveCancion(
    db: IDBDatabase,
    cancion: Cancion,
  ): void | PromiseLike<void> {
    if (!db) {
      return Promise.reject(new Error('Base de datos no inicializada'))
    }
    const cancionJSON = HelperJSON.CancionToJSON(cancion)

    // Crear objeto con archivo como clave
    const objetoAGuardar = {
      archivo: cancion.archivo,
      contenido: cancionJSON,
    }

    const transaction = db.transaction('canciones', 'readwrite')
    const store = transaction.objectStore('canciones')
    return new Promise((resolve, reject) => {
      const request = store.put(objetoAGuardar)
      request.onsuccess = () => {
        console.log('Canción guardada en IndexedDB:', cancion)
        resolve()
      }
      request.onerror = (event) => {
        console.error('Error al guardar canción en IndexedDB:', event)
        reject(event)
      }
    })
  }
}
