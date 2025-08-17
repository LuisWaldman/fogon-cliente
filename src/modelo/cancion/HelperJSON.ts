import { Acordes, Parte } from './acordes'
import { Cancion } from './cancion'
import { Letra } from './letra'
import { Media } from './media'

export class HelperJSON {
  public static CancionToJSON(cancion: Cancion): string {
    const cancionJSON = JSON.stringify({
      cancion: cancion.cancion,
      banda: cancion.banda,
      acordes: {
        partes: cancion.acordes.partes.map((parte) => ({
          nombre: parte.nombre,
          acordes: parte.acordes,
        })),
        ordenPartes: cancion.acordes.ordenPartes,
      },
      escala: cancion.escala,
      letras: cancion.letras.renglones,
      bpm: cancion.bpm,
      calidad: cancion.calidad,
      compasCantidad: cancion.compasCantidad,
      compasUnidad: cancion.compasUnidad,
      medias: cancion.medias.map((media) => ({
        tipo: media.tipo,
        id: media.id,
      })),
    })
    return cancionJSON
  }

  public static JSONToCancion(json: string): Cancion {
    const data = JSON.parse(json)
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
    let renglones = data.letras.renglones
    if (renglones === undefined) {
      renglones = data.letras
    }
    const toRet: Cancion = new Cancion(
      data.cancion,
      data.banda,
      acordes,
      new Letra(renglones),
      bpm,
      data.calidad,
      compasCantidad,
      compasesTiempo,
      data.escala,
    )
    if (data.medias) {
      toRet.medias = data.medias.map(
        (media: { tipo: string; id: string }) =>
          new Media(media.tipo, media.id),
      )
    }
    toRet.archivo = data.archivo
    toRet.normalizar()
    return toRet
  }
}
