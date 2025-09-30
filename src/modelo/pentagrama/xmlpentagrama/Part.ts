import { Measure } from './Measure'

export class Part {
  nombre?: string
  instrumento?: string
  measures: Measure[] = []
  claves: string[] = []

  constructor(init?: Partial<Part>) {
    Object.assign(this, init)
  }
}
