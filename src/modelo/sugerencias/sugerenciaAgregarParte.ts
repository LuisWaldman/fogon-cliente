import { Parte } from '../cancion/acordes'
import type { Cancion } from '../cancion/cancion'
import { MusicaHelper } from '../cancion/MusicaHelper'
import { Sugerencia } from './sugerencia'

export class SugerenciaAgregarParte extends Sugerencia {
  private readonly secuencia: number[]
  grados = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
  private readonly musicaHelper = new MusicaHelper()

  constructor(cancion: Cancion, secuencia: number[]) {
    super()
    const Escala = this.musicaHelper.GetNotasdeescala(cancion.escala)
    let desc = 'Agregar: '
    for (let i = 0; i < secuencia.length; i++) {
      if (i > 0) {
        desc += ', '
      }
      desc += this.grados[secuencia[i] - 1] + ' ' + Escala[secuencia[i] - 1]
    }
    this.descripcion = desc
    this.secuencia = secuencia
  }

  override aplicarSugerencia(cancion: Cancion): void {
    const lenParte = cancion.acordes.partes.length
    const nParte = 'Parte ' + (lenParte + 1)
    const Escala = this.musicaHelper.GetNotasdeescala(cancion.escala)
    const acordes: string[] = []
    for (let i = 0; i < this.secuencia.length; i++) {
      acordes.push(Escala[this.secuencia[i] - 1])
    }
    const parte = new Parte(nParte, acordes)
    cancion.acordes.partes.push(parte)
    cancion.acordes.ordenPartes.push(lenParte)
  }
}
