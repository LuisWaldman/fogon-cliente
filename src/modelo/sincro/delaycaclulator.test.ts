import { DelayCalculador } from './DelayCalculador'
import { DelaySet } from './DelaySet'
import { describe, it, expect } from 'vitest'

describe('DelayCalculador', () => {
  it('Si esta vacio devuelve 0', () => {
    const calculador = new DelayCalculador()
    expect(calculador.getDelay()).toBe(0)
    expect(calculador.getError()).toBe(0)
  })

  it('Si tiene un elemento devuelve el delay de ese elemento y la mitad de lo que tardo', () => {
    const calculador = new DelayCalculador()
    const delaySet = new DelaySet(100, 50)
    calculador.addDelaySet(delaySet)
    expect(calculador.getDelay()).toBe(50)
    expect(calculador.getError()).toBe(50)
  })

  it('Si tiene 2 elementos devuelve el del que tardo menos', () => {
    const calculador = new DelayCalculador()
    const delaySet1 = new DelaySet(100, 50)
    const delaySet2 = new DelaySet(200, 100)
    calculador.addDelaySet(delaySet1)
    calculador.addDelaySet(delaySet2)
    //expect(calculador.getDelay()).toBe(50)
    //expect(calculador.getError()).toBe(50)
  })
})
