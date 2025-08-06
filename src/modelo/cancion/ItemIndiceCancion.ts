import type { Cancion } from './cancion'
import type { OrigenCancion } from './origencancion'

export class ItemIndiceCancion {
  normalizartexto(texto: string): string {
    return texto
      .toLowerCase()
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(' ', '_')
  }
  normalizar() {
    if (this.origen.fileName === '') {
      this.origen.fileName =
        this.normalizartexto(this.cancion) +
        '_' +
        this.normalizartexto(this.banda)
    }
  }
  public escala: string
  public totalCompases: number
  public compasUnidad: number
  public compasCantidad: number
  public bpm: number
  public calidad: number
  public etiquetas: string[]

  public origen: OrigenCancion
  public cancion: string
  public banda: string
  constructor(_origen: OrigenCancion, _cancion: string, _banda: string) {
    this.origen = _origen
    this.cancion = _cancion
    this.banda = _banda
    this.etiquetas = []
    this.escala = ''
    this.totalCompases = 0
    this.compasUnidad = 0
    this.compasCantidad = 4
    this.bpm = 60
    this.calidad = 1
    this.escala = ''
  }

  public static BuildFromCancion(
    cancion: Cancion,
    origen: OrigenCancion,
  ): ItemIndiceCancion {
    const ret = new ItemIndiceCancion(origen, cancion.cancion, cancion.banda)
    ret.escala = cancion.escala ? cancion.escala : ''
    ret.totalCompases = cancion.totalCompases ? cancion.totalCompases : 0
    ret.compasUnidad = cancion.compasUnidad ? cancion.compasUnidad : 0
    ret.compasCantidad = cancion.compasCantidad ? cancion.compasCantidad : 4
    ret.bpm = cancion.bpm ? cancion.bpm : 60
    ret.calidad = cancion.calidad ? cancion.calidad : 0
    return ret
  }
}
