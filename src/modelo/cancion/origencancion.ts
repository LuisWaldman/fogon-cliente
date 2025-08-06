export class OrigenCancion {
  public origenUrl: string
  public fileName: string
  public owner: string

  constructor(origenUrl: string, fileName: string, owner: string) {
    this.origenUrl = origenUrl
    this.fileName = fileName
    this.owner = owner
  }

  public static GetFromQuery(query: string): OrigenCancion {
    return new OrigenCancion('url', query, query)
  }
}
