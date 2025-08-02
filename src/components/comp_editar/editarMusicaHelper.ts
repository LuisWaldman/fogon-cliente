import { Acordes, Parte } from '../../modelo/acordes'

export class EditarMusicaHelper {
  static mixear(
    acordes: Acordes,
    mixeandoParte: number,
    refPartesSeleccionadas: number[],
  ): Acordes {
    const partesToret: Parte[] = acordes.partes.copyWithin(
      0,
      acordes.partes.length,
    )
    const secuenciaToret: number[] = []

    for (let i = 0; i < acordes.ordenPartes.length; i++) {
      const per = acordes.ordenPartes[i]
      const parteToret = acordes.partes[per]
      let nombreAcorde = parteToret.nombre
      let parteIndex = 0

      if (per === mixeandoParte) {
        if (i < acordes.ordenPartes.length - 1) {
          if (
            refPartesSeleccionadas.indexOf(acordes.ordenPartes[i + 1]) !== -1
          ) {
            nombreAcorde +=
              '+' + acordes.partes[acordes.ordenPartes[i + 1]].nombre
            parteIndex = partesToret.findIndex((p) => p.nombre === nombreAcorde)
            if (parteIndex === -1) {
              partesToret.push(
                new Parte(
                  nombreAcorde,
                  parteToret.acordes.concat(
                    acordes.partes[acordes.ordenPartes[i + 1]].acordes,
                  ),
                ),
              )
              parteIndex = partesToret.length - 1
            }

            i++
          }
        }
      }

      parteIndex = partesToret.findIndex((p) => p.nombre === nombreAcorde)
      secuenciaToret.push(parteIndex)
    }
    return this.normalizarAcordes(new Acordes(partesToret, secuenciaToret))
  }

  static normalizarAcordes(acordes: Acordes): Acordes {
    const partesToret: Parte[] = []
    const secuenciaToret: number[] = []

    for (let i = 0; i < acordes.ordenPartes.length; i++) {
      const per = acordes.ordenPartes[i]
      const parteToret = acordes.partes[per]

      // Check if the part name already exists in secuencia_toret
      const parteIndex = partesToret.findIndex(
        (p) => p.nombre === parteToret.nombre,
      )
      if (parteIndex === -1) {
        secuenciaToret.push(partesToret.length)
        partesToret.push(parteToret)
      } else {
        secuenciaToret.push(parteIndex)
      }
    }
    return new Acordes(partesToret, secuenciaToret)
  }
}
