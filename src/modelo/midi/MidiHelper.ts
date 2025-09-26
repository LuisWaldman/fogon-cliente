import type { Midi } from '@tonejs/midi'
import { Pentagrama } from '../cancion/pentagrama'
import { MidiSecuencia } from './MidiSecuencia'
import { NotaMidi } from './NotaMidi'
import { ResumenNotaMidi } from './ResumenNotaMidi'
import type { Note } from '@tonejs/midi/dist/Note'
import { PentagramaCompas } from '../cancion/pentagramacompas'
import { PentagramaNotas } from '../cancion/pentagramanotas'

export class MidiHelper {
  public parteCompas = 0
  public GetSecuencia(pentagrama: Pentagrama, bpm: number): MidiSecuencia {
    const secuencia = new MidiSecuencia()
    secuencia.bpm = bpm ? bpm : 40
    const esBateria = pentagrama.instrumento
      .toLocaleLowerCase()
      .includes('bater')
    const mapeoBateriaDesde = ['D4', 'F4', 'A4', 'C5', 'E5', 'G5', 'A5', 'C6']
    const mapeoBateriaHasta = [
      'C1',
      'E4',
      'A#3',
      'C#3',
      'D#3',
      'G#3',
      'C5',
      'F5',
    ]
    for (let i = 0; i < pentagrama.compases.length; i++) {
      this.parteCompas = 0
      let notaId = 0
      for (const nota of pentagrama.compases[i].notas as PentagramaNotas[][]) {
        const esLigada = pentagrama.compases[i].ligaduras?.some(
          (ligadura) => ligadura.desdeNota === notaId,
        )
        const FinLigada = pentagrama.compases[i].ligaduras?.some(
          (ligadura) => ligadura.hastaNota === notaId,
        )

        for (const notaItem of nota as PentagramaNotas[]) {
          if (!notaItem.duracion.includes('r')) {
            const tiempo = this.GetTiempoMidi(i)
            let duracion = PentagramaNotas.duracionMidi(notaItem.duracion)
            let nota = notaItem.nota
            if (esBateria) {
              if (mapeoBateriaDesde.indexOf(nota) !== -1) {
                nota = mapeoBateriaHasta[mapeoBateriaDesde.indexOf(nota)]
              }
            }
            if (esLigada) {
              const ligadura = pentagrama.compases[i].ligaduras?.find(
                (ligadura) => ligadura.desdeNota === notaId,
              )
              if (ligadura) {
                // Use the ligadura as needed
                // This finds the first ligadura that starts from the current note
                if (pentagrama.compases[i].notas[ligadura.hastaNota]) {
                  const ligadoHa = PentagramaNotas.duracionMidi(
                    pentagrama.compases[i].notas[ligadura.hastaNota][0]
                      .duracion,
                  )
                  duracion = this.SumarMidisDuracion(duracion, ligadoHa)
                }
              }
            }
            if (!FinLigada) {
              secuencia.notas.push(new NotaMidi(nota, duracion, tiempo))
            }
          }
        }
        notaId++
        this.ActualizarTiempos(nota)
      }
    }
    return secuencia
  }

  duraciones: { [key: string]: number } = {
    '1n': 4,
    '2n': 2,
    '2n.': 3,
    '4n': 1,
    '4n.': 1.5,
    '8n': 0.5,
    '8n.': 0.75,
    '16n': 0.25,
    '16n.': 0.375,
    // etc.
  }

  SumarMidisDuracion(duracion: string, ligadoHa: string): string {
    // Calculate the total duration by looking up values in the duraciones object
    const valor1 = this.duraciones[duracion] || 0
    const valor2 = this.duraciones[ligadoHa] || 0
    const totalDuracion = valor1 + valor2

    // Find the closest matching duration
    for (const [notacion, valor] of Object.entries(this.duraciones)) {
      if (Math.abs(valor - totalDuracion) < 0.01) {
        return notacion
      }
    }

    // If no exact match, find the closest approximation
    let closest = '4n'
    let minDiff = Number.MAX_VALUE

    for (const [notacion, valor] of Object.entries(this.duraciones)) {
      const diff = Math.abs(valor - totalDuracion)
      if (diff < minDiff) {
        minDiff = diff
        closest = notacion
      }
    }

    return closest
  }
  GetTiempoMidi(compas: number): string {
    const cuarto = Math.floor(this.parteCompas * 4)
    const divisor = Math.round((this.parteCompas * 4 - cuarto) * 4)
    return `${compas}:${cuarto}:${divisor}`
  }
  DuracionEnCompas(duracion: string): number {
    const base = parseInt(duracion)
    const tienePuntillo = duracion.includes('d')
    let fraccion = 1 / base
    if (tienePuntillo) fraccion *= 1.5
    return fraccion
  }
  ActualizarTiempos(notas: PentagramaNotas[]) {
    if (notas.length === 0) return

    const duraciones = notas.map((n) => this.DuracionEnCompas(n.duracion))
    const minima = Math.min(...duraciones)
    this.parteCompas += minima
  }

