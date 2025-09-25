import * as Tone from 'tone'
import type { MidiSecuencia } from './MidiSecuencia'
import { InstrumentosManager } from './InstrumentosManager'

export class MidiPlayer {
  compasUnidad: number = 4
  compasCantidad: number = 4
  getPlayerState(): number {
    return Tone.getTransport().state === 'started' ? 1 : 0
  }
  setCurrentTime(numero: number) {
    Tone.getTransport().seconds = numero / 1000
  }
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
  // Nuevo: Map para almacenar los controles de volumen por instrumento
  private volumeNodes: Map<string, Tone.Volume> = new Map()
  public duracion: string = ''

  constructor() {
    this.instrument = new Tone.Sampler().toDestination()
    this.instrumentosManager = InstrumentosManager.getInstance()
  }

  public setInstrument(samples: { [note: string]: string }): void {
    this.instrument = new Tone.Sampler(samples).toDestination()
    console.log('Instrumento MIDI configurado')
  }

  // Nuevo: Método para configurar el volumen de un instrumento específico
  public setInstrumentVolume(instrumento: string, volumeDb: number): void {
    if (!this.volumeNodes.has(instrumento)) {
      // Crear nodo de volumen si no existe
      const volumeNode = new Tone.Volume(volumeDb).toDestination()
      this.volumeNodes.set(instrumento, volumeNode)

      // Reconectar el instrumento al nodo de volumen
      const instrumentoTone =
        this.instrumentosManager.instrumentosCargados[instrumento]
      if (instrumentoTone) {
        instrumentoTone.disconnect()
        instrumentoTone.connect(volumeNode)
      }
    } else {
      // Actualizar volumen existente
      this.volumeNodes.get(instrumento)!.volume.value = volumeDb
    }
  }

  // Nuevo: Método para obtener el volumen actual de un instrumento
  public getInstrumentVolume(instrumento: string): number {
    const volumeNode = this.volumeNodes.get(instrumento)
    return volumeNode ? volumeNode.volume.value : 0
  }

  // Nuevo: Método para conectar un instrumento con su nodo de volumen
  private conectarInstrumentoConVolumen(instrumento: string): void {
    const instrumentoTone =
      this.instrumentosManager.instrumentosCargados[instrumento]
    if (instrumentoTone) {
      if (!this.volumeNodes.has(instrumento)) {
        // Crear nodo de volumen con valor por defecto (0 dB = sin cambio)
        const volumeNode = new Tone.Volume(0).toDestination()
        this.volumeNodes.set(instrumento, volumeNode)
      }

      // Conectar instrumento al nodo de volumen
      instrumentoTone.disconnect()
      instrumentoTone.connect(this.volumeNodes.get(instrumento)!)
    }
  }

  public initialize(): void {
    Tone.start()
  }

  public borrarSequence(): void {
    Tone.getTransport().cancel()

    if (this.part) {
      this.part.dispose()
      this.part = null
    }
  }

  public loadSequence(instrumento: string, secuencia: MidiSecuencia): void {
    // Asegurar que el instrumento tiene configurado su control de volumen
    this.conectarInstrumentoConVolumen(instrumento)

    Tone.getTransport().bpm.value = secuencia.bpm
    Tone.getTransport().timeSignature = [this.compasCantidad, this.compasUnidad]

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

  // Nuevo: Limpiar recursos al destruir la instancia
  public dispose(): void {
    this.volumeNodes.forEach((volumeNode) => volumeNode.dispose())
    this.volumeNodes.clear()
    if (this.part) {
      this.part.dispose()
    }
  }
}
