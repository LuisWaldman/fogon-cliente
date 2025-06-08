import { Configuracion } from './configuracion'
// Clase Pantalla
export class Pantalla {
  public configuracion: Configuracion = Configuracion.getInstance()

  public getConfiguracionPantalla() {
    return this.configuracion.GetConfiguracionPantalla(
      window.innerWidth,
      window.innerHeight,
    )
  }

  public getAnchoPantalla() {
    return window.innerWidth
  }

  public getAltoPantalla() {
    const config = this.getConfiguracionPantalla()
    return window.innerHeight - config.altoPantallaDescuento
  }

  public setearEstilos() {
    const config = this.getConfiguracionPantalla()
    document.documentElement.style.setProperty(
      '--tamanio-letra',
      `${config.tamanioLetra}px`,
    )
    document.documentElement.style.setProperty(
      '--tamanio-acorde',
      `${config.tamanioAcorde}px`,
    )
    document.documentElement.style.setProperty(
      '--tamanio-acordesolo',
      `${config.tamanioAcordesolo}px`,
    )
    document.documentElement.style.setProperty(
      '--tamanio-parte',
      `${config.tamanioParte}px`,
    )
    document.documentElement.style.setProperty(
      '--tamanio-acorde-parte',
      `${config.tamanioAcordeParte}px`,
    )
  }
}
