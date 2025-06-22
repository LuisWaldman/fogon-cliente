// src/cancion.ts
export class Reloj {
  public duracionIntervalo: number = 2200 // Duración de un compás en milisegundos
  public estado: 'pausa' | 'iniciando' | 'tocando' = 'pausa'

  private timeoutId: number | null

  constructor() {
    this.timeoutId = null
  }
  private IniciaHandler?: () => void
  private IniciaCicloHandler?: () => void
  public setIniciaHandler(handler: () => void) {
    this.IniciaHandler = handler
  }

  public setIniciaCicloHandler(handler: () => void) {
    this.IniciaCicloHandler = handler
  }

  public setDuracion(duracion: number) {
    this.duracionIntervalo = duracion
  }

  iniciado: boolean = false

  private ciclo = () => {
    if (this.IniciaCicloHandler) {
      this.IniciaCicloHandler()
    }
    if (this.iniciado) {
      this.timeoutId = setTimeout(this.ciclo, this.duracionIntervalo)
    }
  }

  public iniciar() {
    if (!this.iniciado) {
      this.iniciado = true
      if (this.IniciaHandler) {
        this.IniciaHandler()
      }
      this.timeoutId = setTimeout(this.ciclo, this.duracionIntervalo)
    }
  }

  pausar() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.iniciado = false
  }
}
