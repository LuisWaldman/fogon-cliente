import { Dot, StaveNote, Accidental } from 'vexflow'
import type { DisplayNotaPentagrama } from './DisplayNotapentagrama'

export class DisplayAcordesPentagrama {
  getStaveNote(clave: string): StaveNote {
    const keys = this.Notas.filter((nota) => nota.nota !== undefined).map(
      (nota) => nota.nota.toLowerCase() + '/' + nota.octava,
    )
    const duracion = this.duracion.replace('d', '')
    const tienePuntillo = this.duracion.includes('d')
    const toret = new StaveNote({
      keys: keys,
      duration: duracion.toString(),
      clef: clave,
    })
    for (let i = 0; i < this.Notas.length; i++) {
      const nota = this.Notas[i]
      if (nota.modificador && nota.modificador !== '') {
        toret.addModifier(new Accidental(nota.modificador), i)
      }
    }
    if (tienePuntillo) {
      Dot.buildAndAttach([toret], { index: 0 })
    }
    return toret
  }
  public Notas: DisplayNotaPentagrama[] = []
  public duracion: string = '2'
}
