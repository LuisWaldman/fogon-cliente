import { ItemIndiceCancion } from '../cancion/ItemIndiceCancion'

export class ListaReproduccion {
  lista: ItemIndiceCancion[] = []
  nroCancion: number = 0
  GetCancion(): ItemIndiceCancion {
    return this.lista[this.nroCancion]
  }
  async ClickTocarLista(lista: ItemIndiceCancion[]) {
    this.lista = lista
    this.nroCancion = 0
  }
  async InsertarEnListaReproduccion(cancion: ItemIndiceCancion) {
    const nuevaLista = []
    if (this.nroCancion > this.lista.length) {
      this.nroCancion = this.lista.length
    }
    for (let i = 0; i < this.lista.length; i++) {
      if (i === this.nroCancion) {
        nuevaLista.push(this.lista[i])
        nuevaLista.push(cancion)
      } else {
        nuevaLista.push(this.lista[i])
      }
    }
    if (this.lista.length === 0) {
      nuevaLista.push(cancion)
    } else {
      this.nroCancion++
    }
    this.lista = nuevaLista
  }

  async ClickCancion(cancion: ItemIndiceCancion) {
    await this.InsertarEnListaReproduccion(cancion)
  }
  async ClickCancionNro(nro: number) {
    this.nroCancion = nro
  }

  Agregar(item: ItemIndiceCancion) {
    this.lista.push(item)
  }
}
