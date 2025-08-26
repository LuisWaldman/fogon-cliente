import { StaveNote } from 'vexflow'
import type { DisplayNotaPentagrama } from './DisplayNotapentagrama'

export class DisplayAcordesPentagrama {
  getStaveNote(clave: string): StaveNote {
    const keys = this.Notas.filter((nota) => nota.nota !== undefined).map(
      (nota) => nota.nota.toLowerCase() + '/' + nota.octava,
    )
    console.log('KEYS', keys, 'clef', clave)
    return new StaveNote({
      keys: keys,
      duration: this.duracion.toString(),
      clef: clave,
    })
  }
  public Notas: DisplayNotaPentagrama[] = []
  public duracion: string = '2'
}
