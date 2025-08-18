import { AcordeDisplay } from './acordesDisplay'
import { ParteRenglonDisplay } from './parteDisplay'

export class RenglonDisplay {
  public contenido: string = ''
  public partes: ParteRenglonDisplay[] = []
  public continua: boolean = false
  public escontinuacion: boolean = false
  public acordes: AcordeDisplay[] = []
  public compas: number = 0
  public constructor(letras: string[], acordes: string[]) {
    this.contenido = ''
    for (let i = 0; i < acordes.length; i++) {
      this.acordes.push(
        new AcordeDisplay(acordes[i], this.contenido.length * 12),
      )
      this.partes.push(new ParteRenglonDisplay(letras[i]))
      this.contenido += letras[i]
    }
  }
}
