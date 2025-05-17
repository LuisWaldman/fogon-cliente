export class itemLista {
  public origen: string
  public escala: string
  public compases: number
  public compasUnidad: number
  public compasCantidad: number
  public bpm: number
  public calidad: number

  public lenSecuencia: number
  public acordes: string
  public lenPartes: number[]
  public cancion: string
  public banda: string

  constructor(cancion: string, banda: string) {
    this.cancion = cancion
    this.banda = banda
    this.origen = ''
    this.escala = ''
    this.compases = 0
    this.compasUnidad = 0
    this.compasCantidad = 4
    this.bpm = 60
    this.calidad = 1
    this.origen = ''
    this.escala = ''
    this.lenSecuencia = 0
    this.acordes = ''
    this.lenPartes = []
  }
}
