export class SincroCancion {
  duracionGolpe: number
  timeInicio: Date
  golpesxcompas: number
  desdeCompas: number

  constructor(
    duracionGolpe: number,
    timeInicio: Date,
    golpesxcompas: number,
    desdeCompas: number,
  ) {
    this.duracionGolpe = duracionGolpe
    this.timeInicio = timeInicio
    this.golpesxcompas = golpesxcompas
    this.desdeCompas = desdeCompas
  }
}
