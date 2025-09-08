export class PentagramaNotas {
  public nota: string
  public duracion: string
  constructor(nota: string, duracion: string) {
    this.nota = nota
    this.duracion = duracion
  }

  static mapaDuraciones: Record<string, string> = {
    '1': '1n', // redonda
    '2': '2n', // blanca
    '4': '4n', // negra
    q: '4n', // negra
    '8': '8n', // corchea
    '16': '16n', // semicorchea
    '32': '32n', // fusa
    '64': '64n', // semifusa
    '128': '128n', // garrapatea
    '4d': '4n.', // negra con puntillo
    '2d': '2n.', // blanca con puntillo
    qd: '4n.', // negra con puntillo
    '8d': '8n.', // corchea con puntillo
    '16d': '16n.', // semicorchea con puntillo
  }

  static mapaDuracionRitmo: Record<string, number> = {
    '1': 1, // redonda
    '2': 2, // blanca
    '2d': 3, // blanca
    '4': 4, // negra
    '4d': 6, // negra
    q: 4, // negra
    '8': 8, // corchea
    '16': 16, // semicorchea
  }
  public static duracionMidi(duracionId: string): string {
    return this.mapaDuraciones[duracionId] ?? '4n' // Valor por defecto si no se encuentra
  }

  public static duracionToNota(duracion: number): string {
    // Convert duration value to note representation
    const duracionesInvertidas: Record<number, string> = {
      0.25: '4', // negra (1/4)
      0.375: '4d', // negra con puntillo (1/4 * 1.5)
      0.5: '2', // blanca (1/2)
      0.75: '2d', // blanca con puntillo (1/2 * 1.5)
      0.125: '8', // corchea (1/8)
      0.1875: '8d', // corchea con puntillo (1/8 * 1.5)
      0.0625: '16', // semicorchea (1/16)
      0.09375: '16d', // semicorchea con puntillo (1/16 * 1.5)
      1: '1', // redonda (1)
    }
    return duracionesInvertidas[duracion] || '4' // Default to quarter note if not found
  }
  public duracionRitmo(): number {
    if (this.duracion.includes('d')) {
      return 1.5 / parseInt(this.duracion.replace('d', ''), 10)
    } else {
      return 1 / parseInt(this.duracion.replace('d', ''), 10)
    }
  }


  public static staticDuracionRitmo(duracion: string): number {
    if (duracion.includes('d')) {
      return 1.5 / parseInt(duracion.replace('d', ''), 10)
    } else {
      return 1 / parseInt(duracion.replace('d', ''), 10)
    }
  }
}
