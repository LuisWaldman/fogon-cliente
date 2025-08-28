export class EditAcordeNotas {
  public patrones: string[] = []
  public constructor(patronLenght: number) {
    for (let i = 0; i < patronLenght; i++) {
      this.patrones.push('x')
    }
  }
}
