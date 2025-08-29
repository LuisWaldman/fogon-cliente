import type { PentagramaNotas } from '../../cancion/pentagramanotas'
import { EditAcordePatronNotas } from './editAcordeNotas'
import { EditAcordePentagrama } from './editAcordePentagrama'

export class EditCompasPentagrama {
  public ritmo: number[] = []
  public acorde: EditAcordePentagrama
  public acordespatron: EditAcordePatronNotas[] = []
  constructor(acorde: string, esBateria: boolean) {
    this.acorde = new EditAcordePentagrama(acorde, esBateria)
  }
  CompletarRitmo() {
    const divisores = [1, 2, 4, 8, 16, 32] // sin puntillo
    const total = this.ritmo.reduce((acc, d) => acc + 1 / d, 0)
    let restante = 1 - total

    while (restante > 0.00001) {
      const candidato = divisores.find((d) => 1 / d <= restante)
      if (!candidato) break
      this.ritmo.push(candidato)
      this.AddAcorde([])
      restante -= 1 / candidato
    }
  }

  public UnirRitmo(indice: number) {
    const nuevoRitmo: number[] = []
    const nuevoAcordespatron: EditAcordePatronNotas[] = []
    console.log(indice)
    for (let i = 0; i < this.ritmo.length; i++) {
      if (i == indice - 1) {
        const ritmo = this.ritmo[i]
        const ritmoAunir = this.ritmo[i + 1]
        const ritmoResultante = Math.round(1 / (1 / ritmo + 1 / ritmoAunir))
        console.log(ritmo, ritmoAunir, ritmoResultante)
        nuevoRitmo.push(ritmoResultante)
        nuevoAcordespatron.push(this.acordespatron[i])
      } else if (i !== indice) {
        nuevoRitmo.push(this.ritmo[i])
        nuevoAcordespatron.push(this.acordespatron[i])
      }
    }

    this.ritmo = nuevoRitmo
    this.acordespatron = nuevoAcordespatron
  }

  public DividirRitmo(indice: number) {
    const nuevoRitmo: number[] = []
    const nuevoAcordespatron: EditAcordePatronNotas[] = []

    for (let i = 0; i < this.ritmo.length; i++) {
      if (i !== indice) {
        nuevoRitmo.push(this.ritmo[i])
        nuevoAcordespatron.push(this.acordespatron[i])
      } else {
        const ritmo = this.ritmo[i] * 2
        nuevoRitmo.push(ritmo)
        nuevoAcordespatron.push(this.acordespatron[i])
        nuevoRitmo.push(ritmo)
        nuevoAcordespatron.push(this.acordespatron[i])
      }
    }

    this.ritmo = nuevoRitmo
    this.acordespatron = nuevoAcordespatron
  }
  AddAcorde(acordePentagrama: PentagramaNotas[]) {
    const toPush = new EditAcordePatronNotas(this.acorde.totalNotas())
    acordePentagrama.forEach((s) => {
      const notaTexto = s.nota.substring(0, s.nota.length - 1)
      const existe = this.acorde.notassola.indexOf(notaTexto)
      if (existe !== -1) {
        toPush.patrones[existe] = 'o'
      }
    })

    this.acordespatron.push(toPush)
  }
}
