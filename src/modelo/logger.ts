import packageJson from '../../package.json'

export class Logger {
  static log(message: string): void {
    const logLevel = Number(packageJson.log) || 0
    if (logLevel < 1) {
      console.log(`[LOG]: ${message}`)
    }
  }
}
