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
import { ListasServerManager } from './ListasServerManager'
import { Logger } from '../logger'

export class CancionManager {
  private static instance: CancionManager

  private constructor() {}

  private cliente: ClienteSocket | null = null
  private db: IDBDatabase | null = null
  public listasServerManager: ListasServerManager | null = null
  public setCliente(cliente: ClienteSocket): void {
    this.cliente = cliente
    this.listasServerManager = new ListasServerManager(cliente)
  }
  private getDBConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MiBaseDeDatos', 3) // Cambiar versión de 1 a 2

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Crear el objectStore si no existe
        if (!db.objectStoreNames.contains('canciones')) {
          db.createObjectStore('canciones', { keyPath: 'archivo' })
        }

        // Crear el objectStore para el índice si no existe
        if (!db.objectStoreNames.contains('indice')) {
          db.createObjectStore('indice', { keyPath: 'fileName' })
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
        Logger.log('Conexión a IndexedDB establecida')
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
      return CancionServerManager.GetCancion(origencancion, this.cliente)
    }
    if (origencancion.origenUrl === 'subida') {
      return CancionSubidasManager.GetCancion(origencancion)
    }

    if (origencancion.origenUrl === 'fogon') {
      return CancionFogonManager.GetCancion(origencancion, this.cliente)
    }
    if (origencancion.origenUrl === 'local') {
      if (!this.db) {
        console.error('No se ha establecido la conexión a IndexedDB')
        throw new Error('No se ha establecido la conexión a IndexedDB')
      }
      return CancionIndexedDBManager.GetCancion(origencancion, this.db)
    }
    Logger.log('Recuperando canción desde URL:', origencancion.origenUrl)
    if (origencancion.origenUrl === 'server') {
      return CancionServerManager.GetCancion(origencancion, this.cliente)
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
      CancionServerManager.SaveCancion(cancion, this.cliente)
    } else if (origen.origenUrl === 'fogon') {
      CancionFogonManager.SaveCancion(cancion, this.cliente)
    } else if (origen.origenUrl === 'subida') {
      CancionSubidasManager.SaveCancion(cancion)
    } else if (origen.origenUrl === 'local') {
      if (!this.db) {
        console.error('No se ha establecido la conexión a IndexedDB')
        throw new Error('No se ha establecido la conexión a IndexedDB')
      }
      CancionIndexedDBManager.SaveCancion(this.db, cancion)
    }

    const item = ItemIndiceCancion.BuildFromCancion(cancion, origen)
    const ultimas = new UltimasCanciones()
    Logger.log('Guardando en ultimas', item)
    ultimas.agregar(item)
  }

  public async Borrar(cancion: ItemIndiceCancion): Promise<void> {
    if (cancion.origenUrl === 'local') {
      if (!this.db) {
        console.error('No se ha establecido la conexión a IndexedDB')
        throw new Error('No se ha establecido la conexión a IndexedDB')
      }
      return CancionIndexedDBManager.Borrar(this.db, cancion)
    }
  }

  public async GetDBIndex(): Promise<ItemIndiceCancion[]> {
    if (!this.db) {
      console.error('No se ha establecido la conexión a IndexedDB')
      throw new Error('No se ha establecido la conexión a IndexedDB')
    }
    return CancionIndexedDBManager.GetDBIndex(this.db)
  }

  public async GetServerIndex(): Promise<ItemIndiceCancion[]> {
    const response = await this.cliente?.HTTPGET('indice/owner')
    if (!response) {
      return []
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => {
      const origen = new OrigenCancion(
        'server',
        item.origen?.fileName || '',
        item.owner || '',
      )
      const indiceItem = new ItemIndiceCancion(
        origen,
        item.cancion || '',
        item.banda || '',
      )

      // Mapear propiedades adicionales si existen en la respuesta
      indiceItem.escala = item.escala || ''
      indiceItem.totalCompases = item.totalCompases || 0
      indiceItem.compasUnidad = item.compasUnidad || 0
      indiceItem.compasCantidad = item.compasCantidad || 4
      indiceItem.bpm = Number(item.bpm) || 60
      indiceItem.cantacordes = item.cantacordes || 0
      indiceItem.cantpartes = item.cantpartes || 0
      indiceItem.calidad = item.calidad || 1
      indiceItem.video = item.video || false
      indiceItem.pentagramas = item.pentagramas || []
      indiceItem.etiquetas = item.etiquetas || []
      indiceItem.owner = item.owner || ''

      return indiceItem
    })
  }
}
