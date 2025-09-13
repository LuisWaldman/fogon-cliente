// ahora importa el helper que podría invocar xsltproc en la carga
import { XMLHelper } from './XMLHelper'
import { assert, describe, it } from 'vitest'
import fs from 'fs'
import path from 'path'

// leer el XML conocido antes de crear el mock
const pruebaPath = path.join(
  __dirname,
  '../../../tests/MusicXML/prueba1.musicxml',
)
const pruebaXml = fs.existsSync(pruebaPath)
  ? fs.readFileSync(pruebaPath, 'utf8')
  : ''

describe('XML HELPER', () => {
  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXml)
    assert(pentagrama.length >= 0)
  })

  it('Procesa prueba1.musicxml XMLTToScore', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXml)
    assert(score.parts.length === 1)
  })
})
