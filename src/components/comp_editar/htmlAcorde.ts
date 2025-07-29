export abstract class HtmlAcorde {
    acorde: string;
    ancho: number;
    id: number;

    constructor(acorde: string, ancho: number, id: number) {
        this.acorde = acorde;
        this.ancho = ancho;
        this.id = id;
    }

    ancho_porcaracter(caracteres: number, texto: string): number {
        
        const tamaño_caracter = 9.5;
        let tamaño = (caracteres + 1) * tamaño_caracter;
        if (texto.length * tamaño_caracter * 1.2 > tamaño) {
            tamaño = this.acorde.length * tamaño_caracter * 1.2;
        }

        return tamaño;
    }

    abstract renderizar(): string;
}

export class HtmlAcordeSimple extends HtmlAcorde {
    constructor(acorde: string, ancho: number, id: number) {
        super(acorde, ancho, id);
    }

    renderizar(): string {
        
        let id_enspan = '';
        if (this.id != -1) {
            id_enspan = " id='span_acorde-" + this.id.toString() + "'";
        }

        
        const tamaño = this.ancho_porcaracter(this.ancho, this.acorde);
        let ret =  `<div style="width: ${tamaño}px;"><div class='acordediv' ${id_enspan}> ${this.acorde}</div></div>`;
        return  ret;
    }
}

    
export class HtmlAcordeConBr extends HtmlAcorde {
    anchoPostBr: number;
    cantidadDeBr: number;

    constructor(acorde: string, ancho: number, anchoPostBr: number, cantidadDeBr: number, id: number) {
        super(acorde, ancho, id);
        this.anchoPostBr = anchoPostBr;
        this.cantidadDeBr = cantidadDeBr;
    }

    renderizar(): string {
        const tamaño1 = this.ancho_porcaracter(this.ancho, this.acorde);
        const tamaño2 = this.ancho_porcaracter(this.anchoPostBr, "");


        let id_enspan = '';
        if (this.id != -1) {
            id_enspan = " id='span_acorde-" + this.id.toString() + "'";
        }
        let ret =  `<div style="width: ${tamaño1}px;"><div class='acordediv' ${id_enspan}>${this.acorde}</div></div>`;
        ret += '<div class="saltolinea"></div>'.repeat(this.cantidadDeBr);
        //style="flex-basis: 100%; "
        //ret += '<div><br></div>'.repeat(this.cantidadDeBr);
        ret += `<div style="width: ${tamaño2}px;"></div>`
        return  ret;
    }


}
