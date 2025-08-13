export interface Silaba {
  palabra: string // Palabra ingresada
  longitudPalabra: number // Longitud de la palabra
  numeroSilaba: number // Número de silabas de la palabra
  silabas: Array<{
    // Array de objeto que contiene la silaba (caracter) y la posicion en la palabra
    inicioPosicion: number
    silaba: string
  }>
  tonica: number // Posición de la silaba tónica (empieza en 1)
  letraTildada: number // Posición de la letra tildada (si la hay)
  acentuacion: string // Tipo acentuacion de la palabra (Aguda, Grave, Esdrujula y Sobresdrujula)
  hiato: Array<{
    // Array de objeto que contiene hiato (si la hay)
    tipoHiato: string
    silabaHiato: string
  }>
  diptongo: Array<{
    // Array de objeto que contiene diptongo (si la hay)
    tipo: string
    silaba: string
  }>
  triptongo: Array<{
    // Array de objeto que contiene triptongo (si la hay)
    tipo: string
    silaba: string
  }>
}

export class SeparadorSilabas {
  private silaba: Silaba
  private encontroTonica: boolean

  constructor() {
    this.silaba = {
      palabra: '',
      longitudPalabra: 0,
      numeroSilaba: 0,
      silabas: [],
      tonica: 0,
      letraTildada: -1,
      acentuacion: '',
      hiato: [],
      diptongo: [],
      triptongo: [],
    }
    this.encontroTonica = false
  }

  /**
   * Devuelve Objeto 'silaba' con los valores calculados
   *
   * @param palabra
   * @returns Objeto silaba con los valores calculados
   */
  public getSilabas(palabra: string): Silaba {
    this.posicionSilabas(palabra)
    this.acentuacion()
    this.hiato()
    this.diptongoTriptongo()
    return { ...this.silaba }
  }

  /**
   * Realiza calculo de las sílabas
   *
   * @param palabra
   */
  private posicionSilabas(palabra: string): void {
    this.silaba.palabra = palabra.toLowerCase().trim()
    this.silaba.silabas = []

    this.silaba.longitudPalabra = this.silaba.palabra.length
    this.encontroTonica = false
    this.silaba.tonica = 0
    this.silaba.numeroSilaba = 0
    this.silaba.letraTildada = -1

    // Variable que almacena silaba y la pocision de la silaba
    let silabaAux: { inicioPosicion: number; silaba: string }

    // Se recorre la palabra buscando las sílabas
    for (let actPos = 0; actPos < this.silaba.longitudPalabra; ) {
      this.silaba.numeroSilaba++
      silabaAux = { inicioPosicion: actPos, silaba: '' }

      // Las sílabas constan de tres partes: ataque, núcleo y coda
      actPos = this.ataque(this.silaba.palabra, actPos)
      actPos = this.nucleo(this.silaba.palabra, actPos)
      actPos = this.coda(this.silaba.palabra, actPos)

      // Obtiene y silaba de la palabra
      silabaAux.silaba = this.silaba.palabra.substring(
        silabaAux.inicioPosicion,
        actPos,
      )

      // Guarda silaba de la palabra
      this.silaba.silabas.push(silabaAux)

      if (this.encontroTonica && this.silaba.tonica === 0)
        this.silaba.tonica = this.silaba.numeroSilaba // Marca la silaba tónica
    }

    // Si no se ha encontrado la sílaba tónica (no hay tilde), se determina en base a
    // las reglas de acentuación
    if (!this.encontroTonica) {
      if (this.silaba.numeroSilaba < 2) {
        this.silaba.tonica = this.silaba.numeroSilaba // Monosílabos
      } else {
        // Polisílabos
        const letraFinal = this.silaba.palabra[this.silaba.longitudPalabra - 1]
        const letraAnterior =
          this.silaba.palabra[this.silaba.longitudPalabra - 2]

        if (
          !this.esConsonante(letraFinal) ||
          letraFinal === 'y' ||
          letraFinal === 'n' ||
          (letraFinal === 's' && !this.esConsonante(letraAnterior))
        ) {
          this.silaba.tonica = this.silaba.numeroSilaba - 1 // Palabra llana
        } else {
          this.silaba.tonica = this.silaba.numeroSilaba // Palabra aguda
        }
      }
    }
  }

