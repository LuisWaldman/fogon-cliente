import { AcordeDisplay } from './acordesDisplay'

export class RenglonDisplay {
  public contenido: string = ''
  public continua: boolean = false
  public escontinuacion: boolean = false
  public acordes: AcordeDisplay[] = []
  public constructor(
    letras: string[],
    acordes: string[],
    contCompas: number = 0,
  ) {
    this.contenido = ''
    for (let i = 0; i < acordes.length; i++) {
      if (acordes[i] != '.') {
        contCompas++
      }
      this.acordes.push(
        new AcordeDisplay(acordes[i], this.contenido.length * 10, contCompas),
      )
      this.contenido += letras[i]
    }
  }
}
