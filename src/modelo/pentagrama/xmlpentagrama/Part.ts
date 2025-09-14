import { Measure } from './Measure'

export class Part {
  id?: string
  name?: string
  measures: Measure[] = []
  claves: string[] = []

  constructor(init?: Partial<Part>) {
    Object.assign(this, init)
  }
}
