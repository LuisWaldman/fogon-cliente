import { Cancion } from './cancion'
import { HelperJSON } from './HelperJSON'
import { ItemIndiceCancion } from './ItemIndiceCancion'
import { OrigenCancion } from './origencancion'
import { Logger } from '../logger'

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
    const cancion = HelperJSON.JSONToCancion(JSON.stringify(data))
    cancion.archivo = origencancion.fileName
    return cancion
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
      cancion.cantacordes = item.cantacordes
      cancion.acordes = item.acordes
      cancion.etiquetas = item.etiquetas
      cancion.bpm = item.bpm
      cancion.compasUnidad = item.compasUnidad
      cancion.compasCantidad = item.compasCantidad
      cancion.totalCompases = item.totalCompases
      cancion.video = item.video
      cancion.escala = item.escala
      cancion.normalizar()
      toRet.push(cancion)
    }
    return toRet
  }
}
