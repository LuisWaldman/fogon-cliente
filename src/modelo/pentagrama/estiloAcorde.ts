import { MusicaHelper } from '../cancion/MusicaHelper'
import { PentagramaNotas } from '../cancion/pentagramanotas'

export class EstiloAcorde {
  GetNotas(acorde: string): PentagramaNotas[] {
    let acoPost = acorde

    if (acorde.includes(' ')) {
      acoPost = acorde.split(' ')[0]
    }
    const musica = new MusicaHelper()
    const notas = musica.GetEscalaDelAcorde(acoPost)
    console.log(notas)
    const toRet: PentagramaNotas[] = []
    for (let i = 0; i < this.tiposNota.length; i++) {
      if (notas[i] && this.tiposNota[i] === 'o') {
        toRet.push(
          new PentagramaNotas(notas[i] + '4', this.GetDuracionPentagrama()),
        )
      }
    }
    return toRet
  }
  GetDuracionPentagrama(): string {
    const duracionesVexFlow = ['1', '2', '4', '8', '16', '32', '64']
    return duracionesVexFlow[this.duracionId] || '4'
  }
  public duracionId: number
  public tiposNota: string[]

  public constructor(duracionId: number, cantNotas: number) {
    this.duracionId = duracionId
    this.tiposNota = new Array(cantNotas).fill('x')
    this.tiposNota[0] = 'o'
  }
  public CambiarTipoNota(indice: number): void {
    this.tiposNota[indice] = this.tiposNota[indice] === 'x' ? 'o' : 'x'
  }

  private static duraciones: string[] = [
    'redonda',
    'blanca',
    'negra',
    'corchea',
    'semicorchea',
    'fusa',
    'semifusa',
  ]
  public static GetDuraciones(): string[] {
    return this.duraciones
  }
  private static tipos: string[] = [
    '𝄽',
    'Acorde',
    'Bajo',
    '1ra',
    '2da',
    '3ra',
    '4ta',
    '5ta',
    '6ta',
  ]

  public static GetTipos(): string[] {
    return this.tipos
  }
}

// export
