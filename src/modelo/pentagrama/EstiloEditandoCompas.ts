import { PentagramaCompas } from '../cancion/pentagramacompas'
import type { EstiloAcorde } from './estiloAcorde'

export class EstiloEditandoCompas {
  GetCompas(acorde: string): PentagramaCompas {
    const nuevoCompas = new PentagramaCompas()
    for (const estilo of this.acordes) {
      const notas = estilo.GetNotas(acorde)

      nuevoCompas.notas.push(notas)
    }

    return nuevoCompas
  }
  public acordes: EstiloAcorde[] = []
}
