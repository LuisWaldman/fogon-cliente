import { Parte } from '../../modelo/acordes'
import { Cancion } from '../../modelo/cancion'

export class editarAcordesHelper {
  static splitearParte(cancion: Cancion, ordenParte: number, acorde: number) {
    const parteTomod = cancion.acordes.ordenPartes[ordenParte]
    const parte = cancion.acordes.partes[parteTomod]
    const partes = [parte.acordes.slice(0, acorde), parte.acordes.slice(acorde)]

    if (partes[0].length == 0) {
      return
    }
    const parte1: Parte = new Parte(parte.nombre, partes[0])
    const parte2: Parte = new Parte(parte.nombre + 'B', partes[1])
    const nuevasPartes: Parte[] = []
    cancion.acordes.partes.forEach((parte, index) => {
      if (index === parteTomod) {
        nuevasPartes.push(parte1)
        nuevasPartes.push(parte2)
      } else {
        nuevasPartes.push(parte)
      }
    })
    cancion.acordes.partes = nuevasPartes

    const nuevoOrden: number[] = []
    cancion.acordes.ordenPartes.forEach((orden) => {
      if (orden === parteTomod) {
        nuevoOrden.push(orden)
        nuevoOrden.push(orden + 1)
      } else {
        if (orden >= parteTomod) {
          nuevoOrden.push(orden + 1)
        } else {
          nuevoOrden.push(orden)
        }
      }
    })
    cancion.acordes.ordenPartes = nuevoOrden
    console.log(nuevoOrden)
  }
  static mixAcorde(cancion: Cancion, ordenParte: number, acorde: number) {
    const renglones = cancion.letras.renglones.flat()
    let contrenglones = 0
    const partetomod = cancion.acordes.ordenPartes[ordenParte]
    const nuereng: string[] = []

    if (
      acorde >= 0 &&
      acorde < cancion.acordes.partes[partetomod].acordes.length - 1
    ) {
      cancion.acordes.partes[partetomod].acordes[acorde] =
        cancion.acordes.partes[partetomod].acordes[acorde] +
        ' ' +
        cancion.acordes.partes[partetomod].acordes[acorde + 1]
      cancion.acordes.partes[partetomod].acordes.splice(acorde + 1, 1)
    }

    for (let i = 0; i < cancion.acordes.ordenPartes.length; i++) {
      const ordenPartenro = cancion.acordes.ordenPartes[i]
      if (ordenPartenro === partetomod) {
        if (ordenParte == ordenPartenro) {
          for (
            let j = 0;
            j < cancion.acordes.partes[ordenPartenro].acordes.length;
            j++
          ) {
            if (j === acorde) {
              nuereng.push(
                renglones[contrenglones] + ' ' + renglones[contrenglones + 1],
              )
              contrenglones++
              contrenglones++
            } else {
              nuereng.push(renglones[contrenglones])
              contrenglones++
            }
          }
        }
      } else {
        for (
          let j = 0;
          j < cancion.acordes.partes[ordenPartenro].acordes.length;
          j++
        ) {
          nuereng.push(renglones[contrenglones])
          contrenglones++
        }
      }
    }

    cancion.letras.renglones = [nuereng]
  }
}
