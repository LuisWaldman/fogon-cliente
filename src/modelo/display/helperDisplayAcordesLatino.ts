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
    }

    // Equivalencias de bemoles// Equivalencias de bemoles en notación latina
    this.acordesMap.set('Db', 'Reb')
    this.acordesMap.set('Eb', 'Mib')
    this.acordesMap.set('Gb', 'Solb')
    this.acordesMap.set('Ab', 'Lab')
    this.acordesMap.set('Bb', 'Sib')
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
   * Extrae la nota base de un acorde.
   * @param acorde Acorde completo
   * @returns Nota base (ej. "C", "D#", "Bb")
   */
  private extraerNotaBase(acorde: string): string {
    if (acorde.length > 1 && (acorde[1] === '#' || acorde[1] === 'b')) {
      return acorde.substring(0, 2)
    }
    return acorde.substring(0, 1)
  }
}
