import type { Beam } from './beam'

export class Note {
  GetDuracionString(): string {
    let ret = Note.mapaDuraciones[this.type ?? 'quarter'] ?? '4'
    if (this.dot) {
      ret += 'd'
    }
    return ret
  }

  static mapaDuraciones: Record<string, string> = {
    whole: '1', // redonda
    half: '2', // blanca
    quarter: '4', // negra
    eighth: '8', // corchea
    '16th': '16', // semicorchea
    '32nd': '32', // fusa
  }

  public isRest?: boolean
  public isChord: boolean = false
  // marca la nota que inicia el acorde
  public chordRoot: boolean = false
  public step?: string
  public octave?: number
  public alter?: number
  public duration?: number
  public staff?: number
  public type?: string
  public tie?: string
  public dot: boolean = false
  public beam: Beam[] = []

  constructor(init?: Partial<Note>) {
    Object.assign(this, init)
  }
}
