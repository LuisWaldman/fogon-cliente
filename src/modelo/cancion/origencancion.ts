export class OrigenCancion {
  public origenUrl: string
  public fileName: string
  public usuario: string

  constructor(origenUrl: string, fileName: string, owner: string) {
    this.origenUrl = origenUrl
    this.fileName = fileName
    this.usuario = owner
  }

  public static GetFromQuery(
    cancion: string,
    usuario: string | null,
  ): OrigenCancion {
    if (usuario === null || usuario === undefined || usuario === '') {
      return new OrigenCancion('sitio', cancion, '')
    } else {
      return new OrigenCancion('server', cancion, usuario)
    }
  }
}
