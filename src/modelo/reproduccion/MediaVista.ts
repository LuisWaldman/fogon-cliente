import type { Media } from '../cancion/media'

export class MediaVista {
  public tipo: string
  public delay: number = 0
  public delayconrector: number = 0
  public rector: boolean = false
  public sincronizar: boolean = true
  public constructor(tipo: string) {
    this.tipo = tipo
  }
  public GetTiempoDesdeInicio?: () => number
  public Iniciar?: () => void
  public Pausar?: () => void
  public setGetTiempoDesdeInicio(handler: () => number): void {
    this.GetTiempoDesdeInicio = handler
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
