export class HelperMusica {
  private static readonly NOTAS_VALIDAS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

  static getNotaSimple(input: string): string {
    const inputTrim = input.trim()
    const nota = inputTrim.charAt(0).toUpperCase()
    if (!this.NOTAS_VALIDAS.includes(nota)) {
      return '?'
    }
    let mod = ''
    const rest = inputTrim.slice(1).toLowerCase()
    if (rest.includes('b')) {
      mod += 'b'
    }
    if (rest.includes('#')) {
      mod += '#'
    }
    if (rest.includes('m')) {
      mod += 'm'
    }
    if (rest.includes('3')) {
      mod += '3'
    }
    if (rest.includes('5')) {
      mod += '5'
    }
    if (rest.includes('7')) {
      mod += '7'
    }
    if (rest.includes('9')) {
      mod += '9'
    }
    return nota + mod
  }
  static getNota(input: string): string {
    return input
      .split('/')
      .map((part) => {
        return this.getNotaSimple(part)
      })
      .join('/')
  }
}
