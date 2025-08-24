import { PentagramaCompas } from '../cancion/pentagramacompas'
import type { EstiloAcorde } from './estiloAcorde'

export class EstiloEditandoCompas {
  GetCompas(acorde: string): PentagramaCompas {
    const nuevoCompas = new PentagramaCompas([])
    for (const estilo of this.acordes) {
      const notas = estilo.GetNotas(acorde)
      nuevoCompas.notas.push(notas)
    }

    return nuevoCompas
  }
  public notas: string[] = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma']
  public nomntrnotas: string[] = []
  public acordes: EstiloAcorde[] = []
}
