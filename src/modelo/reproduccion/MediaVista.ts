import type { Media } from '../cancion/media'

export class MediaVista {
  public tipo: string
  public delay: number = 0
  public delayconrector: number = 0
  public rector: boolean = false
  public sincronizar: boolean = false
  public constructor(tipo: string) {
    this.tipo = tipo
  }
  public GetTiempoDesdeInicio?: () => number
  public GetEstado?: () => number
  public SetTiempoDesdeInicio?: (tiempo: number) => void
  public Iniciar?: () => void
  public Pausar?: () => void
  public setGetTiempoDesdeInicio(handler: () => number): void {
    this.GetTiempoDesdeInicio = handler
  }
  public setGetEstado(handler: () => number): void {
    this.GetEstado = handler
  }
  public setSetTiempoDesdeInicio(handler: (tiempo: number) => void): void {
    this.SetTiempoDesdeInicio = handler
  }
  public setIniciar(handler: () => void): void {
    this.Iniciar = handler
  }
  public setPausar(handler: () => void): void {
    this.Pausar = handler
  }
  media: Media | null = null
  public setMedia(media: Media) {
    this.media = media
  }
}