  /**
   * Determina el ataque de la silaba de pal que empieza en pos y avanza
   * pos hasta la posición siguiente al final de dicho ataque
   */
  private ataque(pal: string, pos: number): number {
    // Se considera que todas las consonantes iniciales forman parte del ataque
    let ultimaConsonante = 'a'

    while (
      pos < this.silaba.longitudPalabra &&
      this.esConsonante(pal[pos]) &&
      pal[pos] !== 'y'
    ) {
      ultimaConsonante = pal[pos]
      pos++
    }

    // (q | g) + u (ejemplo: queso, gueto)
    if (pos < this.silaba.longitudPalabra - 1) {
      if (pal[pos] === 'u') {
        if (ultimaConsonante === 'q') pos++
        else if (ultimaConsonante === 'g') {
          const letra = pal[pos + 1]
          if (letra === 'e' || letra === 'é' || letra === 'i' || letra === 'í')
            pos++
        }
      } else {
        // La u con diéresis se añade a la consonante
        if (pal[pos] === 'ü' || pal[pos] === 'Ü')
          if (ultimaConsonante === 'g') pos++
      }
    }

    return pos
  }

  /**
   * Determina el núcleo de la silaba de pal cuyo ataque termina en pos - 1
   * y avanza pos hasta la posición siguiente al final de dicho núcleo
   */
  private nucleo(pal: string, pos: number): number {
    // Sirve para saber el tipo de vocal anterior cuando hay dos seguidas
    let anterior = 0
    let c: string

    // 0 = fuerte
    // 1 = débil acentuada
    // 2 = débil

    if (pos >= this.silaba.longitudPalabra) return pos // ¡¿No tiene núcleo?!

    // Se salta una 'y' al principio del núcleo, considerándola consonante
    if (pal[pos] === 'y') pos++

    // Primera vocal
    if (pos < this.silaba.longitudPalabra) {
      c = pal[pos]
      switch (c) {
        // Vocal fuerte o débil acentuada
        case 'á':
        case 'Á':
        case 'à':
        case 'À':
        case 'é':
        case 'É':
        case 'è':
        case 'È':
        case 'ó':
        case 'Ó':
        case 'ò':
        case 'Ò':
          this.silaba.letraTildada = pos
          this.encontroTonica = true
          anterior = 0
          pos++
          break
        // Vocal fuerte
        case 'a':
        case 'A':
        case 'e':
        case 'E':
        case 'o':
        case 'O':
          anterior = 0
          pos++
          break
        // Vocal débil acentuada, rompe cualquier posible diptongo
        case 'í':
        case 'Í':
        case 'ì':
        case 'Ì':
        case 'ú':
        case 'Ú':
        case 'ù':
        case 'Ù':
        case 'ü':
        case 'Ü':
          this.silaba.letraTildada = pos
          anterior = 1
          pos++
          this.encontroTonica = true
          return pos
          break
        // Vocal débil
        case 'i':
        case 'I':
        case 'u':
        case 'U':
          anterior = 2
          pos++
          break
      }
    }

    // 'h' intercalada en el núcleo, no condiciona diptongos o hiatos
    let hache = false
    if (pos < this.silaba.longitudPalabra) {
      if (pal[pos] === 'h') {
        pos++
        hache = true
      }
    }

    // Segunda vocal
    if (pos < this.silaba.longitudPalabra) {
      c = pal[pos]
      switch (c) {
        // Vocal fuerte o débil acentuada
        case 'á':
        case 'Á':
        case 'à':
        case 'À':
        case 'é':
        case 'É':
        case 'è':
        case 'È':
        case 'ó':
        case 'Ó':
        case 'ò':
        case 'Ò':
          this.silaba.letraTildada = pos
          if (anterior !== 0) {
            this.encontroTonica = true
          }
          if (anterior === 0) {
            // Dos vocales fuertes no forman silaba
            if (hache) pos--
            return pos
          } else {
            pos++
          }
          break
        // Vocal fuerte
        case 'a':
        case 'A':
        case 'e':
        case 'E':
        case 'o':
        case 'O':
          if (anterior === 0) {
            // Dos vocales fuertes no forman silaba
            if (hache) pos--
            return pos
          } else {
            pos++
          }
          break
        // Vocal débil acentuada, no puede haber triptongo, pero si diptongo
        case 'í':
        case 'Í':
        case 'ì':
        case 'Ì':
        case 'ú':
        case 'Ú':
        case 'ù':
        case 'Ù':
          this.silaba.letraTildada = pos
          if (anterior !== 0) {
            // Se forma diptongo
            this.encontroTonica = true
            pos++
          } else if (hache) pos--
          return pos
          break
        // Vocal débil
        case 'i':
        case 'I':
        case 'u':
        case 'U':
        case 'ü':
        case 'Ü':
          if (pos < this.silaba.longitudPalabra - 1) {
            // ¿Hay tercera vocal?
            const siguiente = pal[pos + 1]
            if (!this.esConsonante(siguiente)) {
              const letraAnterior = pal[pos - 1]
              if (letraAnterior === 'h') pos--
              return pos
            }
          }
          // dos vocales débiles iguales no forman diptongo
          if (pal[pos] !== pal[pos - 1]) pos++
          // Es un diptongo plano o descendente
          return pos
      }
    }

    // ¿tercera vocal?
    if (pos < this.silaba.longitudPalabra) {
      c = pal[pos]
      if (c === 'i' || c === 'u') {
        // Vocal débil
        pos++
        return pos // Es un triptongo
      }
    }

    return pos
  }

