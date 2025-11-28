import type { Cancion } from './cancion'
import { HelperJSON } from './HelperJSON'
import { ItemIndiceCancion } from './ItemIndiceCancion'
import { OrigenCancion } from './origencancion'
import { Logger } from '../logger'

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

  static UpdateDBIndex(
    db: IDBDatabase,
    index: ItemIndiceCancion,
  ): Promise<void> {
    if (!db) {
      return Promise.reject(new Error('Base de datos no inicializada'))
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('indice', 'readwrite')
      const store = transaction.objectStore('indice')
      // Directamente sobrescribir el registro
      const putRequest = store.put(index)

      putRequest.onsuccess = () => {
        resolve()
      }

      putRequest.onerror = (event) => {
        console.error(
          'Error al actualizar índice de canción en IndexedDB:',
          event,
        )
        reject(event)
      }
    })
  }

  static GetDBIndex(db: IDBDatabase): Promise<ItemIndiceCancion[]> {
    return new Promise<ItemIndiceCancion[]>((resolve, reject) => {
      const transaction = db.transaction('indice', 'readwrite')
      const store = transaction.objectStore('indice')
      const request = store.getAll()

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result
        console.log('Índices recuperados de IndexedDB:', result)
        resolve(result || [])
      }

      request.onerror = (event) => {
        console.error('Error al recuperar índices de IndexedDB:', event)
        reject(event)
      }
    })
  }

  static Borrar(db: IDBDatabase, cancion: ItemIndiceCancion): Promise<void> {
    if (!db) {
      return Promise.reject(new Error('Base de datos no inicializada'))
    }

    return new Promise<void>((resolve, reject) => {
      // Crear transacción que incluya ambos object stores
      const transaction = db.transaction(['canciones', 'indice'], 'readwrite')

      // Obtener los stores
      const cancionesStore = transaction.objectStore('canciones')
      const indiceStore = transaction.objectStore('indice')

      // Contador para rastrear operaciones completadas
      let operacionesCompletadas = 0
      const totalOperaciones = 2

      // Función para verificar si todas las operaciones están completas
      const verificarComplecion = () => {
        operacionesCompletadas++
        if (operacionesCompletadas === totalOperaciones) {
          console.log('Canción borrada completamente:', cancion.fileName)
          resolve()
        }
      }

      // Borrar la canción del store de canciones
      const deleteCancionRequest = cancionesStore.delete(cancion.fileName)
      deleteCancionRequest.onsuccess = () => {
        console.log('Canción borrada del store de canciones:', cancion.fileName)
        verificarComplecion()
      }
      deleteCancionRequest.onerror = (event) => {
        console.error('Error al borrar canción del store de canciones:', event)
        reject(event)
      }

      // Borrar la canción del índice
      const deleteIndiceRequest = indiceStore.delete(cancion.fileName)
      deleteIndiceRequest.onsuccess = () => {
        console.log('Canción borrada del índice:', cancion.fileName)
        verificarComplecion()
      }
      deleteIndiceRequest.onerror = (event) => {
        console.error('Error al borrar canción del índice:', event)
        reject(event)
      }

      // Manejar errores de la transacción
      transaction.onerror = (event) => {
        console.error('Error en la transacción de borrado:', event)
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
    const index = ItemIndiceCancion.BuildFromCancion(
      cancion,
      new OrigenCancion('local', cancion.archivo, ''),
    )
    this.UpdateDBIndex(db, index).catch((error) => {
      console.error('Error al actualizar índice de canción:', error)
    })
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
