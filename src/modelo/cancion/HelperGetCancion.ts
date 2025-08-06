import { Acordes, Parte } from './acordes'
import { Cancion } from './cancion'
import { Letra } from './letra'
import type { OrigenCancion } from './origencancion'

class UrlGetter {
  public static async GetSongUrl(
    origencancion: OrigenCancion,
  ): Promise<Cancion> {
    let desdeUrl = origencancion.origenUrl
    if (desdeUrl.includes('fogon.ar')) {
      desdeUrl = 'https://www.fogon.ar/canciones/'
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
}

export class HelperGetCancion {
  public static async Get(origencancion: OrigenCancion): Promise<Cancion> {
    return UrlGetter.GetSongUrl(origencancion)
  }
}
