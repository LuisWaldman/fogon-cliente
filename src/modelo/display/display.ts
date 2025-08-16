import { RenglonDisplay } from './renglondisplay'
import { VersoDisplay } from './versodisplay'

export class Display {
  private anchoLetras: number = 10
  ArmarDisplay(allrenglonLetras: string[][], allrenglonAcordes: string[][]) {
    for (let i = 0; i < allrenglonLetras.length; i++) {
      this.Versos.push(
        new VersoDisplay(allrenglonLetras[i], allrenglonAcordes[i]),
      )
    }
  }

  public anchoRenglones: number
  public Versos: VersoDisplay[] = []
  public constructor(anchoRenglones: number) {
    this.anchoRenglones = anchoRenglones
    this.calculado = false
  }
  public calculado: boolean = false
  public renglones: RenglonDisplay[] = []
}
