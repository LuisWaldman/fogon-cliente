import { Acordes, Parte } from './acordes'
import { Cancion } from './cancion'
import { ItemIndiceCancion } from './ItemIndiceCancion'
import { Letra } from './letra'
import { OrigenCancion } from './origencancion'
import { UltimasCanciones } from './ultimascanciones'

export class UrlGetter {
  public static async GetSongUrl(
    origencancion: OrigenCancion,
  ): Promise<Cancion> {
    let desdeUrl = origencancion.origenUrl
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

    const acordes = new Acordes(partes, data.acordes.orden_partes)

    const toRet: Cancion = new Cancion(
      data.cancion,
      data.banda,
      acordes,
      new Letra(data.letras),
      data.bpm,
      data.calidad,
      data.compas_cantidad,
      data.compases_tiempo,
      data.escala,
    )
    toRet.archivo = origencancion.fileName
    toRet.normalizar()
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
        new OrigenCancion(desdeUrl, item.archivo, ''),
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

export class HelperGetCancion {
  public static async Get(origencancion: OrigenCancion): Promise<Cancion> {
    const ultimas = new UltimasCanciones()
    const cancion = UrlGetter.GetSongUrl(origencancion)
    const acancion = await cancion
    const item = ItemIndiceCancion.BuildFromCancion(acancion, origencancion)
    console.log('Adding to recent songs', item)
    ultimas.agregar(item)
    return acancion
  }
}
