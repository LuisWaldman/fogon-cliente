import { describe, expect, it } from 'vitest'
import { SeparadorSilabas } from './SeparadorSilabas'

describe('Pruebo SeparadorSilabas - CalcularDiferenciaSilabas', () => {
  const sepSilabas = new SeparadorSilabas()

  it('Pruebo rimas', () => {
    expect(sepSilabas.GetRima(sepSilabas.getSilabas('algo'))).toEqual('algo')
    expect(sepSilabas.GetRima(sepSilabas.getSilabas('calgo'))).toEqual('algo')
    expect(sepSilabas.GetRima(sepSilabas.getSilabas('galgo'))).toEqual('algo')
    expect(sepSilabas.GetRima(sepSilabas.getSilabas('vos'))).toEqual('vos')
    expect(sepSilabas.GetRima(sepSilabas.getSilabas('sabés'))).toEqual('es')
    expect(sepSilabas.GetRima(sepSilabas.getSilabas('paces'))).toEqual('es')
    expect(sepSilabas.GetRima(sepSilabas.getSilabas('péces'))).toEqual('eces')
  })
})
