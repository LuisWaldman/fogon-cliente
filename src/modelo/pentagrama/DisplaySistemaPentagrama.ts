import { DisplayAcordesPentagrama } from './DisplayAcordesPentagrama'
import { DisplayCompasPentagrama } from './DisplayCompasPentagrama'
import { DisplayInstrumentoPentagrama } from './DisplayInstrumentoPentagrama'
import { DisplayNotaPentagrama } from './DisplayNotapentagrama'

export class DisplaySistemaPentagrama {
  public pentagramas: DisplayInstrumentoPentagrama[] = []
  public static GetDefault(): DisplaySistemaPentagrama {
    const sistema = new DisplaySistemaPentagrama()
    sistema.pentagramas.push(new DisplayInstrumentoPentagrama([], 'treble'))

    sistema.pentagramas.push(new DisplayInstrumentoPentagrama([], 'treble'))
    const refCompasPentagrama = new DisplayCompasPentagrama(0)
    refCompasPentagrama.acordes.push(new DisplayAcordesPentagrama())
    refCompasPentagrama.acordes[0].Notas.push(new DisplayNotaPentagrama('C', 4))
    refCompasPentagrama.acordes[0].duracion = '4'
    sistema.pentagramas[0].compases.push(refCompasPentagrama)
    return sistema
  }
}
