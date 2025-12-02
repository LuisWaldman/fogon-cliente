import { PentagramaCompas } from './pentagramacompas'
import { PentagramaNotas } from './pentagramanotas'

export class Pentagrama {
  public compases: PentagramaCompas[] = []
  instrumento: string = ''
  instrfogon: string = ''
  nombre: string = ''
  clave: string = 'treble'
  public static GetPentagramaDefault(compases: number): Pentagrama {
    const penta = new Pentagrama()
    penta.instrumento = ''
    penta.nombre = ''
    penta.clave = 'treble'
    for (let i = 0; i < compases; i++) {
      const notas: PentagramaNotas[][] = []
      notas.push([new PentagramaNotas('C4', '1r')])
      penta.compases.push(new PentagramaCompas(notas))
    }
    return penta
  }
}
