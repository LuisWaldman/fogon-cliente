import { StaveNote } from 'vexflow'
import type { DisplayNotaPentagrama } from './DisplayNotapentagrama'

export class DisplayAcordesPentagrama {
  getStaveNote(): StaveNote {
    const keys = this.Notas.filter((nota) => nota.nota !== undefined).map(
      (nota) => nota.nota.toLowerCase() + '/' + nota.octava,
    )

    return new StaveNote({
      keys: keys,
      duration: this.duracion.toString(),
    })
  }
  public Notas: DisplayNotaPentagrama[] = []
  public duracion: string = '2'
}
