import packageJson from '../../package.json'

export class Logger {
  static log(...args: unknown[]): void {
    const logLevel = Number(packageJson.log) || 0
    if (logLevel < 1) {
      const formattedArgs = args.map((arg) =>
        typeof arg === 'string' ? arg : JSON.stringify(arg),
      )
      console.log('[LOG]:', ...formattedArgs)
    }
  }
}
