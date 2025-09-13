import { Part } from './Part'

export class Score {
  parts: Part[] = []

  constructor(init?: Partial<Score>) {
    Object.assign(this, init)
  }
}
