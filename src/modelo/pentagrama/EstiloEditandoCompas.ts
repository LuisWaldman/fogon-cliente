import { PentagramaCompas } from '../cancion/pentagramacompas'
import type { EstiloAcorde } from './estiloAcorde'

export class EstiloEditandoCompas {
  GetCompas(
    acorde: string,
    octava: number,
    esBateria: boolean,
  ): PentagramaCompas {
    const nuevoCompas = new PentagramaCompas([])
    for (const estilo of this.acordes) {
      const notas = estilo.GetNotas(acorde, octava, esBateria)
      nuevoCompas.notas.push(notas)
    }

    return nuevoCompas
  }
  public notasInstrumentos: string[] = [
    '1ra',
    '2da',
    '3ra',
    '4ta',
    '5ta',
    '6ta',
    '7ma',
  ]
  public notasBateria: string[] = [
    'Bombo',
    'Caja',
    'Matraca',
    'Platillo Abierto',
    'Platillo Cerrado',
    'Triangolo',
    'Silbato',
    'Crash',
  ]
  public nomntrnotas: string[] = []
  public acordes: EstiloAcorde[] = []
}