  /**
   * Determina la coda de la silaba de pal cuyo núcleo termina en pos - 1
   * y avanza pos hasta la posición siguiente al final de dicha coda
   */
  private coda(pal: string, pos: number): number {
    if (pos >= this.silaba.longitudPalabra || !this.esConsonante(pal[pos]))
      return pos // No hay coda
    else {
      if (pos === this.silaba.longitudPalabra - 1) {
        // Final de palabra
        pos++
        return pos
      }

      // Si sólo hay una consonante entre vocales, pertenece a la siguiente silaba
      if (!this.esConsonante(pal[pos + 1])) return pos

      const c1 = pal[pos]
      const c2 = pal[pos + 1]

      // ¿Existe posibilidad de una tercera consonante consecutina?
      if (pos < this.silaba.longitudPalabra - 2) {
        const c3 = pal[pos + 2]

        if (!this.esConsonante(c3)) {
          // No hay tercera consonante
          // Los grupos ll, lh, ph, ch y rr comienzan silaba
          if (c1 === 'l' && c2 === 'l') return pos
          if (c1 === 'c' && c2 === 'h') return pos
          if (c1 === 'r' && c2 === 'r') return pos

          ///////// grupos nh, sh, rh, hl son ajenos al español(DPD)
          if (c1 !== 's' && c1 !== 'r' && c2 === 'h') return pos

          // Si la y está precedida por s, l, r, n o c (consonantes alveolares),
          // una nueva silaba empieza en la consonante previa, si no, empieza en la y
          if (c2 === 'y') {
            if (
              c1 === 's' ||
              c1 === 'l' ||
              c1 === 'r' ||
              c1 === 'n' ||
              c1 === 'c'
            )
              return pos

            pos++
            return pos
          }

          // gkbvpft + l
          if (
            (c1 === 'b' ||
              c1 === 'v' ||
              c1 === 'c' ||
              c1 === 'k' ||
              c1 === 'f' ||
              c1 === 'g' ||
              c1 === 'p' ||
              c1 === 't') &&
            c2 === 'l'
          ) {
            return pos
          }

          // gkdtbvpf + r
          if (
            (c1 === 'b' ||
              c1 === 'v' ||
              c1 === 'c' ||
              c1 === 'd' ||
              c1 === 'k' ||
              c1 === 'f' ||
              c1 === 'g' ||
              c1 === 'p' ||
              c1 === 't') &&
            c2 === 'r'
          ) {
            return pos
          }

          pos++
          return pos
        } else {
          // Hay tercera consonante
          if (pos + 3 === this.silaba.longitudPalabra) {
            // Tres consonantes al final ¿palabras extranjeras?
            if (c2 === 'y') {
              // 'y' funciona como vocal
              if (
                c1 === 's' ||
                c1 === 'l' ||
                c1 === 'r' ||
                c1 === 'n' ||
                c1 === 'c'
              )
                return pos
            }

            if (c3 === 'y') {
              // 'y' final funciona como vocal con c2
              pos++
            } else {
              // Tres consonantes al final ¿palabras extranjeras?
              pos += 3
            }
            return pos
          }

          if (c2 === 'y') {
            // 'y' funciona como vocal
            if (
              c1 === 's' ||
              c1 === 'l' ||
              c1 === 'r' ||
              c1 === 'n' ||
              c1 === 'c'
            )
              return pos

            pos++
            return pos
          }

          // Los grupos pt, ct, cn, ps, mn, gn, ft, pn, cz, tz, ts comienzan silaba (Bezos)
          if (
            (c2 === 'p' && c3 === 't') ||
            (c2 === 'c' && c3 === 't') ||
            (c2 === 'c' && c3 === 'n') ||
            (c2 === 'p' && c3 === 's') ||
            (c2 === 'm' && c3 === 'n') ||
            (c2 === 'g' && c3 === 'n') ||
            (c2 === 'f' && c3 === 't') ||
            (c2 === 'p' && c3 === 'n') ||
            (c2 === 'c' && c3 === 'z') ||
            (c2 === 't' && c3 === 'z') ||
            (c2 === 't' && c3 === 's')
          ) {
            pos++
            return pos
          }

          if (
            c3 === 'l' ||
            c3 === 'r' || // Los grupos consonánticos formados por una consonante
            // seguida de 'l' o 'r' no pueden separarse y siempre inician sílaba
            (c2 === 'c' && c3 === 'h') || // 'ch'
            c3 === 'y'
          ) {
            // 'y' funciona como vocal
            pos++ // Siguiente sílaba empieza en c2
          } else pos += 2 // c3 inicia la siguiente sílaba
        }
      } else {
        if (c2 === 'y') return pos

        pos += 2 // La palabra acaba con dos consonantes
      }
    }
    return pos
  }

