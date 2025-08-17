import { RenglonDisplay } from './renglondisplay'

export class VersoDisplay {
  public contenido: string = ''
  public hastaAcorde: number = 0
  public desdeAcorde: number = 0
  renglonesDisplay: RenglonDisplay[] = []
  public constructor(
    verso: string[],
    acordes: string[],
    anchoLetras: number = 80,
    contAcorde: number = 0,
  ) {
    this.contenido = verso.join('')
    this.desdeAcorde = contAcorde
    if (this.contenido.length < anchoLetras) {
      this.renglonesDisplay.push(new RenglonDisplay(verso, acordes, contAcorde))
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
          this.renglonesDisplay.push(
            new RenglonDisplay(versoAcu, acordesAco, contAcorde),
          )
          const segPart = verso[cont].substring(
            anchoLetras - acu.length,
            verso[cont].length,
          )
          acordesAco = ['.']
          versoAcu = [segPart]
          contAcorde += acu.length
          acu = verso[cont]
        }
        cont++
      }
      this.renglonesDisplay.push(
        new RenglonDisplay(versoAcu, acordesAco, contAcorde),
      )
    }
  }
}
