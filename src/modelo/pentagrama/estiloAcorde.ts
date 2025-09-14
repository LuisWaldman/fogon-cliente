import { MusicaHelper } from '../cancion/MusicaHelper'
import { PentagramaNotas } from '../cancion/pentagramanotas'

export class EstiloAcorde {
  GetNotas(
    acorde: string,
    octava: number,
    esBateria: boolean,
  ): PentagramaNotas[] {
    if (acorde === undefined || acorde.trim() === '') {
      return []
    }
    let acoPost = acorde
    if (esBateria) return this.GetNotasBateria()

    if (acorde.includes(' ')) {
      acoPost = acorde.split(' ')[0]
    }
    const musica = new MusicaHelper()
    const notas = musica.GetEscalaDelAcorde(acoPost)
    const toRet: PentagramaNotas[] = []
    for (let i = 0; i < this.tiposNota.length; i++) {
      if (notas[i] && this.tiposNota[i] === 'o') {
        toRet.push(
          new PentagramaNotas(
            notas[i] + octava.toString(),
            this.GetDuracionPentagrama(),
          ),
        )
      }
    }
    if (toRet.length === 0) {
      toRet.push(new PentagramaNotas('C4', this.GetDuracionPentagrama() + 'r'))
    }
    return toRet
  }
  GetNotasBateria(): PentagramaNotas[] {
    const notasBateria: string[] = [
      'D4',
      'F4',
      'A4',
      'C5',
      'E5',
      'G5',
      'A5',
      'C6',
    ]
    const toRet: PentagramaNotas[] = []
    for (let i = 0; i < this.tiposNota.length; i++) {
      if (this.tiposNota[i] === 'o') {
        toRet.push(
          new PentagramaNotas(notasBateria[i], this.GetDuracionPentagrama()),
        )
      }
    }
    if (toRet.length === 0) {
      toRet.push(new PentagramaNotas('C4', this.GetDuracionPentagrama() + 'r'))
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
    this.tiposNota = new Array(cantNotas).fill('')
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
