export class Letra {
  renglones: string[][]

  RenglonDelCompas(nroCompas: number): number {
    const renglones = this.renglones.flat().slice(0, nroCompas).join('')
    return renglones.split('/n').length
  }

  constructor(renglones: string[][]) {
    this.renglones = renglones
  }
}
