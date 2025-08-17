import { RenglonDisplay } from './renglondisplay'
import { VersoDisplay } from './versodisplay'

export class Display {
  private anchoLetras: number = 10
  ArmarDisplay(allrenglonLetras: string[][], allrenglonAcordes: string[][]) {
    let desdeAcorde = 0
    for (let i = 0; i < allrenglonLetras.length; i++) {
      const nuevo = new VersoDisplay(
        allrenglonLetras[i],
        allrenglonAcordes[i],
        this.anchoLetras,
        desdeAcorde,
      )
      this.Versos.push(nuevo)
      desdeAcorde += nuevo.hastaAcorde
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
