import { assert, describe, it } from 'vitest'
import { Cancion } from '../cancion/cancion'
import { XMLHelper } from './XMLHelper'
import fs from 'fs'
import path from 'path'
import { HelperPentagramas } from './helperPentagramas'

// leer el XML conocido antes de crear el mock
const pruebaPath = path.join(
  __dirname,
  '../../../tests/MusicXML/prueba1.musicxml',
)

const pruebaXml = fs.readFileSync(pruebaPath, 'utf8')
describe('Helper Pentagrama', () => {
  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagramas = helper.XMLToPentagramas(pruebaXml)
    assert(pentagramas.length === 1)
    const helperPentagrama = new HelperPentagramas()
    const cancion = Cancion.GetDefault('def')
    cancion.pentagramas = pentagramas
    const modos = helperPentagrama.GetModos(cancion, false)
    // Set the first mode to visible and use it
    if (modos.length > 0) {
      modos[0].Ver = true
      helperPentagrama.creaDisplayPentagrama(cancion, modos[0])
    }
  })
})
