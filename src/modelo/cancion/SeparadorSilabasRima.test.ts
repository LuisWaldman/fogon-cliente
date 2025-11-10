import { describe, expect, it } from 'vitest'
import { SeparadorSilabas } from './SeparadorSilabas'

describe('Pruebo SeparadorSilabas - CalcularDiferenciaSilabas', () => {
  const sepSilabas = new SeparadorSilabas()

  it('Pruebo nro de silabas palabras simples', () => {
    expect(
      sepSilabas.GetNroSilabasVerso(sepSilabas.getSilabasPalabra('canción')),
    ).toEqual(3)
    expect(
      sepSilabas.GetNroSilabasVerso([sepSilabas.getSilabas('cabalgo')]),
    ).toEqual(3)
  })

  it('Pruebo termina con vocal', () => {
    expect(sepSilabas.TerminaConVocal('canción')).toEqual(false)
    expect(sepSilabas.TerminaConVocal('cabalgo')).toEqual(true)

    expect(sepSilabas.TerminaConVocal('hoy')).toEqual(true)
  })

  it('Pruebo empieza con vocal', () => {
    expect(sepSilabas.EmpiezaConVocal('canción')).toEqual(false)
    expect(sepSilabas.EmpiezaConVocal('cabalgo')).toEqual(false)

    expect(sepSilabas.EmpiezaConVocal('abarco')).toEqual(true)
    expect(sepSilabas.EmpiezaConVocal('hoy')).toEqual(true)
  })

  it('Pruebo nro de 2 palabras silabas', () => {
    expect(
      sepSilabas.GetNroSilabasVerso([
        sepSilabas.getSilabas('vela'),
        sepSilabas.getSilabas('cavela'),
      ]),
    ).toEqual(5)
    expect(
      sepSilabas.GetNroSilabasVerso([
        sepSilabas.getSilabas('vela'),
        sepSilabas.getSilabas('cavela'),
      ]),
    ).toEqual(5)
  })

  it('Pruebo contar silabas', () => {
    expect(
      sepSilabas.GetNroSilabasVerso(
        sepSilabas.getSilabasPalabra('la vela cavela'),
      ),
    ).toEqual(6)
    expect(
      sepSilabas.GetNroSilabasVerso(
        sepSilabas.getSilabasPalabra('la ela cavela'),
      ),
    ).toEqual(5)
    expect(
      sepSilabas.GetNroSilabasVerso(
        sepSilabas.getSilabasPalabra('la ela cavela cayó'),
      ),
    ).toEqual(8)
  })

  it('Pruebo contar silabas de versos famosos', () => {
    expect(
      sepSilabas.GetNroSilabasVerso(
        sepSilabas.getSilabasPalabra('Soñé que el río me hablaba'),
      ),
    ).toEqual(7)
  })

  it('Pruebo rimas', () => {
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('acabó')])).toEqual('o')
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('algo')])).toEqual('algo')
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('calgo')])).toEqual('algo')
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('galgo')])).toEqual('algo')
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('vos')])).toEqual('os')
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('sabés')])).toEqual('es')
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('paces')])).toEqual('aces')
    expect(sepSilabas.GetRima([sepSilabas.getSilabas('péces')])).toEqual('eces')
  })
})
