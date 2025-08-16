import type { ClienteSocket } from '../conexion/ClienteSocket'
import type { Cancion } from './cancion'
import type { OrigenCancion } from './origencancion'

export class CancionServerManager {
  public static async GetCancion(
    origencancion: OrigenCancion,
    cliente: ClienteSocket | null = null,
    token: string = '',
  ): Promise<Cancion> {
    const response = await fetch(
      cliente?.UrlServer + 'cancion?nombre=' + origencancion.fileName,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const dataRes = await response.json()
    const data = dataRes.datosJSON

    return toRet
  }

  public static async GetIndice(
    origenUrl: string,
  ): Promise<ItemIndiceCancion[]> {
    let desdeUrl = origenUrl
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
