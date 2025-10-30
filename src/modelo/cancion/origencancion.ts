export class OrigenCancion {
  public origenUrl: string
  public fileName: string
  public usuario: string

  constructor(origenUrl: string, fileName: string, owner: string) {
    this.origenUrl = origenUrl
    this.fileName = fileName
    this.usuario = owner
  }

  public static GetFromQuery(query: string): OrigenCancion {
    return new OrigenCancion('sitio', query, query)
  }
}
