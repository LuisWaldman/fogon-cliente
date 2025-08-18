import type { ClienteSocket } from '../conexion/ClienteSocket'
import { Cancion } from './cancion'
import { ItemIndiceCancion } from './ItemIndiceCancion'
import { OrigenCancion } from './origencancion'
import { CancionServerManager } from './CancionServerManager'
import { UltimasCanciones } from './ultimascanciones'
import { CancionUrlManager } from './CancionUrlManager'
import { CancionIndexedDBManager } from './CancionIndexedDBManager'
import { CancionSubidasManager } from './CancionSubidasUrlManager'
import { CancionFogonManager } from './CancionFogonManager'

export class CancionManager {
  private static instance: CancionManager

  private constructor() {}

  private cliente: ClienteSocket | null = null
  private token: string = ''
  private db: IDBDatabase | null = null

  public setCliente(cliente: ClienteSocket, token: string): void {
    this.cliente = cliente
    this.token = token
  }
  private getDBConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MiBaseDeDatos', 1)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Crear el objectStore si no existe
        if (!db.objectStoreNames.contains('canciones')) {
          db.createObjectStore('canciones', { keyPath: 'archivo' })
        }
      }

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }

      request.onerror = (event: Event) => {
        console.error(
          'Error al abrir IndexedDB:',
          (event.target as IDBOpenDBRequest).error,
        )
        reject((event.target as IDBOpenDBRequest).error)
      }
    })
  }

  public SetDB() {
    this.getDBConnection()
      .then((database) => {
        this.db = database
        console.log('Conexión a IndexedDB establecida')
      })
      .catch((error) => {
        console.error('Error al conectar a IndexedDB:', error)
      })
  }

  public static getInstance(): CancionManager {
    if (!CancionManager.instance) {
      CancionManager.instance = new CancionManager()
    }
    return CancionManager.instance
  }

  private async InternalGet(origencancion: OrigenCancion): Promise<Cancion> {
    if (origencancion.origenUrl === 'server') {
      return CancionServerManager.GetCancion(
        origencancion,
        this.cliente,
        this.token,
      )
    }
    if (origencancion.origenUrl === 'subida') {
      return CancionSubidasManager.GetCancion(origencancion)
    }

    if (origencancion.origenUrl === 'fogon') {
      return CancionFogonManager.GetCancion(origencancion, 
        this.cliente,
        this.token)
    }
    if (origencancion.origenUrl === 'local') {
      if (!this.db) {
        console.error('No se ha establecido la conexión a IndexedDB')
        throw new Error('No se ha establecido la conexión a IndexedDB')
      }
      return CancionIndexedDBManager.GetCancion(origencancion, this.db)
    }
    console.log('Recuperando canción desde URL:', origencancion.origenUrl)
    if (origencancion.origenUrl === 'server') {
      return CancionServerManager.GetCancion(
        origencancion,
        this.cliente,
        this.token,
      )
    }
    return CancionUrlManager.GetCancion(origencancion)
  }
  public async Get(origencancion: OrigenCancion): Promise<Cancion> {
    const cancion = this.InternalGet(origencancion)
    const acancion = await cancion
    const item = ItemIndiceCancion.BuildFromCancion(acancion, origencancion)
    const ultimas = new UltimasCanciones()
    ultimas.agregar(item)
    return acancion
  }

  public async Save(origen: OrigenCancion, cancion: Cancion): Promise<void> {
    if (origen.origenUrl === 'server') {
      CancionServerManager.SaveCancion(cancion, this.cliente, this.token)
    } else if (origen.origenUrl === 'fogon') {
      CancionFogonManager.SaveCancion(cancion, this.cliente, this.token)
    } else if (origen.origenUrl === 'subida') {
      CancionSubidasManager.SaveCancion(cancion)
    } else if (origen.origenUrl === 'local') {
      if (!this.db) {
        console.error('No se ha establecido la conexión a IndexedDB')
        throw new Error('No se ha establecido la conexión a IndexedDB')
      }
      CancionIndexedDBManager.SaveCancion(this.db, cancion)
    }
    if (origen.origenUrl !== 'fogon') {
      const item = ItemIndiceCancion.BuildFromCancion(cancion, origen)
      const ultimas = new UltimasCanciones()
      console.log('Guardando en ultimas', item)
      ultimas.agregar(item)
    }
  }
}
