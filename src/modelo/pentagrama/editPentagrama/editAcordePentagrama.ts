import { MusicaHelper } from '../../cancion/MusicaHelper'
import type { PentagramaNotas } from '../../cancion/pentagramanotas'

export class EditAcordePentagrama {
  SetOctavaFromNotas(acordePentagrama: PentagramaNotas[]) {
    if (acordePentagrama.length > 0) {
      const nota = acordePentagrama[0]
      //const notaTexto = nota.nota.substring(0, nota.nota.length - 1)
      const notaOctava = parseInt(nota.nota.substring(nota.nota.length - 1))
      this.octava = notaOctava
    }
  }
  public acorde: string
  public notas: string[] = []
  public notassola: string[] = []
  public escalaDelAcorde: string[] = []
  public octava: number = 4
  public agregada: string = ''
  public agregadaoctava: number = 0
  public octavas: number[] = []
  public tiene3: boolean = false
  public addNote: boolean = false
  public totalNotas(): number {
    return this.notas.length + (this.addNote ? 1 : 0)
  }

  public pushNota(nota: string, escala: number) {
    this.notas.push(nota + escala.toString())
    this.notassola.push(nota)
  }

  constructor(acorde: string) {
    const helper = new MusicaHelper()
    this.escalaDelAcorde = helper.GetEscalaDelAcorde(acorde)
    const todaslasnotas = helper.GetNotas()
    const indicePrimera = todaslasnotas.indexOf(this.escalaDelAcorde[0])
    this.escalaDelAcorde.forEach((nota) => {
      const indiceNota = todaslasnotas.indexOf(nota)
      this.octavas.push(indicePrimera > indiceNota ? 1 : 0)
    })
    this.acorde = acorde
    this.pushNota(this.escalaDelAcorde[0], this.octava + this.octavas[0])
    this.pushNota(this.escalaDelAcorde[2], this.octava + this.octavas[2])
    this.pushNota(this.escalaDelAcorde[4], this.octava + this.octavas[4])
    if (acorde.indexOf('5') >= 0) {
      this.tiene3 = false
    }
    if (acorde.indexOf('7') >= 0) {
      this.addNote = true
      this.agregada = this.escalaDelAcorde[6] + (this.octava + this.octavas[6])
      this.agregadaoctava = this.octava + this.octavas[6]
    }
  }
}
