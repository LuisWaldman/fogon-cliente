export class PentagramaNotas {
  public nota: string
  public duracion: string
  constructor(nota: string, duracion: string) {
    this.nota = nota
    this.duracion = duracion
  }

  mapaDuraciones: Record<string, string> = {
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
  public duracionMidi(): string {
    return this.mapaDuraciones[this.duracion] ?? '4n' // Valor por defecto si no se encuentra
  }
}
