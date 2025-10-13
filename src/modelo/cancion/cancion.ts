import { Acordes } from './acordes'
import { ItemIndiceCancion } from './ItemIndiceCancion'
import { Letra } from './letra'
import type { Media } from './media'
import { OrigenCancion } from './origencancion'
import type { Pentagrama } from './pentagrama'

// src/cancion.ts
export class Cancion {
  public archivo: string = ''
  public cancion: string
  public banda: string
  public acordes: Acordes
  public letras: Letra
  public bpm?: number
  public calidad?: number
  public compasCantidad: number
  public compasUnidad: number
  public escala: string = 'C'
  public etiquetas: string[] = []
  public medias: Media[] = []
  public pentagramas: Pentagrama[] = []

  public static GetDefault(nombre: string): Cancion {
    const ret = new Cancion(
      nombre,
      'sin banda',
      new Acordes([], []),
      new Letra([]),
    )
    ret.escala = 'C'
    return ret
  }

  public get duracionCompas(): number {
    if (this.compasUnidad === 0) {
      return 0
    }
    if (!this.bpm) {
      return 0
    }
    if (!this.compasCantidad) {
      return 0
    }
    return (60 / this.bpm) * this.compasCantidad
  }

  public get duracionGolpe(): number {
    if (!this.bpm) {
      return 0
    }
    return 60 / this.bpm
  }

  public get totalCompases(): number {
    let total = 0
    for (let i = 0; i < this.acordes.ordenPartes.length; i++) {
      const indice = this.acordes.ordenPartes[i]
      total += this.acordes.partes[indice].acordes.length
    }
    return total
  }

  public get duracionCancion(): number {
    return this.totalCompases * this.duracionCompas
  }

  normalizar() {
    const acordes = this.acordes?.GetTotalAcordes()
    const totalLetras = this.letras?.renglones.flat.length
    if (this.letras?.renglones[0]?.length === 0) {
      this.letras.renglones.shift()
    }

    if (totalLetras < acordes) {
      this.letras?.renglones.push(new Array(acordes - totalLetras).fill(''))
    }
    if (acordes < totalLetras) {
      console.log('Ajustando acordes a letras', acordes, totalLetras)
    }
  }

  constructor(
    cancion: string,
    banda: string,
    acordes?: Acordes,
    letras?: Letra,
    bpm?: number,
    calidad?: number,
    compasCantidad?: number,
    compasUnidad?: number,
    escala?: string,
  ) {
    this.cancion = cancion
    this.banda = banda
    this.acordes = acordes ?? new Acordes([], [])
    this.letras = letras ?? new Letra([])
    this.bpm = bpm ?? 67
    this.calidad = calidad ?? 0
    this.compasCantidad = compasCantidad ?? 4
    this.compasUnidad = compasUnidad ?? 4
    this.escala = escala ?? ''
  }
}
