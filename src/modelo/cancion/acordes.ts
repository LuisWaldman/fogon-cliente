// src/cancion.ts
export class Parte {
  nombre: string
  acordes: string[]

  constructor(nombre: string, acordes: string[]) {
    this.nombre = nombre
    this.acordes = acordes
  }
}

export class Acordes {
  GetTotalAcordes() {
    let tot = 0
    for (let i = 0; i < this.ordenPartes.length; i++) {
      tot += this.partes[this.ordenPartes[i]].acordes.length
    }
    return tot
  }
  partes: Parte[]
  ordenPartes: number[]

  constructor(partes: Parte[], ordenPartes: number[]) {
    this.partes = partes
    this.ordenPartes = ordenPartes
  }

  GetTodosLosAcordes() {
    let ret: string[] = []
    for (let i = 0; i < this.ordenPartes.length; i++) {
      ret = ret.concat(this.partes[this.ordenPartes[i]].acordes)
    }
    return ret
  }
}
