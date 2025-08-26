import { Parte } from './acordes'
import { Cancion } from './cancion'

export class ResumenParteSecuencia {
  public parteId: number
  public cantPartes: number = 1
  public cantAcordes: number = 0
  public desdeAcorde: number = 0
  constructor(parteId: number) {
    this.parteId = parteId
  }
}

export class ResumenSecuencia {
  public resumenPartes: ResumenParteSecuencia[] = []
  public parte: number = -1
  public repeticionparte: number = -1
  public compasdeparte: number = -1

  public ActualizarCompas(compas: number) {
    // busca la primera parte que lo pasa
    let parte = 0
    for (let i = 1; i < this.resumenPartes.length; i++) {
      if (this.resumenPartes[i].desdeAcorde > compas) {
        break
      }
      parte = i
    }
    this.parte = parte
    this.repeticionparte = Math.floor(
      (compas - this.resumenPartes[parte].desdeAcorde) /
        this.resumenPartes[parte].cantAcordes,
    )
    this.compasdeparte =
      compas -
      this.resumenPartes[parte].desdeAcorde -
      this.repeticionparte * this.resumenPartes[parte].cantAcordes
  }
  public CortarSecuencia(cancion: Cancion) {
    const newResumen = []
    if (this.compasdeparte == 0) {
      return
    }
    const parteACortor = this.resumenPartes[this.parte].parteId
    const acordesTotales = cancion.acordes.partes[parteACortor].acordes
    const acordesViejaParte = []
    const acordesNuevaParte = []
    for (let i = 0; i < acordesTotales.length; i++) {
      if (i < this.compasdeparte) {
        acordesViejaParte.push(acordesTotales[i])
      } else {
        acordesNuevaParte.push(acordesTotales[i])
      }
    }

    cancion.acordes.partes.push(
      new Parte(
        cancion.acordes.partes[parteACortor].nombre + 'B',
        acordesNuevaParte,
      ),
    )
    cancion.acordes.partes[parteACortor].acordes = acordesViejaParte
    const nuevaParteId = cancion.acordes.partes.length - 1
    for (let i = 0; i < this.resumenPartes.length; i++) {
      for (let j = 0; j < this.resumenPartes[i].cantPartes; j++) {
        if (this.resumenPartes[i].parteId == parteACortor) {
          newResumen.push(this.resumenPartes[i].parteId)
          newResumen.push(nuevaParteId)
        } else {
          newResumen.push(this.resumenPartes[i].parteId)
        }
      }
    }
    cancion.acordes.ordenPartes = newResumen
  }
  public AgregarSecuencia(cancion: Cancion, index: number, parteid: number) {
    const newResumen = []
    if (parteid == -1) {
      cancion.acordes.partes.push(new Parte('agregada', [cancion.escala]))
      parteid = cancion.acordes.partes.length - 1
    }
    if (index == -1) {
      newResumen.push(parteid)
    }
    for (let i = 0; i < this.resumenPartes.length; i++) {
      for (let j = 0; j < this.resumenPartes[i].cantPartes; j++) {
        newResumen.push(this.resumenPartes[i].parteId)
      }
      if (i == index) {
        newResumen.push(parteid)
      }
    }
    cancion.acordes.ordenPartes = newResumen
  }

  static GetResumen(cancion: Cancion): ResumenSecuencia {
    const ret = new ResumenSecuencia()
    let metiendo = -1
    let acorde = 0
    cancion.acordes.ordenPartes.forEach((element) => {
      if (metiendo != element) {
        ret.resumenPartes.push(new ResumenParteSecuencia(element))
        ret.resumenPartes[ret.resumenPartes.length - 1].cantAcordes =
          cancion.acordes.partes[element].acordes.length
        ret.resumenPartes[ret.resumenPartes.length - 1].desdeAcorde = acorde
      } else {
        ret.resumenPartes[ret.resumenPartes.length - 1].cantPartes += 1
      }
      metiendo = element
      acorde += cancion.acordes.partes[element].acordes.length
    })
    const resumen = new ResumenSecuencia()
    resumen.resumenPartes = ret.resumenPartes
    return resumen
  }

  public SetCancion(cancion: Cancion) {
    const newResumen = []
    for (let i = 0; i < this.resumenPartes.length; i++) {
      for (let j = 0; j < this.resumenPartes[i].cantPartes; j++) {
        newResumen.push(this.resumenPartes[i].parteId)
      }
    }
    cancion.acordes.ordenPartes = newResumen
  }
}
