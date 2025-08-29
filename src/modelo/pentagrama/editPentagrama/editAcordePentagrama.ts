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
  public addNota: string = ''
  public addNotaOctava: number = 0
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
  private esBateria: boolean
  constructor(acorde: string, esBateria: boolean = false) {
    this.acorde = acorde
    this.esBateria = esBateria
    this.Calcular()
  }
  public static InstrumentosBateria: string[] = [
    'Bombo',
    'Caja',
    'Matraca',
    'Platillo cerrado',
    'Platillo abierto',
    'Triangulo',
    'Silbato',
    'Crash',
  ]
  Calcular() {
    const helper = new MusicaHelper()
    this.notas = []
    this.notassola = []
    this.octavas = []
    this.tiene3 = true
    this.addNote = false
    this.addNotaOctava = 0
    this.addNota = ''
    if (this.esBateria) {
      this.notas = ['D4', 'F4', 'A4', 'C5', 'E5', 'G5', 'A5', 'C6']
      this.notassola = ['D', 'F', 'A', 'C', 'E', 'G', 'A', 'C']
      this.octavas = [0, 0, 0, 1, 1, 1, 1, 1]
      this.tiene3 = true
      this.addNote = false
      this.addNotaOctava = 0
      this.addNota = ''
      return
    }

    this.escalaDelAcorde = helper.GetEscalaDelAcorde(this.acorde)
    const todaslasnotas = helper.GetNotas()
    const indicePrimera = todaslasnotas.indexOf(this.escalaDelAcorde[0])
    this.escalaDelAcorde.forEach((nota) => {
      const indiceNota = todaslasnotas.indexOf(nota)
      this.octavas.push(indicePrimera > indiceNota ? 1 : 0)
    })
    this.pushNota(this.escalaDelAcorde[0], this.octava + this.octavas[0])
    this.pushNota(this.escalaDelAcorde[2], this.octava + this.octavas[2])
    this.pushNota(this.escalaDelAcorde[4], this.octava + this.octavas[4])
    if (this.acorde.indexOf('5') >= 0) {
      this.tiene3 = false
    }
    if (this.acorde.indexOf('7') >= 0) {
      this.addNote = true
      this.addNota = this.escalaDelAcorde[6] + (this.octava + this.octavas[6])
      this.addNotaOctava = this.octava + this.octavas[6]
    }
  }
}
