import packageJson from '../../package.json'
export class ErrorLogger {
  accion: string
  error: string
  fecha: Date
  constructor(accion: string, error: string) {
    this.accion = accion
    this.error = error
    this.fecha = new Date()
  }
}
export class Logger {
  public static errores: ErrorLogger[] = []
  public static errorVisto: boolean = false
  public static logError(accion: string, error: string): void {
    const errorLog = new ErrorLogger(accion, error)
    Logger.errores.push(errorLog)
    Logger.errorVisto = false
    const logLevel = Number(packageJson.log) || 0

    if (logLevel < 2) {
      console.error(
        '[ERROR]:',
        accion,
        typeof error === 'string' ? error : JSON.stringify(error),
      )
    }
  }

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
