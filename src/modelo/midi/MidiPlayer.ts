import * as Tone from 'tone'

export class MidiPlayer {
  private instrument: Tone.Sampler

  constructor() {
    this.instrument = new Tone.Sampler().toDestination()
    this.instrument.toDestination()
  }

  public setInstrument(samples: { [note: string]: string }): void {
    this.instrument = new Tone.Sampler(samples).toDestination()
    this.instrument.toDestination()
    console.log('Instrumento MIDI configurado')
  }

  public initialize(): void {
    Tone.start()
  }

  public play(note: string, duration: number = 1, delay: number): void {
    this.instrument.triggerAttackRelease(note, duration, Tone.now() + delay)
  }

  public tocarNota(note: string): void {
    this.instrument.triggerAttack(note)
  }

  public soltarNota(note: string): void {
    this.instrument.triggerRelease(note)
  }
}

export default MidiPlayer
