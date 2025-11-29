import { ItemIndiceCancion } from './ItemIndiceCancion'
import { OrigenCancion } from './origencancion'

export class UltimasCanciones {
  private static readonly STORAGE_KEY = 'ultimas-canciones'
  private static readonly MAX_CANCIONES = 30

  public canciones: ItemIndiceCancion[]

  constructor() {
    this.canciones = []
    this.cargarDeStorage()
  }
  public filtrarSubidas() {
    this.canciones = this.canciones.filter(
      (cancion) => cancion.origenUrl !== 'subida',
    )
    this.guardarEnStorage()
  }

  public agregar(cancion: ItemIndiceCancion): void {
    if (cancion.origenUrl === 'fogon') {
      return
    }
    this.canciones = this.canciones.filter(
      (c) =>
        c.origenUrl === 'fogon' ||
        c.fileName !== cancion.fileName ||
        c.owner !== cancion.owner ||
        c.origenUrl !== cancion.origenUrl,
    )

    this.canciones.unshift(cancion)

    if (this.canciones.length > UltimasCanciones.MAX_CANCIONES) {
      this.canciones = this.canciones.slice(0, UltimasCanciones.MAX_CANCIONES)
    }

    this.guardarEnStorage()
  }

  public obtenerUltimas(): ItemIndiceCancion[] {
    return [...this.canciones]
  }

  private cargarDeStorage(): void {
    try {
      const datosStorage = localStorage.getItem(UltimasCanciones.STORAGE_KEY)
      if (datosStorage) {
        const datos = JSON.parse(datosStorage)
        if (Array.isArray(datos)) {
          this.canciones = datos.map((item) => {
            const toRet = new ItemIndiceCancion(
              new OrigenCancion(item.origenUrl, item.fileName, item.owner),
              item.cancion,
              item.banda,
            )
            toRet.escala = item.escala
            toRet.totalCompases = item.totalCompases
            toRet.compasUnidad = item.compasUnidad
            toRet.compasCantidad = item.compasCantidad
            toRet.bpm = item.bpm
            toRet.owner = item.owner
            toRet.calidad = item.calidad
            return toRet
          })
        }
      }
    } catch (error) {
      console.error('Error al cargar últimas canciones del storage:', error)
      this.canciones = []
    }
  }

  private guardarEnStorage(): void {
    try {
      localStorage.setItem(
        UltimasCanciones.STORAGE_KEY,
        JSON.stringify(this.canciones),
      )
    } catch (error) {
      console.error('Error al guardar últimas canciones en storage:', error)
    }
  }
}
