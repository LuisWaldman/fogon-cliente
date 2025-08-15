import type { ClienteSocket } from '../conexion/ClienteSocket'
import { Cancion } from './cancion'
import { ItemIndiceCancion } from './ItemIndiceCancion'
import { OrigenCancion } from './origencancion'
import { CancionServerManager } from './CancionServerManager'
import { UltimasCanciones } from './ultimascanciones'
import { CancionUrlManager } from './CancionUrlManager'
import { CancionIndexedDBManager } from './CancionIndexedDBManager'

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

  public async Save(origen: string, cancion: Cancion): Promise<void> {
    return CancionIndexedDBManager.SaveSong(this.db, cancion)
  }
}
