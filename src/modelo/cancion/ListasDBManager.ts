import { ItemIndiceCancion } from './ItemIndiceCancion'

export class ListasDBManager {
  private dbName = 'ListasCanciones'
  private version = 1
  private db: IDBDatabase | null = null

  public async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)

      request.onsuccess = async () => {
        this.db = request.result
        await this.ensureDefaultList()
        resolve()
      }

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('listas')) {
          db.createObjectStore('listas', { keyPath: 'nombre' })
        }
      }
    })
  }

  private async ensureDefaultList(): Promise<void> {
    const listas = await this.GetListas()
    if (!listas.includes('nueva')) {
      await this.AgregarLista('nueva')
    }
  }

  async AgregarLista(nameLista: string): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['listas'], 'readwrite')
      const store = transaction.objectStore('listas')

      const lista = {
        nombre: nameLista,
        canciones: [],
      }

      const request = store.add(lista)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async BorrarLista(nameLista: string): Promise<void> {
    if (nameLista === 'nueva') {
      throw new Error('No se puede borrar la lista "nueva"')
    }

    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['listas'], 'readwrite')
      const store = transaction.objectStore('listas')

      const request = store.delete(nameLista)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async RenombrarLista(nameLista: string, nuevoNombre: string): Promise<void> {
    if (nameLista === 'nueva') {
      throw new Error('No se puede renombrar la lista "nueva"')
    }

    if (!this.db) await this.initDB()

    const canciones = await this.GetCanciones(nameLista)
    await this.BorrarLista(nameLista)
    await this.AgregarLista(nuevoNombre)

    for (const cancion of canciones) {
      await this.AddCancion(nuevoNombre, cancion)
    }
  }

  async GetListas(): Promise<string[]> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['listas'], 'readonly')
      const store = transaction.objectStore('listas')

      const request = store.getAllKeys()
      request.onsuccess = () => resolve(request.result as string[])
      request.onerror = () => reject(request.error)
    })
  }

  async AddCancion(
    nameLista: string,
    elemento: ItemIndiceCancion,
  ): Promise<void> {
    if (!this.db) await this.initDB()

  // Convertir a objeto plano serializable antes de guardar
  const plainElemento = JSON.parse(JSON.stringify(elemento))

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['listas'], 'readwrite')
      const store = transaction.objectStore('listas')

      const getRequest = store.get(nameLista)
      getRequest.onsuccess = () => {
        const lista = getRequest.result
        if (lista) {
          lista.canciones.push(plainElemento) // Usar objeto plano aquí
          const putRequest = store.put(lista)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error(`Lista "${nameLista}" no encontrada`))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async RemoveCancion(nameLista: string, index: number): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['listas'], 'readwrite')
      const store = transaction.objectStore('listas')

      const getRequest = store.get(nameLista)
      getRequest.onsuccess = () => {
        const lista = getRequest.result
        if (lista && lista.canciones[index]) {
          lista.canciones.splice(index, 1)
          const putRequest = store.put(lista)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error(`Índice ${index} no válido en lista "${nameLista}"`))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async ReorderCancion(
    nameLista: string,
    index: number,
    orden: number,
  ): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['listas'], 'readwrite')
      const store = transaction.objectStore('listas')

      const getRequest = store.get(nameLista)
      getRequest.onsuccess = () => {
        const lista = getRequest.result
        if (
          lista &&
          lista.canciones[index] &&
          orden >= 0 &&
          orden < lista.canciones.length
        ) {
          const cancion = lista.canciones.splice(index, 1)[0]
          lista.canciones.splice(orden, 0, cancion)
          const putRequest = store.put(lista)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error(`Índices no válidos en lista "${nameLista}"`))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async GetCanciones(nameLista: string): Promise<ItemIndiceCancion[]> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['listas'], 'readonly')
      const store = transaction.objectStore('listas')

      const request = store.get(nameLista)
      request.onsuccess = () => {
        const lista = request.result
        resolve(lista ? lista.canciones : [])
      }
      request.onerror = () => reject(request.error)
    })
  }
}
