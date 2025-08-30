export class InstrumentoMidi {
  public nombre: string
  public archivo: string
  constructor(nombre: string, archivo: string) {
    this.nombre = nombre
    this.archivo = archivo
  }

  public static GetInstrumentos(): InstrumentoMidi[] {
    return [
      new InstrumentoMidi('Piano', 'piano.json'),
      new InstrumentoMidi('Acordion', 'acordion.json'),
      new InstrumentoMidi('Batería', 'bateria.json'),
      new InstrumentoMidi('Flauta', 'flauta.json'),
      new InstrumentoMidi('Guitarra', 'guitarra.json'),
      new InstrumentoMidi('Guitarra Electrica', 'guitarraelectrica.json'),
      new InstrumentoMidi('Trompeta', 'trompeta.json'),
    ]
  }
}
