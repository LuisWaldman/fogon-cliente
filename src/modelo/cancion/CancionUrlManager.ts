import { Acordes, Parte } from './acordes'
import { Cancion } from './cancion'
import { ItemIndiceCancion } from './ItemIndiceCancion'
import { Letra } from './letra'
import { OrigenCancion } from './origencancion'

export class CancionUrlManager {
  public static async GetCancion(
    origencancion: OrigenCancion,
  ): Promise<Cancion> {
    let desdeUrl = window.location.origin
    if (desdeUrl.includes('fogon.ar')) {
      desdeUrl = 'https://www.fogon.ar/canciones/'
    }
    if (desdeUrl.includes('localhost')) {
      desdeUrl = 'http://localhost:5173/canciones/'
    }
    console.log(
      'Getting song from',
      desdeUrl + origencancion.fileName + '.json',
    )

    const response = await fetch(desdeUrl + origencancion.fileName + '.json')
    const data = await response.json()

    const partes = []
    for (let i = 0; i < data.acordes.partes.length; i++) {
      partes.push(
        new Parte(
          data.acordes.partes[i].nombre,
          data.acordes.partes[i].acordes,
        ),
      )
    }
    let ordenPartes = data.acordes.ordenPartes
    if (ordenPartes === undefined) {
      ordenPartes = data.acordes.orden_partes
    }

    const acordes = new Acordes(partes, ordenPartes)
    let bpm = data.bpm
    if (bpm === undefined) {
      bpm = data.bpm
    }

    let compasUnidad = data.compasUnidad
    if (compasUnidad === undefined) {
      compasUnidad = data.compas_unidad
    }

    let compasesTiempo = data.compasesTiempo
    if (compasesTiempo === undefined) {
      compasesTiempo = data.compases_tiempo
    }

    let compasCantidad = data.compasCantidad
    if (compasCantidad === undefined) {
      compasCantidad = data.compas_cantidad
    }

    const toRet: Cancion = new Cancion(
      data.cancion,
      data.banda,
      acordes,
      new Letra(data.letras),
      bpm,
      data.calidad,
      compasCantidad,
      compasesTiempo,
      data.escala,
    )
    toRet.archivo = origencancion.fileName
    toRet.normalizar()
    return toRet
  }

  public static async GetIndice(): Promise<ItemIndiceCancion[]> {
    let desdeUrl = window.location.origin
    if (desdeUrl.includes('local')) {
      desdeUrl = window.location.origin
    }
    if (desdeUrl.includes('fogon.ar')) {
      desdeUrl = 'https://www.fogon.ar/'
    }
    if (desdeUrl.includes('localhost')) {
      desdeUrl = 'http://localhost:5173/'
    }
    console.log('Getting Indice from', desdeUrl + 'indice.json')

    const response = await fetch(desdeUrl + 'indice.json')
    const data = await response.json()
    const toRet: ItemIndiceCancion[] = []
    for (const item of data) {
      const cancion = new ItemIndiceCancion(
        new OrigenCancion('sitio', item.archivo, ''),
        item.cancion,
        item.banda,
      )
      cancion.calidad = item.calidad
      cancion.bpm = item.bpm
      cancion.compasUnidad = item.compasUnidad
      cancion.compasCantidad = item.compasCantidad
      cancion.escala = item.escala
      cancion.normalizar()
      toRet.push(cancion)
    }
    return toRet
  }
}
