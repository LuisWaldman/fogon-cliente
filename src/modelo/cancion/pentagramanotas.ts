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
  public static duracionRitmo(duracionId: string): number {
    return this.mapaDuracionRitmo[duracionId.replace('r', '')] ?? 4 // Valor por defecto si no se encuentra
  }
}
