import type { RenglonTexto } from './renglonResumen'

export class silabasPrincipal {
  public base: number = 0
  public diferencia: number = 0
}
export class textoResumen {
  public versos: number = 0
  public silabas: silabasPrincipal[] = []
  public rimas: string = ''
  public renglones: RenglonTexto[] = []
}
