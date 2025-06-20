// src/cancion.ts
export class RelojConectado {
  public duracionCompas: number = 2200 // Duración de un compás en milisegundos
  public estado: 'pausa' | 'iniciando' | 'tocando' = 'pausa'

  private intervalId: number | null

  constructor() {
    this.intervalId = null
  }
  private IniciaHandler?: () => void
  private IniciaCicloHandler?: () => void

  public setIniciaHandler(handler: () => void) {
    this.IniciaHandler = handler
  }

  public setIniciaCicloHandler(handler: () => void) {
    this.IniciaCicloHandler = handler
  }

  public setDuracion(duracionCompas: number) {
    this.duracionCompas = duracionCompas
  }

  iniciado: boolean = false

  public iniciar() {
    if (!this.iniciado) {
      this.iniciado = true
      if (this.IniciaHandler) {
        this.IniciaHandler()
      }
    }

    this.intervalId = setInterval(() => {
      console.log('Iniciando ciclo')
      if (this.IniciaCicloHandler) {
        this.IniciaCicloHandler()
      }
    }, this.duracionCompas)
  }

  pausar() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}
