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
    if (this.origen.fileName === undefined) {
      this.origen.fileName = ''
    }
    if (this.origen.fileName === '') {
      this.origen.fileName =
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
  public duracion: number
  public video: boolean
  public pentagramas: string[]
  public etiquetas: string[]

  public origen: OrigenCancion
  public cancion: string
  public banda: string
  public acordes: string
  constructor(_origen: OrigenCancion, _cancion: string, _banda: string) {
    this.origen = _origen
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
    this.duracion = 0
    this.cantpartes = 0
    this.cantacordes = 0
    this.video = false
    this.pentagramas = []
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
    ret.cantpartes = cancion.acordes.partes.length
    ret.bpm = cancion.bpm ? cancion.bpm : 60
    ret.calidad = cancion.calidad ? cancion.calidad : 0
    ret.origen = new OrigenCancion(
      origen.origenUrl,
      origen.fileName,
      origen.usuario,
    )
    return ret
  }
}
