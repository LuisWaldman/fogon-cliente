import * as Tone from 'tone'
import type { MidiSecuencia } from './MidiSecuencia'
import { InstrumentosManager } from './InstrumentosManager'

export class MidiPlayer {
  async cargarInstrumentos(instrumentos: string[]) {
    // Esperar a que todos los instrumentos se carguen
    await Promise.all(
      instrumentos.map((instrumento) =>
        this.instrumentosManager.cargarInstrumento(instrumento),
      ),
    )
  }
  private instrument: Tone.Sampler
  private instrumentosManager: InstrumentosManager
  private part: Tone.Part | null = null

  constructor() {
    this.instrument = new Tone.Sampler().toDestination()
    this.instrumentosManager = InstrumentosManager.getInstance()
  }

  public setInstrument(samples: { [note: string]: string }): void {
    this.instrument = new Tone.Sampler(samples).toDestination()
    console.log('Instrumento MIDI configurado')
  }

  public initialize(): void {
    Tone.start()
  }

  public borrarSequence(): void {
    Tone.getTransport().cancel() // ✨ Cancela todos los eventos programados

    // Limpiar la parte anterior
    if (this.part) {
      this.part.dispose()
      this.part = null
    }
  }
  // 🎼 Cargar secuencia para reproducción sincronizada
  public loadSequence(instrumento: string, secuencia: MidiSecuencia): void {
    // Detener y limpiar completamente el transport

    // Configurar nueva secuencia
    Tone.getTransport().bpm.value = secuencia.bpm

    this.part = new Tone.Part((time, value) => {
      this.instrumentosManager.instrumentosCargados[
        instrumento
      ].triggerAttackRelease(value.note, value.duration, time)
    }, secuencia.notas).start(0)

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
