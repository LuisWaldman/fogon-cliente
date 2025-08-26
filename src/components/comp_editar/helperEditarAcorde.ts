export class helperEditarAcorde {
  public static AcordesToRenglon(acordes: string[]): string {
    return acordes.map((acorde) => this.CorregirAcorde(acorde)).join('|')
  }

  public static CorregirAcorde(acorde: string): string {
    const normalize = (chord: string) => {
      // First letter is always capitalized
      let result = chord.charAt(0).toUpperCase()

      // Rest of the string should be lowercase, but 'B' should be lowercase when used as a flat
      for (let i = 1; i < chord.length; i++) {
        const char = chord[i]
        // If the character is 'b' or 'B', make it lowercase
        if (char.toLowerCase() === 'b') {
          result += 'b'
        } else {
          result += char.toLowerCase()
        }
      }

      // Handle special case for 'dim' specifically
      return result.replace(/dim/i, 'dim')
    }

    return acorde
      .trim()
      .split(' ')
      .map((chord) => normalize(chord))
      .join(' ')
  }
  public static RenglonToAcordes(renglon: string): string[] {
    return renglon.split('|')
  }
}
