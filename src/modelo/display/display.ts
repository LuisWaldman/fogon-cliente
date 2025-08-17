import { RenglonDisplay } from './renglondisplay'
import { VersoDisplay } from './versodisplay'

export class Display {
  private anchoLetras: number = 80
  ArmarDisplay(allrenglonLetras: string[][], allrenglonAcordes: string[][]) {
    for (let i = 0; i < allrenglonLetras.length; i++) {
      const nuevo = new VersoDisplay(
        allrenglonLetras[i],
        allrenglonAcordes[i],
        this.anchoLetras,
      )
      this.Versos.push(nuevo)
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
