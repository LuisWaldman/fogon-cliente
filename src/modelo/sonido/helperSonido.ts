import { NotaSonido } from './notaSonido'

export class HelperSonidos {
  public static GetNotas(
    tipoAfinacion: number,
    cantidadNotas: number,
    notas: string[],
  ): NotaSonido[] {
    const notasret: NotaSonido[] = []
    const desdeNota = tipoAfinacion / 8
    // cantidadNotas es la cantidad de notas en la octava
    const desdeEscala = 1
    for (let i = 0; i < cantidadNotas * 8; i++) {
      const nota = desdeNota * Math.pow(2, i / cantidadNotas)
      notasret.push(
        new NotaSonido(
          nota,
          notas[i % cantidadNotas],
          desdeEscala + Math.floor(i / cantidadNotas),
        ),
      )
    }
    return notasret
  }
}
