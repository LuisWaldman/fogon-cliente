import { AcordeDisplay } from './acordesDisplay'
import { RenglonDisplay } from './renglondisplay'

export class Display {
  private anchoLetras: number = 10
  ArmarDisplay(allrenglonLetras: string[][], allrenglonAcordes: string[][]) {
    for (let i = 0; i < allrenglonLetras.length; i++) {
      const renglonLetras = allrenglonLetras[i]
      const renglonAcordes = allrenglonAcordes[i]
      const renglondisplay = new RenglonDisplay()
      for (let j = 0; j < renglonAcordes.length; j++) {
        const acorde = renglonAcordes[j]
        renglondisplay.acordes.push(
          new AcordeDisplay(
            acorde,
            renglondisplay.contenido.length * this.anchoLetras,
            0,
          ),
        )
        renglondisplay.contenido += renglonLetras[j]
      }
      this.renglones.push(renglondisplay)
    }
    this.calculado = true
  }
  public anchoRenglones: number
  public Renglones: RenglonDisplay[] = []
  public constructor(anchoRenglones: number) {
    this.anchoRenglones = anchoRenglones
    this.calculado = false
  }
  public calculado: boolean = false
  public renglones: RenglonDisplay[] = []
}
