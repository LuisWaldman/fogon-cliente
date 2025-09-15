import { ObjetoPosteable } from '../objetoPosteable.ts'

export class SDPStruct extends ObjetoPosteable {
  sdp: string // URL o base64 de la imagen de perfil

  constructor(sdp: string) {
    super()
    this.sdp = sdp
  }
}
