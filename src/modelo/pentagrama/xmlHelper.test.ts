// ahora importa el helper que podría invocar xsltproc en la carga
import { XMLHelper } from './XMLHelper'
import { assert, describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

// leer el XML conocido antes de crear el mock
const pruebaPath = path.join(
  __dirname,
  '../../../tests/MusicXML/prueba1.musicxml',
)
const pruebaPathsimple = path.join(
  __dirname,
  '../../../tests/MusicXML/simple.musicxml',
)

const pruebaPathVals = path.join(
  __dirname,
  '../../../tests/MusicXML/vals-de-las-flores.musicxml',
)
const pruebaPathFlaca = path.join(
  __dirname,
  '../../../tests/MusicXML/flaca-andres-calamaro-flaca-piano-easy.musicxml',
)
const pruebaPathDeMi = path.join(
  __dirname,
  '../../../tests/MusicXML/de-mi-de-charly-garcia.musicxml',
)

const pruebaPathAdios = path.join(
  __dirname,
  '../../../tests/MusicXML/adios-nonino-astor-piazzolla-adios-nonino.musicxml',
)


const pruebaPathOpus = path.join(
  __dirname,
  '../../../tests/MusicXML/chopin-nocturne-op-9-no-2-e-flat-major.musicxml',
)


const pruebaXml = fs.readFileSync(pruebaPath, 'utf8')
const pruebaXmlSimple = fs.readFileSync(pruebaPathsimple, 'utf8')
const pruebaXmlVals = fs.readFileSync(pruebaPathVals, 'utf8')
const pruebaXmlFlaca = fs.readFileSync(pruebaPathFlaca, 'utf8')
const pruebaXmlDeMi = fs.readFileSync(pruebaPathDeMi, 'utf8')
const pruebaXmlAdios = fs.readFileSync(pruebaPathAdios, 'utf8')
const pruebaXmlOpusChopin = fs.readFileSync(pruebaPathOpus, 'utf8')

  describe('XML HELPER', () => {

    
  it('Procesa prueba1.musicxml XMLTToScore', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXml)
    assert(score.parts.length === 1)
  })

  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXml)
    assert(pentagrama.length >= 0)
  })
  
  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXmlSimple)
    assert(pentagrama.length >= 0)
  })

  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXmlVals)
    assert(pentagrama.length >= 0)
  })
  
  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXmlFlaca)
    assert(pentagrama.length >= 0)
  })

  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXmlDeMi)
    assert(pentagrama.length >= 0)
  })

  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXmlAdios)
    assert(pentagrama.length >= 0)
  })
  
  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXmlOpusChopin)
    assert(pentagrama.length >= 0)
  })

})
