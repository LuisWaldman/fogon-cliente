import { Configuracion } from './configuracion'
// Clase Pantalla
export class Pantalla {
  public configuracion: Configuracion
  constructor(config: Configuracion) {
    this.configuracion = config
  }
}
