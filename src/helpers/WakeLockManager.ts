// src/helpers/WakeLockManager.ts

export class WakeLockManager {
  private wakeLock: WakeLockSentinel | null = null;

  public async acquire(): Promise<void> {
    if (!('wakeLock' in navigator)) {
      console.log('Wake Lock API not supported.');
      return;
    }

    try {
      this.wakeLock = await (navigator as any).wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released');
      });
      console.log('Wake Lock is active');
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
  }

  public async release(): Promise<void> {
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = null;
    }
  }
}
