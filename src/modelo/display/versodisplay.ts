import { SeparadorSilabas } from '../cancion/SeparadorSilabas'
import { RenglonDisplay } from './renglondisplay'

export class VersoDisplay {
  public contenido: string = ''
  public hastaAcorde: number = 0
  public desdeAcorde: number = 0
  public resumenverso: string = ''
  renglonesDisplay: RenglonDisplay[] = []
  public constructor(
    verso: string[],
    acordes: string[],
    anchoLetras: number = 80,
  ) {
    this.contenido = verso.join('')
    this.CalcularResumenVerso()
    if (this.contenido.length < anchoLetras) {
      this.renglonesDisplay.push(new RenglonDisplay(verso, acordes))
    } else {
      let versoAcu: string[] = []
      let acordesAco: string[] = []
      let acu = ''
      let cont = 0
      while (cont < verso.length) {
        if (acu.length + verso[cont].length < anchoLetras) {
          acu += verso[cont]
          versoAcu.push(verso[cont])
          acordesAco.push(acordes[cont])
        } else {
          const priPart = verso[cont].substring(0, anchoLetras - acu.length)
          versoAcu.push(priPart)
          acordesAco.push(acordes[cont])
          this.renglonesDisplay.push(new RenglonDisplay(versoAcu, acordesAco))
          const segPart = verso[cont].substring(
            anchoLetras - acu.length,
            verso[cont].length,
          )
          acordesAco = ['.']
          versoAcu = [segPart]
          acu = verso[cont]
        }
        cont++
      }
      this.renglonesDisplay.push(new RenglonDisplay(versoAcu, acordesAco))
    }
  }
  CalcularResumenVerso() {
    const palabras = this.contenido.split(' ')
    let silabas = 0
    this.resumenverso = palabras.length +  ' Palabras '
    const sepSilabas = new SeparadorSilabas()
    for (let i = 0; i < palabras.length; i++) {
      const silabasPalabra = sepSilabas.getSilabas(palabras[i])
      silabas += silabasPalabra.silabas.length
      //this.resumenverso += silabasPalabra.silabas.length
    }
    this.resumenverso += silabas + ' Sílabas'
  }
}
