import { EstiloAcorde } from './estiloAcorde'
import { EstiloEditandoCompas } from './EstiloEditandoCompas'

export class PatronRitmicoAcorde {
  public duracionId: number
  public tiposNota: string[]
  constructor(duracionId: number, tiposNota: string[]) {
    this.duracionId = duracionId
    this.tiposNota = tiposNota
  }
}

export class PatronRitmico {
  public nombre: string
  public acordes: PatronRitmicoAcorde[]
  constructor(nombre: string, acordes: PatronRitmicoAcorde[]) {
    this.nombre = nombre
    this.acordes = acordes
  }
  public GetEstilo(): EstiloEditandoCompas {
    const estilo = new EstiloEditandoCompas()
    estilo.acordes = this.acordes.map((a) => {
      const toRet = new EstiloAcorde(a.duracionId, a.tiposNota.length)
      toRet.tiposNota = a.tiposNota
      return toRet
    })
    return estilo
  }

  private static patrones: PatronRitmico[] = []
  private static GenerarPatrones() {
    const Acorde = new PatronRitmico('Acorde', [
      new PatronRitmicoAcorde(0, ['o', 'x', 'o', 'x', 'o', 'x', 'x']),
    ])
    this.patrones.push(Acorde)

    const Melodico = new PatronRitmico('Melodico', [
      new PatronRitmicoAcorde(2, ['o', 'x', 'o', 'x', 'o', 'x', 'x']),
      new PatronRitmicoAcorde(2, ['o', 'x', 'x', 'x', 'x', 'x', 'x']),
      new PatronRitmicoAcorde(2, ['x', 'x', 'o', 'x', 'x', 'x', 'x']),
      new PatronRitmicoAcorde(2, ['x', 'x', 'x', 'x', 'o', 'x', 'x']),
    ])
    this.patrones.push(Melodico)
  }

  public static GetPatrones() {
    if (this.patrones.length === 0) {
      this.GenerarPatrones()
    }
    return this.patrones
  }
}
