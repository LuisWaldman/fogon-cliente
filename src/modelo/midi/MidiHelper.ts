import type { Cancion } from '../cancion/cancion'
import { MidiSecuencia } from './MidiSecuencia'
import { NotaMidi } from './NotaMidi'

export class MidiHelper {
  public GetSecuencia(cancion: Cancion): MidiSecuencia {
    const secuencia = new MidiSecuencia()
    secuencia.bpm = cancion.bpm ? cancion.bpm : 40
    const pentagramas = cancion.pentagramas
    if (pentagramas.length === 0) {
      return secuencia
    }

    const pentagrama = pentagramas[0]
    for (let i = 0; i < pentagrama.compases.length; i++) {
      for (const nota of pentagrama.compases[i].acordes) {
        for (const notam in nota.notas) {
          const duracion = '1n'
          const tiempo = `${i}:0:0`
          console.log(
            `Nota: ${nota.notas[notam]}, Duración: ${duracion}, Tiempo: ${tiempo}`,
          )
          secuencia.notas.push(
            new NotaMidi(nota.notas[notam], duracion, tiempo),
          )
        }
      }
    }
    return secuencia
  }
}
