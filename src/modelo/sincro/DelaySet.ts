export class DelaySet {
  public Tardo: number
  public Delay: number
  public Seleccionada: boolean

  constructor(tardo: number = 0, delay: number = 0) {
    this.Tardo = tardo
    this.Delay = delay
    this.Seleccionada = false
  }
}
