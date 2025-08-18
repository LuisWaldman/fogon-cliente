import { ItemIndiceCancion } from './ItemIndiceCancion'
import { OrigenCancion } from './origencancion'

export class UltimasCanciones {
  private static readonly STORAGE_KEY = 'ultimas-canciones'
  private static readonly MAX_CANCIONES = 20

  public canciones: ItemIndiceCancion[]

  constructor() {
    this.canciones = []
    this.cargarDeStorage()
  }

  public agregar(cancion: ItemIndiceCancion): void {
    this.canciones = this.canciones.filter(
      (c) =>
        c.origen.fileName !== cancion.origen.fileName ||
        c.origen.origenUrl !== cancion.origen.origenUrl ||
        c.origen.usuario !== cancion.origen.usuario ||
        c.cancion !== cancion.cancion ||
        c.banda !== cancion.banda,
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
              new OrigenCancion(
                item.origen.origenUrl,
                item.origen.fileName,
                item.origen.usuario,
              ),
              item.cancion,
              item.banda,
            )
            toRet.escala = item.escala
            toRet.totalCompases = item.totalCompases
            toRet.compasUnidad = item.compasUnidad
            toRet.compasCantidad = item.compasCantidad
            toRet.bpm = item.bpm
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
