import type { DelaySet } from './DelaySet'

export class DelayCalculador {
  private delaySets: DelaySet[] = []
  private delay: number = 0
  private error: number = 0
  public addDelaySet(delaySet: DelaySet): void {
    this.delaySets.push(delaySet)
    let delay6Minimos = []
    const sortedDelaySets = [...this.delaySets].sort(
      (a, b) => a.Tardo - b.Tardo,
    )
    delay6Minimos = sortedDelaySets.slice(0, 6)
    const avgTardo =
      delay6Minimos.reduce((sum, ds) => sum + ds.Tardo, 0) /
      (delay6Minimos.length || 1)

    const avgDelay =
      delay6Minimos.reduce((sum, ds) => sum + ds.Delay, 0) /
      (delay6Minimos.length || 1)

    const varDelay =
      delay6Minimos.reduce(
        (sum, ds) => sum + Math.pow(ds.Delay - avgDelay, 2),
        0,
      ) / (delay6Minimos.length || 1)

    // Update delay and error properties
    this.delay = avgDelay
    this.error = Math.sqrt(varDelay) + avgTardo / 2
  }

  public getDelay(): number {
    return this.delay
  }

  public getError(): number {
    return this.error
  }
}
