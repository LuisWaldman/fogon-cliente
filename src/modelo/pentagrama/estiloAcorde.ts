import { MusicaHelper } from '../cancion/MusicaHelper'
import { PentagramaNotas } from '../cancion/pentagramanotas'

export class EstiloAcorde {
  GetNotas(acorde: string): PentagramaNotas[] {
    let acoPost = acorde

    if (acorde.includes(' ')) {
      acoPost = acorde.split(' ')[0]
    }
    const musica = new MusicaHelper()
    return musica.GetNotasdeacorde(acoPost, 4).map((nota) => {
      return new PentagramaNotas(nota, this.GetDuracionPentagrama())
    })
  }
  GetDuracionPentagrama(): string {
    const duracionesVexFlow = ['1', '2', '4', '8', '16', '32', '64']
    return duracionesVexFlow[this.duracionId] || '4'
  }
  public duracionId: number
  public TipoId: number

  public constructor(duracionId: number, TipoId: number) {
    this.duracionId = duracionId
    this.TipoId = TipoId
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