  /**
   * Determina si se forma hiato/s
   */
  private hiato(): void {
    let vocalFuerteAnterior = false // Almacena el tipo de vocal (Fuerte o Debil)
    this.silaba.hiato = []

    // La 'u' de "qu" no forma hiato
    if (
      this.silaba.letraTildada > 1 &&
      this.silaba.palabra[this.silaba.letraTildada - 1] === 'u' &&
      this.silaba.palabra[this.silaba.letraTildada - 2] === 'q'
    ) {
      this.silaba.hiato.push({
        tipoHiato: 'Hiato simple',
        silabaHiato:
          this.silaba.palabra[this.silaba.letraTildada] +
          '-' +
          this.silaba.palabra[this.silaba.letraTildada + 1],
      })
    }

    for (let i = 0; i < this.silaba.palabra.length; i++) {
      // Hiato Acentual
      if ('íìúù'.indexOf(this.silaba.palabra[i]) > -1) {
        if (i > 0 && this.vocalFuerte(this.silaba.palabra[i - 1])) {
          this.silaba.hiato.push({
            tipoHiato: 'Hiato acentual',
            silabaHiato:
              this.silaba.palabra[i - 1] + '-' + this.silaba.palabra[i],
          })
          vocalFuerteAnterior = false
          continue
        }

        if (
          i < this.silaba.longitudPalabra - 1 &&
          this.vocalFuerte(this.silaba.palabra[i + 1])
        ) {
          this.silaba.hiato.push({
            tipoHiato: 'Hiato acentual',
            silabaHiato:
              this.silaba.palabra[i] + '-' + this.silaba.palabra[i + 1],
          })
          vocalFuerteAnterior = false
          continue
        }
      }

      // Hiato Simple
      if (vocalFuerteAnterior && this.vocalFuerte(this.silaba.palabra[i])) {
        this.silaba.hiato.push({
          tipoHiato: 'Hiato simple',
          silabaHiato:
            this.silaba.palabra[i - 1] + '-' + this.silaba.palabra[i],
        })
      }

      // Hiato Simple con 'h' intermedio
      if (
        vocalFuerteAnterior &&
        this.silaba.palabra[i] === 'h' &&
        this.vocalFuerte(this.silaba.palabra[i + 1])
      ) {
        this.silaba.hiato.push({
          tipoHiato: 'Hiato simple',
          silabaHiato:
            this.silaba.palabra[i - 1] + '-h' + this.silaba.palabra[i + 1],
        })
      }

      vocalFuerteAnterior = this.vocalFuerte(this.silaba.palabra[i])
    }
  }

