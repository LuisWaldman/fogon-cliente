import type { Cancion } from './cancion'
import { OrigenCancion } from './origencancion'

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
    if (this.fileName === undefined) {
      this.fileName = ''
    }
    if (this.fileName === '') {
      this.fileName =
        this.normalizartexto(this.banda) +
        '_' +
        this.normalizartexto(this.cancion)
    }
  }
  duracionCancion(): number {
    return this.totalCompases * ((60 / this.bpm) * this.compasCantidad)
  }

  public escala: string
  public totalCompases: number
  public compasUnidad: number
  public compasCantidad: number
  public bpm: number
  public cantacordes: number
  public cantpartes: number
  public calidad: number
  public video: boolean
  public pentagramas: string[]
  public etiquetas: string[]

  public cancion: string
  public banda: string
  public acordes: string
  public owner: string
  public origenUrl: string
  public fileName: string
  public static GetOrigen(desde: ItemIndiceCancion): OrigenCancion {
    return new OrigenCancion(desde.origenUrl, desde.fileName, desde.owner)
  }
  constructor(_origen: OrigenCancion, _cancion: string, _banda: string) {
    this.origenUrl = _origen.origenUrl
    this.fileName = _origen.fileName
    this.owner = _origen.usuario
    this.acordes = ''
    this.cancion = _cancion
    this.banda = _banda
    this.etiquetas = []
    this.escala = ''
    this.totalCompases = 0
    this.compasUnidad = 0
    this.compasCantidad = 4
    this.bpm = 60
    this.calidad = 1
    this.cantpartes = 0
    this.cantacordes = 0
    this.video = false
    this.pentagramas = []
    this.escala = ''
    this.owner = ''
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
    ret.cantpartes = cancion.acordes.partes.length
    ret.bpm = cancion.bpm ? cancion.bpm : 60
    ret.calidad = cancion.calidad ? cancion.calidad : 0
    ret.origenUrl = origen.origenUrl
    ret.fileName = origen.fileName
    ret.owner = origen.usuario
    return ret
  }
}
