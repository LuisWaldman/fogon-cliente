import { FrecuenciaDetectada } from '../../modelo/sonido/FrecuenciaDetectada'

export class MicHelper {
  private permissionState: PermissionState | null = null
  private permissionStatus: PermissionStatus | null = null
  sourceNode: MediaStreamAudioSourceNode | null = null
  buffer: Float32Array = new Float32Array(2048) // Initialize with size directly
  mediaStream: MediaStream | null = null
  audioContext: AudioContext | null = null
  analyserNode: AnalyserNode | null = null
  frecuencia: number = -1
  otrasFrecuencias: FrecuenciaDetectada[] = []

  /**
   * Verifica el estado actual del permiso del micrófono.
   */
  async getEstadoMic(): Promise<PermissionState> {
    try {
      this.permissionStatus = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      })
      this.permissionState = this.permissionStatus.state
      return this.permissionState
    } catch (error) {
      console.error('Error al verificar el permiso del micrófono:', error)
      return 'denied'
    }
  }
  detectMultipleFrequencies(
    buffer: Float32Array,
    sampleRate: number,
  ): FrecuenciaDetectada[] {
    const SIZE = buffer.length
    const frequencies: number[] = []

    // Convertir a espectro de frecuencias usando FFT básica
    const fftSize = SIZE / 2
    const spectrum = new Float32Array(fftSize)

    // Aplicar ventana de Hanning para reducir ruido
    const windowedBuffer = new Float32Array(SIZE)
    for (let i = 0; i < SIZE; i++) {
      const window = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (SIZE - 1)))
      windowedBuffer[i] = buffer[i] * window
    }

    // Calcular magnitudes del espectro
    for (let k = 0; k < fftSize; k++) {
      let real = 0
      let imag = 0

      for (let n = 0; n < SIZE; n++) {
        const angle = (-2 * Math.PI * k * n) / SIZE
        real += windowedBuffer[n] * Math.cos(angle)
        imag += windowedBuffer[n] * Math.sin(angle)
      }

      spectrum[k] = Math.sqrt(real * real + imag * imag)
    }

    // Encontrar picos en el espectro
    const threshold = Math.max(...spectrum) * 0.3 // Aumentar de 0.1 a 0.3
    const minFreq = 80 // Frecuencia mínima para guitarra
    const maxFreq = 2000 // Frecuencia máxima relevante

    for (let k = 1; k < fftSize - 1; k++) {
      const freq = (k * sampleRate) / SIZE

      if (freq < minFreq || freq > maxFreq) continue

      // Verificar si es un pico local
      if (
        spectrum[k] > spectrum[k - 1] &&
        spectrum[k] > spectrum[k + 1] &&
        spectrum[k] > threshold
      ) {
        // Interpolación parabólica para mayor precisión
        const y1 = spectrum[k - 1]
        const y2 = spectrum[k]
        const y3 = spectrum[k + 1]

        const a = (y1 - 2 * y2 + y3) / 2
        const b = (y3 - y1) / 2

        let peakOffset = 0
        if (a !== 0) {
          peakOffset = -b / (2 * a)
        }

        const refinedFreq = ((k + peakOffset) * sampleRate) / SIZE
        frequencies.push(refinedFreq)
      }
    }

    // Ordenar por magnitud (más fuerte primero) y tomar máximo 6 frecuencias
    const indexedFreqs = frequencies.map((freq) => {
      const k = Math.round((freq * SIZE) / sampleRate)
      return { freq, magnitude: spectrum[k] || 0 }
    })

    indexedFreqs.sort((a, b) => b.magnitude - a.magnitude)

    const frequenciesret: FrecuenciaDetectada[] = indexedFreqs.map(
      (item) => new FrecuenciaDetectada(item.freq, item.magnitude),
    )
    return frequenciesret
  }
  autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    const SIZE = buffer.length
    let rms = 0

    // 1. Calcular RMS para detectar silencio
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i]
    }
    rms = Math.sqrt(rms / SIZE)
    if (rms < 0.01) return -1 // silencio

    // 2. Autocorrelación
    const correlations = new Array(SIZE).fill(0)
    for (let lag = 0; lag < SIZE; lag++) {
      for (let i = 0; i < SIZE - lag; i++) {
        correlations[lag] += buffer[i] * buffer[i + lag]
      }
    }

    // 3. Buscar el primer mínimo (inicio del valle)
    let start = 0
    while (correlations[start] > correlations[start + 1]) {
      start++
    }

    // 4. Buscar el pico máximo después del valle
    let maxval = -1
    let maxpos = -1
    for (let i = start; i < SIZE; i++) {
      if (correlations[i] > maxval) {
        maxval = correlations[i]
        maxpos = i
      }
    }

    // 5. Calcular frecuencia
    const T0 = maxpos
    return sampleRate / T0
  }
  public detectar = false
  detectFrequency() {
    if (!this.analyserNode) return
    if (!this.detectar) return
    if (!this.buffer) return
    this.analyserNode.getFloatTimeDomainData(this.buffer)
    if (!this.audioContext) return
    // Detectar frecuencia principal con autocorrelación
    const mainFreq = this.autoCorrelate(
      this.buffer,
      this.audioContext.sampleRate,
    )
    this.frecuencia = mainFreq

    // Detectar múltiples frecuencias
    const detectedFreqs = this.detectMultipleFrequencies(
      this.buffer,
      this.audioContext.sampleRate,
    )

    // Filtrar frecuencias válidas y remover la principal si está presente
    this.otrasFrecuencias = detectedFreqs
      .filter(
        (freq) =>
          freq.frecuencia > 0 && Math.abs(freq.frecuencia - mainFreq) > 5,
      ) // Evitar duplicados cercanos
      .slice(0, 5) // Máximo 5 frecuencias adicionales
  }

  async requestMicAccess(): Promise<MediaStream | null> {
    if (this.permissionState === 'denied') {
      console.warn('Acceso al micrófono denegado por el usuario.')
      return null
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.audioContext = new AudioContext()
      this.sourceNode = this.audioContext.createMediaStreamSource(stream)

      this.analyserNode = this.audioContext.createAnalyser()
      this.analyserNode.fftSize = 2048

      this.sourceNode.connect(this.analyserNode)
      this.mediaStream = stream
      return stream
    } catch (error) {
      console.error('Error al solicitar acceso al micrófono:', error)
      return null
    }
  }

  async stopMic(): Promise<void> {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }
  }

  /**
   * Escucha cambios en el estado del permiso del micrófono.
   */
  async monitorPermissionChanges(
    callback: (newState: PermissionState) => void,
  ): Promise<void> {
    if (!this.permissionStatus) {
      await this.getEstadoMic()
    }

    if (this.permissionStatus) {
      this.permissionStatus.onchange = () => {
        this.permissionState = this.permissionStatus!.state
        callback(this.permissionState)
      }
    }
  }
}
