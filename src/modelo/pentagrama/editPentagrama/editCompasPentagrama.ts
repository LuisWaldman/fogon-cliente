import type { PentagramaNotas } from '../../cancion/pentagramanotas'

export class EditCompasPentagrama {
  SetNewRitmo(parRitmo: number[]) {
    const nuevoRitmo: number[] = []
    const nuevoAcordespatron: boolean[][] = []
    for (let i = 0; i < parRitmo.length; i++) {
      nuevoRitmo.push(parRitmo[i])
      nuevoAcordespatron.push(new Array(this.notas.length).fill(true))
    }

    this.ritmo = nuevoRitmo
    this.patron = nuevoAcordespatron
  }
  public ritmo: number[] = []
  public notas: string[] = []
  public patron: boolean[][] = []

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
    const nuevoAcordespatron: boolean[][] = []
    console.log(indice)
    for (let i = 0; i < this.ritmo.length; i++) {
      if (i == indice - 1) {
        const ritmo = this.ritmo[i]
        const ritmoAunir = this.ritmo[i + 1]
        const ritmoResultante = Math.round(1 / (1 / ritmo + 1 / ritmoAunir))
        console.log(ritmo, ritmoAunir, ritmoResultante)
        nuevoRitmo.push(ritmoResultante)
        nuevoAcordespatron.push(this.patron[i])
      } else if (i !== indice) {
        nuevoRitmo.push(this.ritmo[i])
        nuevoAcordespatron.push(this.patron[i])
      }
    }

    this.ritmo = nuevoRitmo
    this.patron = nuevoAcordespatron
  }

  public DividirRitmo(indice: number) {
    const nuevoRitmo: number[] = []
    const nuevoAcordespatron: boolean[][] = []

    for (let i = 0; i < this.ritmo.length; i++) {
      if (i !== indice) {
        nuevoRitmo.push(this.ritmo[i])
        nuevoAcordespatron.push(this.patron[i])
      } else {
        const ritmo = this.ritmo[i] * 2
        nuevoRitmo.push(ritmo)
        nuevoAcordespatron.push(this.patron[i])
        nuevoRitmo.push(ritmo)
        nuevoAcordespatron.push(this.patron[i])
      }
    }

    this.ritmo = nuevoRitmo
    this.patron = nuevoAcordespatron
  }

  AddAcorde(acordePentagrama: PentagramaNotas[]) {
    const toPush: boolean[] = new Array(this.notas.length).fill(false)
    acordePentagrama.forEach((s) => {
      const existe = this.notas.indexOf(s.nota)
      if (existe !== -1) {
        if (!s.duracion.endsWith('r')) {
          toPush[existe] = true
        }
      }
    })

    this.patron.push(toPush)
  }
}
