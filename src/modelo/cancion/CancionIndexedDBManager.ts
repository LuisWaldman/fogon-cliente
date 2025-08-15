import type { Cancion } from './cancion'
import { HelperJSON } from './HelperJSON'

export class CancionIndexedDBManager {
  static SaveSong(
    db: IDBDatabase | null,
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
