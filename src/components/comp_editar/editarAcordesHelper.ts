import { Acordes, Parte } from '../../modelo/acordes'
import { Cancion } from '../../modelo/cancion'

export class editarAcordesHelper {
  static splitear_parte(cancion: Cancion, orden_parte: number, acorde: number) {
    const parte_tomod = cancion.acordes.ordenPartes[orden_parte]
    const parte = cancion.acordes.partes[parte_tomod]
    const partes = [parte.acordes.slice(0, acorde), parte.acordes.slice(acorde)]

    if (partes[0].length == 0) {
      return
    }
    const parte1: Parte = new Parte(parte.nombre, partes[0])
    const parte2: Parte = new Parte(parte.nombre + 'B', partes[1])
    const nuevas_partes: Parte[] = []
    cancion.acordes.partes.forEach((parte, index) => {
      if (index === parte_tomod) {
        nuevas_partes.push(parte1)
        nuevas_partes.push(parte2)
      } else {
        nuevas_partes.push(parte)
      }
    })
    cancion.acordes.partes = nuevas_partes

    const nuevo_orden: number[] = []
    cancion.acordes.ordenPartes.forEach((orden) => {
      if (orden === parte_tomod) {
        nuevo_orden.push(orden)
        nuevo_orden.push(orden + 1)
      } else {
        if (orden >= parte_tomod) {
          nuevo_orden.push(orden + 1)
        } else {
          nuevo_orden.push(orden)
        }
      }
    })
    cancion.acordes.ordenPartes = nuevo_orden
    console.log(nuevo_orden)
  }
  static mix_acorde(cancion: Cancion, orden_parte: number, acorde: number) {
    const renglones = cancion.letras.renglones.flat()
    let cont_renglones = 0
    const parte_tomod = cancion.acordes.ordenPartes[orden_parte]
    const nue_reng: string[] = []

    if (
      acorde >= 0 &&
      acorde < cancion.acordes.partes[parte_tomod].acordes.length - 1
    ) {
      cancion.acordes.partes[parte_tomod].acordes[acorde] =
        cancion.acordes.partes[parte_tomod].acordes[acorde] +
        ' ' +
        cancion.acordes.partes[parte_tomod].acordes[acorde + 1]
      cancion.acordes.partes[parte_tomod].acordes.splice(acorde + 1, 1)
    }

    for (let i = 0; i < cancion.acordes.ordenPartes.length; i++) {
      const orden_partenro = cancion.acordes.ordenPartes[i]
      if (orden_partenro === parte_tomod) {
        if (orden_parte == orden_partenro) {
          for (
            let j = 0;
            j < cancion.acordes.partes[orden_partenro].acordes.length;
            j++
          ) {
            if (j === acorde) {
              nue_reng.push(
                renglones[cont_renglones] + ' ' + renglones[cont_renglones + 1],
              )
              cont_renglones++
              cont_renglones++
            } else {
              nue_reng.push(renglones[cont_renglones])
              cont_renglones++
            }
          }
        }
      } else {
        for (
          let j = 0;
          j < cancion.acordes.partes[orden_partenro].acordes.length;
          j++
        ) {
          nue_reng.push(renglones[cont_renglones])
          cont_renglones++
        }
      }
    }

    cancion.letras.renglones = [nue_reng]
  }
}
