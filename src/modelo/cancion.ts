import { Acordes } from './acordes'
import { Letra } from './letra'

// src/cancion.ts
export class Cancion {
  public cancion: string
  public banda: string
  public acordes: Acordes
  public letras: Letra
  public bpm?: number
  public calidad?: number
  public compasCantidad?: number
  public compasUnidad?: number
  public escala?: string

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

  public get totalCompases(): number {
    let total = 0
    for (let i = 0; i < this.acordes.orden_partes.length; i++) {
      const indice = this.acordes.orden_partes[i]
      total += this.acordes.partes[indice].acordes.length
    }
    return total
  }

  public get duracionCancion(): number {
    return this.totalCompases * this.duracionCompas
  }

  normalizar() {
    const acordes = this.acordes?.GetTotalAcordes()
    const letras = this.letras?.renglones.flat.length
    if (letras < acordes) {
      this.letras?.renglones.push(new Array(acordes - letras).fill(''))
    }
    if (acordes < letras) {
      console.log('Ajustando acordes a letras', acordes, letras)
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
