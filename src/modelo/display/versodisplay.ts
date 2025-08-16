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
      this.hastaAcorde = contAcorde
      this.renglonesDisplay.push(
        new RenglonDisplay(verso, acordes, anchoLetras),
      )
    }
  }
}