  private ppq = 0
  public MidiToPentagramas(midi: Midi): Pentagrama[] {
    const pentagramas: Pentagrama[] = []
    this.ppq = midi.header.ppq
    for (const track of midi.tracks) {
      const pentagrama = new Pentagrama()
      pentagrama.instrumento =
        track.instrument.name || 'Instrumento Desconocido'
      const resumen: ResumenNotaMidi[] = []
      for (const note of track.notes) {
        resumen.push(this.GetResumen(note))
      }
      pentagrama.compases = this.GetCompases(resumen)
      pentagramas.push(pentagrama)
    }

    return pentagramas
  }
  GetCompases(resumen: ResumenNotaMidi[]): PentagramaCompas[] {
    /* ORDENA LAS NOTAS POR COMPAS */
    const notasporcompas: { [key: number]: ResumenNotaMidi[] } = {}
    let maxcompas = 0
    for (const nota of resumen) {
      const compas = Math.floor(nota.cuarto / 4)
      if (compas > maxcompas) {
        maxcompas = compas
      }
      if (!notasporcompas[compas]) {
        notasporcompas[compas] = []
      }
      notasporcompas[compas].push(nota)
    }

    const compases: PentagramaCompas[] = []
    for (let i = 0; i <= maxcompas; i++) {
      const notas = notasporcompas[i] || []
      compases.push(this.GetPentagramaCompas(i, notas))
    }
    return compases
  }

  GetPentagramaCompas(
    compas: number,
    notas: ResumenNotaMidi[],
  ): PentagramaCompas {
    const pentagramaCompas = new PentagramaCompas([])
    // Agrupar notas por cuarto
    const cuartoDelCompas = compas * 4
    const notasPorCuarto: { [key: number]: ResumenNotaMidi[] } = {}
    for (const nota of notas) {
      const cuarto = nota.cuarto - cuartoDelCompas
      if (!notasPorCuarto[cuarto]) {
        notasPorCuarto[cuarto] = []
      }
      notasPorCuarto[cuarto].push(nota)
    }

    // Imprimir por pantalla las notas por cuarto
    console.log('Notas por cuarto en compás', compas)
    let acorde: PentagramaNotas[] = []
    for (const cuarto in notasPorCuarto) {
      acorde = []
      console.log(`Cuarto ${cuarto}:`)
      notasPorCuarto[cuarto].forEach((nota, index) => {
        acorde.push(
          new PentagramaNotas(
            nota.nota,
            this.DuracionCuartosToDuracionNota(nota.duracionCuartos),
          ),
        )
        console.log(
          `  Nota ${index + 1}: ${nota.nota} (duración: ${nota.duracionCuartos})`,
        )
      })
      pentagramaCompas.notas.push(acorde)
    }
    return pentagramaCompas
  }
  DuracionCuartosToDuracionNota(cuartodecompas: number): string {
    const duraciones = [
      { cuartos: 6, nota: '1d' },
      { cuartos: 4, nota: '1' },
      { cuartos: 3, nota: '2d' },
      { cuartos: 2, nota: '2' },
      { cuartos: 1.5, nota: '4d' },
      { cuartos: 1, nota: '4' },
      { cuartos: 0.75, nota: '8d' },
      { cuartos: 0.5, nota: '8' },
      { cuartos: 0.375, nota: '16d' },
      { cuartos: 0.25, nota: '16' },
      { cuartos: 0.1875, nota: '32d' },
      { cuartos: 0.125, nota: '32' },
      { cuartos: 0.09375, nota: '64d' },
      { cuartos: 0.0625, nota: '64' },
    ]

    let notaMasCercana = duraciones[0]
    let diferenciaMinima = Math.abs(cuartodecompas - notaMasCercana.cuartos)

    for (const d of duraciones) {
      const diferencia = Math.abs(cuartodecompas - d.cuartos)
      if (diferencia < diferenciaMinima) {
        diferenciaMinima = diferencia
        notaMasCercana = d
      }
    }

    return notaMasCercana.nota
  }

  GetResumen(note: Note): ResumenNotaMidi {
    const cuarto = note.ticks / this.ppq
    const duracioncuartos = note.durationTicks / this.ppq
    const nota = note.name

    return new ResumenNotaMidi(nota, cuarto, duracioncuartos)
  }
}
