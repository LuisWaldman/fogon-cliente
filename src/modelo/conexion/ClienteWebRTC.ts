export class ClienteWebRTC {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel

  constructor() {
    this.peerConnection = new RTCPeerConnection()

    // Creamos el canal de datos para sincronización
    this.dataChannel = this.peerConnection.createDataChannel('sync')

    this.dataChannel.onopen = () => {
      console.log('✅ Canal de sincronización abierto')
    }

    this.dataChannel.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      console.log('📩 Mensaje recibido:', msg)
    }
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
  }

  // Método para enviar un timestamp por el canal
  SendTimestamp(): void {
    if (this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({ type: 'ping', time: Date.now() }))
    }
  }
}
