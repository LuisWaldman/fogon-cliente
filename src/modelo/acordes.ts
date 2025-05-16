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
    for (let i = 0; i < this.orden_partes.length; i++) {
      tot += this.partes[this.orden_partes[i]].acordes.length
    }
    return tot
  }
  partes: Parte[]
  orden_partes: number[]

  constructor(partes: Parte[], orden_partes: number[]) {
    this.partes = partes
    this.orden_partes = orden_partes
  }

  GetTodosLosAcordes() {
    let ret: string[] = []
    for (let i = 0; i < this.orden_partes.length; i++) {
      ret = ret.concat(this.partes[this.orden_partes[i]].acordes)
    }
    return ret
  }
}
