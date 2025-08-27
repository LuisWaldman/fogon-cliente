import { InstrumentoMidi } from './InstrumentoMidi'
import * as Tone from 'tone'

export class InstrumentosManager {
  private static instance: InstrumentosManager

  // Private constructor to prevent direct instantiation
  private instrumentos: InstrumentoMidi[] = InstrumentoMidi.GetInstrumentos()
  private constructor() {
    // Initialization code here
  }
  public instrumentosCargados: Record<string, Tone.Sampler> = {}

  public async cargarInstrumento(nombre: string): Promise<Tone.Sampler> {
    // Check if we already have this instrument cached
    if (this.instrumentosCargados[nombre]) {
      return this.instrumentosCargados[nombre]
    }

    const instrumento = this.instrumentos.find((i) => i.nombre === nombre)
    if (!instrumento) {
      throw new Error(`Instrumento "${nombre}" no encontrado`)
    }

    try {
      const response = await fetch(`InstrumentosMIDI/${instrumento.archivo}`)
      if (!response.ok) {
        throw new Error(`Error al cargar instrumento: ${response.statusText}`)
      }
      const samples = await response.json()

      // Create Tone.Sampler instance
      const instrument = new Tone.Sampler(samples).toDestination()

      // Cache the result for future requests
      this.instrumentosCargados[nombre] = instrument

      return instrument
    } catch (error) {
      console.error(`Error cargando el instrumento ${nombre}:`, error)
      throw error
    }
  }

  // Method to get the singleton instance
  public static getInstance(): InstrumentosManager {
    if (!InstrumentosManager.instance) {
      InstrumentosManager.instance = new InstrumentosManager()
    }

    return InstrumentosManager.instance
  }

  // Add methods for managing instruments here
}
