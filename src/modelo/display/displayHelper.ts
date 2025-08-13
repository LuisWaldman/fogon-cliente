import type { Cancion } from '../cancion/cancion'

export class displayHelper {
  private cancion: Cancion | null = null
  private display: string[] = []
  public setCancion(cancion: Cancion) {
    this.cancion = cancion
  }

  public calcularDisplay(): string[] {
    if (!this.cancion) {
      return ['No hay canción seleccionada']
    }
    if (this.display.length > 0) {
      return this.display
    }

    
  }
}
