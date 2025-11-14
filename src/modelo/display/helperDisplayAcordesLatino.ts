/**
 * Clase singleton para manejar la conversión de acordes de cifrado americano a notación latina.
 */
export class HelperDisplayAcordesLatino {
  private static instance: HelperDisplayAcordesLatino
  private acordesMap: Map<string, string> = new Map()
  public latino: boolean = true

  /**
   * Constructor privado para evitar instanciación directa.
   */
  private constructor() {
    this.inicializarAcordesBasicos()
  }

  /**
   * Obtiene la instancia única de la clase.
   */
  public static getInstance(): HelperDisplayAcordesLatino {
    if (!HelperDisplayAcordesLatino.instance) {
      HelperDisplayAcordesLatino.instance = new HelperDisplayAcordesLatino()
    }
    return HelperDisplayAcordesLatino.instance
  }

  /**
   * Mapa inverso para convertir de notación latina a americana.
   */
  private acordesMapInverso: Map<string, string> = new Map()

  /**
   * Inicializa el mapa con acordes básicos.
   */
  private inicializarAcordesBasicos(): void {
    // Notas básicas
    const notasAmericanas = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ]
    const notasLatinas = [
      'Do',
      'Do#',
      'Re',
      'Re#',
      'Mi',
      'Fa',
      'Fa#',
      'Sol',
      'Sol#',
      'La',
      'La#',
      'Si',
    ]

    // Mapear notas básicas
    for (let i = 0; i < notasAmericanas.length; i++) {
      this.acordesMap.set(notasAmericanas[i], notasLatinas[i])
      this.acordesMapInverso.set(notasLatinas[i], notasAmericanas[i])
    }

    // Equivalencias de bemoles// Equivalencias de bemoles en notación latina
    this.acordesMap.set('Db', 'Reb')
    this.acordesMap.set('Eb', 'Mib')
    this.acordesMap.set('Gb', 'Solb')
    this.acordesMap.set('Ab', 'Lab')
    this.acordesMap.set('Bb', 'Sib')

    // Mapa inverso de bemoles
    this.acordesMapInverso.set('Reb', 'Db')
    this.acordesMapInverso.set('Mib', 'Eb')
    this.acordesMapInverso.set('Solb', 'Gb')
    this.acordesMapInverso.set('Lab', 'Ab')
    this.acordesMapInverso.set('Sib', 'Bb')
  }

  /**
   * Convierte uno o varios acordes de cifrado americano a notación latina.
   * @param acordeAmericano Acorde(s) en cifrado americano (ej. "C", "Am", "G7", "D#m7", "C D")
   * @returns Acorde(s) en notación latina
   */
  public GetAcorde(acordeAmericano: string): string {
    if (!this.latino) {
      return acordeAmericano
    }
    return acordeAmericano
      .split(' ')
      .map((acorde) => {
        if (this.acordesMap.has(acorde)) {
          return this.acordesMap.get(acorde)!
        }
        const notaBase = this.extraerNotaBase(acorde)
        const sufijo = acorde.substring(notaBase.length)
        // Si la nota base termina en 'b', convertir a notación latina bemol
        let notaLatina = this.acordesMap.get(notaBase)
        if (!notaLatina && notaBase.length === 2 && notaBase[1] === 'b') {
          // Ejemplo: Bb -> Sib, Ab -> Solb, etc.
          const base = this.acordesMap.get(notaBase[0]) || notaBase[0]
          notaLatina = base + 'b'
        }
        notaLatina = notaLatina || notaBase
        const acordeLatino = notaLatina + sufijo
        this.acordesMap.set(acorde, acordeLatino)
        return acordeLatino
      })
      .join(' ')
  }

  /**
   * Convierte uno o varios acordes de notación latina a cifrado americano (inversa de GetAcorde).
   * @param acordeLatino Acorde(s) en notación latina (ej. "Do", "Lam", "Sol7", "Re#m7", "Do Re")
   * @returns Acorde(s) en cifrado americano
   */
  public GetAcordeAmericano(acordeLatino: string): string {
    if (!this.latino) {
      return acordeLatino
    }
    return acordeLatino
      .split(' ')
      .map((acorde) => {
        if (this.acordesMapInverso.has(acorde)) {
          return this.acordesMapInverso.get(acorde)!
        }
        const notaBase = this.extraerNotaBaseLatina(acorde)
        const sufijo = acorde.substring(notaBase.length)
        // Si la nota base termina en 'b', convertir a notación americana bemol
        let notaAmericana = this.acordesMapInverso.get(notaBase)
        if (!notaAmericana && notaBase.endsWith('b')) {
          // Ejemplo: Solb -> Gb, Lab -> Ab, Reb -> Db, etc.
          const base =
            this.acordesMapInverso.get(
              notaBase.substring(0, notaBase.length - 1),
            ) || notaBase.substring(0, notaBase.length - 1)
          notaAmericana = base + 'b'
        }
        notaAmericana = notaAmericana || notaBase
        const acordeAmericano = notaAmericana + sufijo
        this.acordesMapInverso.set(acorde, acordeAmericano)
        return acordeAmericano
      })
      .join(' ')
  }

  /**
   * Extrae la nota base de un acorde en notación americana.
   * @param acorde Acorde completo
   * @returns Nota base (ej. "C", "D#", "Bb")
   */
  private extraerNotaBase(acorde: string): string {
    if (acorde.length > 1 && (acorde[1] === '#' || acorde[1] === 'b')) {
      return acorde.substring(0, 2)
    }
    return acorde.substring(0, 1)
  }

  /**
   * Extrae la nota base de un acorde en notación latina.
   * @param acorde Acorde completo
   * @returns Nota base (ej. "Do", "Re#", "Solb")
   */
  private extraerNotaBaseLatina(acorde: string): string {
    // Las notas latinas pueden ser: Do, Re, Mi, Fa, Sol, La, Si
    // Pueden incluir # o b después

    // Verificar notas de 3 letras primero (Sol)
    const primerosTres = acorde.substring(0, 3)
    if (primerosTres === 'Sol') {
      // Verificar si tiene sostenido o bemol después
      if (acorde.length > 3 && (acorde[3] === '#' || acorde[3] === 'b')) {
        return acorde.substring(0, 4)
      }
      return primerosTres
    }

    // Verificar notas de dos letras: Do, Re, Mi, Fa, La, Si
    const notasDosLetras = ['Do', 'Re', 'Mi', 'Fa', 'La', 'Si']
    const primerosDos = acorde.substring(0, 2)
    if (notasDosLetras.includes(primerosDos)) {
      // Verificar si tiene sostenido o bemol después
      if (acorde.length > 2 && (acorde[2] === '#' || acorde[2] === 'b')) {
        return acorde.substring(0, 3)
      }
      return primerosDos
    }

    // Fallback: primera letra
    return acorde.substring(0, 1)
  }
}
