import { Cancion } from '../modelo/cancion'
import { Letra } from '../modelo/letra'
import { Acordes, Parte } from '../modelo/acordes'

export class HelperObtenerCancionURL {
  private url: string

  constructor(url: string) {
    this.url = url
  }

  async GetCancion(nombreArchivo: string): Promise<Cancion> {
    const archivo = this.url + `/${nombreArchivo}.json`
    const response = await fetch(archivo)
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
    toRet.archivo = nombreArchivo
    toRet.normalizar()
    return toRet
  }
}
