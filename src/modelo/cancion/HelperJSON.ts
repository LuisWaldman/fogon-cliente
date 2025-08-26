import { Acordes, Parte } from './acordes'
import { Cancion } from './cancion'
import { Letra } from './letra'
import { Media } from './media'
import { Pentagrama } from './pentagrama'
import { PentagramaCompas } from './pentagramacompas'
import { PentagramaNotas } from './pentagramanotas' // Agregar esta importación

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
        delay: media.delay || 0,
      })),
      pentagramas: cancion.pentagramas.map((pentagrama) => ({
        instrumento: pentagrama.instrumento,
        clave: pentagrama.clave,
        compases: pentagrama.compases.map((compas) => ({
          notas: compas.notas,
        })),
      })),
      archivo: cancion.archivo,
    })
    console.log(cancion.pentagramas[0].clave)
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
      bpm = 120 // valor por defecto
    }

    let compasUnidad = data.compasUnidad
    if (compasUnidad === undefined) {
      compasUnidad = data.compas_unidad || 4 // valor por defecto
    }

    let compasCantidad = data.compasCantidad
    if (compasCantidad === undefined) {
      compasCantidad = data.compas_cantidad || 4 // valor por defecto
    }

    let renglones = data.letras
    if (data.letras && data.letras.renglones) {
      renglones = data.letras.renglones
    }

    const toRet: Cancion = new Cancion(
      data.cancion,
      data.banda,
      acordes,
      new Letra(renglones),
      bpm,
      data.calidad,
      compasCantidad,
      compasUnidad, // Corregido: era compasesTiempo
      data.escala,
    )

    if (data.medias) {
      toRet.medias = data.medias.map(
        (media: { tipo: string; id: string; delay: number }) =>
          new Media(media.tipo, media.id, media.delay || 0),
      )
    }

    if (data.pentagramas) {
      toRet.pentagramas = data.pentagramas.map(
        (penta: {
          instrumento: string
          clave: string
          compases: { notas: PentagramaNotas[][] }[]
        }) => {
          const pentagrama = new Pentagrama()
          pentagrama.instrumento = penta.instrumento
          pentagrama.clave = penta.clave
          pentagrama.compases = [] // Asegurar que esté inicializado
          penta.compases.forEach(
            (compasData: { notas: PentagramaNotas[][] }) => {
              pentagrama.compases.push(new PentagramaCompas(compasData.notas))
            },
          )
          return pentagrama
        },
      )
    }
    if (data.archivo) {
      toRet.archivo = data.archivo
    }
    toRet.archivo = data.archivo

    toRet.normalizar()
    return toRet
  }
}
