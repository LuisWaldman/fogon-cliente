// src/helpers/WakeLockManager.ts

interface WakeLockSentinel extends EventTarget {
  release(): Promise<void>
}

interface Navigator {
  wakeLock?: {
    request(type: 'screen'): Promise<WakeLockSentinel>
  }
}

export class WakeLockManager {
  private wakeLock: WakeLockSentinel | null = null

  public async acquire(): Promise<void> {
    if (!('wakeLock' in navigator)) {
      console.log('Wake Lock API not supported.')
      return
    }

    try {
      const nav = navigator as Navigator
      if (nav.wakeLock) {
        this.wakeLock = await nav.wakeLock.request('screen')
        this.wakeLock.addEventListener('release', () => {
          console.log('Wake Lock was released')
        })
        console.log('Wake Lock is active')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`${err.name}, ${err.message}`)
      }
    }
  }

  public async release(): Promise<void> {
    if (this.wakeLock) {
      await this.wakeLock.release()
      this.wakeLock = null
    }
  }
}
