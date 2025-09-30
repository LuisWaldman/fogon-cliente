export class DisplayModoPentagrama {
  public Ver: boolean
  public Nombre: string
  public Instrumento: string = ""
  public Claves: string[] = []
  public constructor(Nombre: string, Ver: boolean) {
    this.Ver = Ver
    this.Nombre = Nombre
  }
}
