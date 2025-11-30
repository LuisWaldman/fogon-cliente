import { Logger } from '../logger'

export class ClienteWebRTC {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel | null = null // Allow null initially

  constructor() {
    this.peerConnection = new RTCPeerConnection()

    // Handle incoming data channels (for answerer)
    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel
      this.setupDataChannel()
    }

    // For offerer: Create and setup channel
    this.createDataChannel()
  }

  private createDataChannel(): void {
    if (!this.dataChannel) {
      this.dataChannel = this.peerConnection.createDataChannel('sync')
      this.setupDataChannel()
    }
  }

  private setupDataChannel(): void {
    if (!this.dataChannel) return

    this.dataChannel.onopen = () => {
      if (this.OnConnOpened) {
        this.OnConnOpened()
      }
    }

    this.dataChannel.onmessage = (event) => {
      if (event.data === 'close') {
        this.cerrarYreiniciar()
      } else {
        this.OnMensaje?.(event.data)
      }
    }
  }
  private OnMensaje?: (msg: string) => void
  public setOnMensajeHandler(handler: (msg: string) => void): void {
    this.OnMensaje = handler
  }

  private Reiniciar?: () => void
  public setOnReiniciarHandler(handler: () => void): void {
    this.Reiniciar = handler
  }
  private OnConnOpened?: () => void
  public setOnConnOpenedHandler(handler: () => void): void {
    this.OnConnOpened = handler
  }

  // Establece la oferta recibida
  async SetRemoteOffer(sdp: string): Promise<void> {
    Logger.log('Estableciendo oferta remota SDP...')
    const remoteOffer = new RTCSessionDescription({ type: 'offer', sdp })
    await this.peerConnection.setRemoteDescription(remoteOffer)
  }

  // Genera la respuesta SDP
  async CreateAnswerSDP(): Promise<string> {
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)
    await this.waitForIceGatheringComplete()
    return this.peerConnection.localDescription?.sdp || ''
  }

  async GetSDP(): Promise<string> {
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)

    // Esperamos a que se completen los candidatos ICE
    await this.waitForIceGatheringComplete()

    return this.peerConnection.localDescription?.sdp || ''
  }

  private waitForIceGatheringComplete(): Promise<void> {
    return new Promise((resolve) => {
      if (this.peerConnection.iceGatheringState === 'complete') {
        resolve()
      } else {
        const checkState = () => {
          if (this.peerConnection.iceGatheringState === 'complete') {
            this.peerConnection.removeEventListener(
              'icegatheringstatechange',
              checkState,
            )
            resolve()
          }
        }
        this.peerConnection.addEventListener(
          'icegatheringstatechange',
          checkState,
        )
      }
    })
  }

  // Método para establecer la respuesta SDP del otro peer
  async SetRemoteSDP(sdp: string): Promise<void> {
    const desc = new RTCSessionDescription({ type: 'answer', sdp })
    await this.peerConnection.setRemoteDescription(desc)
    Logger.log('✅ Respuesta SDP establecida correctamente')
  }

  cerrarYreiniciar() {
    // Close the data channel if it exists
    Logger.log('Cerrando conexión WebRTC y reiniciando...')
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.close()
      this.dataChannel = null
    }
    this.peerConnection.close()
    if (this.Reiniciar) {
      this.Reiniciar()
    }
  }

  closeConn(): void {
    this.dataChannel?.send('close')
    this.cerrarYreiniciar()
  }
  // Método para enviar un timestamp por el canal
  SendGetTime(): void {
    if (this.dataChannel?.readyState === 'open') {
      this.dataChannel.send('gettime')
    }
  }
  SendTime(time: number): void {
    if (this.dataChannel?.readyState === 'open') {
      this.dataChannel.send(time.toString())
    }
  }
}
