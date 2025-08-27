import * as Tone from 'tone'
import type { MidiSecuencia } from './MidiSecuencia'

export class MidiPlayer {
  private instrument: Tone.Sampler
  private sequence: { note: string; duration: string; time: string }[] = []
  private part: Tone.Part | null = null

  constructor() {
    this.instrument = new Tone.Sampler().toDestination()
  }

  public setInstrument(samples: { [note: string]: string }): void {
    this.instrument = new Tone.Sampler(samples).toDestination()
    console.log('Instrumento MIDI configurado')
  }

  public initialize(): void {
    Tone.start()
  }

  public borrarSequence(): void {
    Tone.getTransport().stop()
    Tone.getTransport().cancel() // ✨ Cancela todos los eventos programados
    Tone.getTransport().seconds = 0

    // Limpiar la parte anterior
    if (this.part) {
      this.part.dispose()
      this.part = null
    }

  }
  // 🎼 Cargar secuencia para reproducción sincronizada
  public loadSequence(secuencia: MidiSecuencia): void {
    // Detener y limpiar completamente el transport

    // Configurar nueva secuencia
    Tone.getTransport().bpm.value = secuencia.bpm
    this.sequence = secuencia.notas

    this.part = new Tone.Part((time, value) => {
      this.instrument.triggerAttackRelease(value.note, value.duration, time)
    }, this.sequence).start(0)

    this.part.loop = false
    console.log('Secuencia cargada')
  }

  // ▶️ Control de reproducción
  public start(): void {
    Tone.getTransport().start()
  }

  public pause(): void {
    Tone.getTransport().pause()
  }

  public stop(): void {
    Tone.getTransport().stop()
    Tone.getTransport().seconds = 0
  }

  // ⏱️ Tiempo actual en milisegundos
  public getCurrentTime(): number {
    return Tone.getTransport().seconds * 1000
  }

  // 🎯 Reproducción directa de nota con duración y delay
  public tocarysoltar(note: string, duration: number = 1, delay: number): void {
    this.instrument.triggerAttackRelease(note, duration, Tone.now() + delay)
  }

  // 🎹 Control manual de ataque y liberación
  public tocarNota(note: string): void {
    this.instrument.triggerAttack(note)
  }

  public soltarNota(note: string): void {
    this.instrument.triggerRelease(note)
  }
}
