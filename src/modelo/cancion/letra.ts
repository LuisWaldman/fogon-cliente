export class Letra {
  renglones: string[][]

  RenglonDelCompas(nroCompas: number): number {
    const renglones = this.renglones.flat().slice(0, nroCompas).join('')
    return renglones.split('/n').length
  }

  GetTodosLosRenglones(): string[] {
    const ret: string[] = []
    for (let i = 0; i < this.renglones.length; i++) {
      ret.push(...this.renglones[i])
    }
    return ret
  }

  constructor(renglones: string[][]) {
    this.renglones = renglones
  }
}
