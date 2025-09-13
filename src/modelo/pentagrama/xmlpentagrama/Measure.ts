import { Note } from './Note'

export class Measure {
  number?: number
  notes: Note[] = []

  constructor(init?: Partial<Measure>) {
    Object.assign(this, init)
  }
}
