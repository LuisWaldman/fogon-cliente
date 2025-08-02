export abstract class HtmlAcorde {
  acorde: string
  ancho: number
  id: number

  constructor(acorde: string, ancho: number, id: number) {
    this.acorde = acorde
    this.ancho = ancho
    this.id = id
  }

  anchoPorcaracter(caracteres: number, texto: string): number {
    const tamañoCaracter = 9.5
    let tamaño = (caracteres + 1) * tamañoCaracter
    if (texto.length * tamañoCaracter * 1.2 > tamaño) {
      tamaño = this.acorde.length * tamañoCaracter * 1.2
    }

    return tamaño
  }

  abstract renderizar(): string
}

export class HtmlAcordeSimple extends HtmlAcorde {
  constructor(acorde: string, ancho: number, id: number) {
    super(acorde, ancho, id)
  }

  renderizar(): string {
    let idEnspan = ''
    if (this.id != -1) {
      idEnspan = " id='span_acorde-" + this.id.toString() + "'"
    }

    const tamaño = this.anchoPorcaracter(this.ancho, this.acorde)
    const ret = `<div style="width: ${tamaño}px;"><div class='acordediv' ${idEnspan}> ${this.acorde}</div></div>`
    return ret
  }
}

export class HtmlAcordeConBr extends HtmlAcorde {
  anchoPostBr: number
  cantidadDeBr: number

  constructor(
    acorde: string,
    ancho: number,
    anchoPostBr: number,
    cantidadDeBr: number,
    id: number,
  ) {
    super(acorde, ancho, id)
    this.anchoPostBr = anchoPostBr
    this.cantidadDeBr = cantidadDeBr
  }

  renderizar(): string {
    const tamaño2 = this.anchoPorcaracter(this.anchoPostBr, '')

    let idEnspan = ''
    if (this.id != -1) {
      idEnspan = " id='span_acorde-" + this.id.toString() + "'"
    }
    let ret =
      `<div ><div class='acordediv' ${idEnspan}>${this.acorde}` +
      '&nbsp;'.repeat(tamaño2) +
      `</div></div>`
    ret += '<div class="saltolinea"></div>'.repeat(this.cantidadDeBr)
    //style="flex-basis: 100%; "
    //ret += '<div><br></div>'.repeat(this.cantidadDeBr);
    ret += `<div>` + '&nbsp;'.repeat(tamaño2) + `</div>`
    return ret
  }
}