  /**
   * Determina si se forma triptongo/s y diptongo/s
   */
  private diptongoTriptongo(): void {
    this.silaba.diptongo = []
    this.silaba.triptongo = []

    // Vocal Debil = VD
    // Vocal Fuerte = VF

    let expresion: RegExp

    for (let i = 0; i < this.silaba.silabas.length; i++) {
      // Triptongo (VD - VF - VD) = ((i|u)(a|e|o)(i|u))
      expresion = /((i|u)(a|e|o)(i|u))/g
      const triptongo = this.silaba.silabas[i].silaba.match(expresion)
      if (triptongo) {
        this.silaba.triptongo.push({
          tipo: 'Triptongo',
          silaba: triptongo[0],
        })
        continue
      }

      // Diptongo Creciente (VD - VF) = ((i|u)(a|e|o))
      expresion = /((i|u)(a|e|o))/g
      const diptongoCreciente = this.silaba.silabas[i].silaba.match(expresion)
      if (diptongoCreciente) {
        this.silaba.diptongo.push({
          tipo: 'Diptongo Creciente',
          silaba: diptongoCreciente[0],
        })
        continue
      }

      // Diptongo Decreciente (VF - VD) : ((a|e|o)(i|u))
      expresion = /((a|e|o)(i|u))/g
      const diptongoDecreciente = this.silaba.silabas[i].silaba.match(expresion)
      if (diptongoDecreciente) {
        this.silaba.diptongo.push({
          tipo: 'Diptongo Decreciente',
          silaba: diptongoDecreciente[0],
        })
        continue
      }

      // Diptongo Homogeneo (VD - VD) : ((i|u)(i|u))
      expresion = /((i|u)(i|u))/g
      const diptongoHomogeneo = this.silaba.silabas[i].silaba.match(expresion)
      if (diptongoHomogeneo) {
        this.silaba.diptongo.push({
          tipo: 'Diptongo Homogéneos',
          silaba: diptongoHomogeneo[0],
        })
      }
    }
  }

  /**
   * Determina el tipo de acentuacion de la palabra
   */
  private acentuacion(): void {
    switch (this.silaba.numeroSilaba - this.silaba.tonica) {
      case 0:
        this.silaba.acentuacion = 'Aguda'
        break
      case 1:
        this.silaba.acentuacion = 'Grave (Llana)'
        break
      case 2:
        this.silaba.acentuacion = 'Esdrújula'
        break
      default:
        this.silaba.acentuacion = 'Sobresdrújula'
        break
    }
  }

  /**
   * Determina si c es una vocal fuerte o débil acentuada
   */
  private vocalFuerte(c: string): boolean {
    switch (c) {
      case 'a':
      case 'á':
      case 'A':
      case 'Á':
      case 'à':
      case 'À':
      case 'e':
      case 'é':
      case 'E':
      case 'É':
      case 'è':
      case 'È':
      case 'í':
      case 'Í':
      case 'ì':
      case 'Ì':
      case 'o':
      case 'ó':
      case 'O':
      case 'Ó':
      case 'ò':
      case 'Ò':
      case 'ú':
      case 'Ú':
      case 'ù':
      case 'Ù':
        return true
    }
    return false
  }

  /**
   * Determina si c no es una vocal
   */
  private esConsonante(c: string): boolean {
    if (!this.vocalFuerte(c)) {
      switch (c) {
        // Vocal débil
        case 'i':
        case 'I':
        case 'u':
        case 'U':
        case 'ü':
        case 'Ü':
          return false
      }
      return true
    }
    return false
  }
}
