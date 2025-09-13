export class Note {
  step?: string
  octave?: number
  alter?: number
  duration?: number
  type?: string
  isRest?: boolean
  tie?: string

  constructor(init?: Partial<Note>) {
    Object.assign(this, init)
  }
}
