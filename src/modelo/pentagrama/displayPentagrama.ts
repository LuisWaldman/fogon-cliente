import { Pentagrama } from '../cancion/pentagrama'
import { DisplayInstrumentoPentagrama } from './DisplayInstrumentoPentagrama'
import { DisplaySistemaPentagrama } from './DisplaySistemaPentagrama'
import { HelperPentagramas } from './helperPentagramas'

export class DisplayPentagrama {
  public renglones: DisplaySistemaPentagrama[] = []

  GetSistema(idsistema: number): DisplaySistemaPentagrama {
    if (this.renglones.length <= idsistema) {
      this.renglones.push(new DisplaySistemaPentagrama())
    }
    if (this.renglones[idsistema] == undefined) {
      this.renglones[idsistema] = new DisplaySistemaPentagrama()
    }
    return this.renglones[idsistema]
  }

  AgregarPartitura(pentagrama: Pentagrama, escala: string): void {
    let sistema = 0
    let renglon = this.GetSistema(sistema)
    let nInstru = new DisplayInstrumentoPentagrama([], pentagrama.clave)
    const helper = new HelperPentagramas()
    //renglon.pentagramas.push(nInstru)

    for (let i = 0; i < pentagrama.compases.length; i++) {
      const compPenta = helper.creaCompasPentagrama(
        pentagrama.compases[i],
        i,
        escala,
      )
      nInstru.compases.push(compPenta)

      if ((i + 1) % 4 === 0) {
        renglon = this.GetSistema(sistema)
        renglon.pentagramas.push(nInstru)
        nInstru = new DisplayInstrumentoPentagrama([], pentagrama.clave)
        sistema++
      }
    }
    if (nInstru.compases.length > 0) {
      sistema++
      renglon = this.GetSistema(sistema)
      renglon.pentagramas.push(nInstru)
    }
  }
}
