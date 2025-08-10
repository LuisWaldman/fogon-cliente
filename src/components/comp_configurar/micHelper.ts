export class MicHelper {
  private permissionState: PermissionState | null = null
  private permissionStatus: PermissionStatus | null = null

  /**
   * Verifica el estado actual del permiso del micrófono.
   */
  async getEstadoMic(): Promise<PermissionState> {
    try {
      this.permissionStatus = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      })
      this.permissionState = this.permissionStatus.state
      return this.permissionState
    } catch (error) {
      console.error('Error al verificar el permiso del micrófono:', error)
      return 'denied'
    }
  }

  /**
   * Solicita acceso al micrófono si el permiso no está denegado.
   */
  async requestMicAccess(): Promise<MediaStream | null> {
    if (this.permissionState === 'denied') {
      console.warn('Acceso al micrófono denegado por el usuario.')
      return null
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      return stream
    } catch (error) {
      console.error('Error al solicitar acceso al micrófono:', error)
      return null
    }
  }

  /**
   * Escucha cambios en el estado del permiso del micrófono.
   */
  async monitorPermissionChanges(
    callback: (newState: PermissionState) => void,
  ): Promise<void> {
    if (!this.permissionStatus) {
      await this.checkPermission()
    }

    if (this.permissionStatus) {
      this.permissionStatus.onchange = () => {
        this.permissionState = this.permissionStatus!.state
        callback(this.permissionState)
      }
    }
  }
}
