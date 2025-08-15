import { Cancion } from './cancion'

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
    })
    return cancionJSON
  }

  public static JSONToCancion(json: string): Cancion {
    const obj = JSON.parse(json)
    return new Cancion(
      obj.id,
      obj.titulo,
      obj.artista,
      obj.album,
      obj.duracion,
      obj.ruta,
    )
  }
}
