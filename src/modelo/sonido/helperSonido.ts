import { NotaSonido } from './notaSonido'

export class HelperSonidos {
  public static GetNotas(
    tipoAfinacion: number,
    cantidadNotas: number,
    notas: string[],
    delayCambioEscala = 3,
  ): NotaSonido[] {
    const notasret: NotaSonido[] = []
    const desdeNota = tipoAfinacion / 8
    // cantidadNotas es la cantidad de notas en la octava
    const desdeEscala = 2
    for (let i = 0; i < cantidadNotas * 8; i++) {
      const nota = desdeNota * Math.pow(2, i / cantidadNotas)
      let nroNotaEnEscala = i - delayCambioEscala
      if (nroNotaEnEscala < 0) {
        nroNotaEnEscala += cantidadNotas
      }
      const escala = desdeEscala + Math.floor(nroNotaEnEscala / cantidadNotas)
      notasret.push(new NotaSonido(nota, notas[i % cantidadNotas], escala))
    }
    return notasret
  }

  public static GetNotaDesdeFrecuenciaConNotasSonido(
    frecuencia: number,
    notasSonidos: NotaSonido[],
  ): number {
    // Implementar la lógica para obtener la nota desde la frecuencia
    const FrecuenciaNotas = notasSonidos.map((nota) => nota.frecuencia)

    for (let i = 0; i < FrecuenciaNotas.length; i++) {
      if (frecuencia <= FrecuenciaNotas[i]) {
        if (i == 0) {
          return i
        }
        // Comparar con la nota anterior para ver cuál está más cerca
        if (
          Math.abs(frecuencia - FrecuenciaNotas[i - 1]) <
          Math.abs(frecuencia - FrecuenciaNotas[i])
        ) {
          return i - 1
        }
        return i
      }
    }
    // Si la frecuencia es mayor que todas las notas, retornar la última
    return FrecuenciaNotas.length - 1
  }
}
