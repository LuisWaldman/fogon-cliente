// ahora importa el helper que podría invocar xsltproc en la carga
import { XMLHelper } from './XMLHelper'
import { assert, describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import type { PentagramaCompas } from '../cancion/pentagramacompas'

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
    const compas1 = score.parts[0].measures[0]
    expect(compas1.notes[0].beam.length).toBe(1)
    expect(compas1.notes[0].beam[0].number).toBe(1)
    expect(compas1.notes[0].beam[0].type).toBe('begin')
    expect(compas1.notes[1].beam.length).toBe(1)
    expect(compas1.notes[1].beam[0].number).toBe(1)
    expect(compas1.notes[1].beam[0].type).toBe('continue')
    expect(compas1.notes[3].beam[0].number).toBe(1)
    expect(compas1.notes[3].beam[0].type).toBe('end')
    const compasPart: PentagramaCompas = compas1.GetPentagramaCompas(1)
    expect(compasPart.beams.length).toEqual(2)
    expect(compasPart.beams[0].numero).toBe(1)
    expect(compasPart.beams[0].inicio).toBe(0)
    expect(compasPart.beams[0].fin).toBe(3)
    expect(compasPart.beams[1].numero).toBe(1)
    expect(compasPart.beams[1].inicio).toBe(5)
    expect(compasPart.beams[1].fin).toBe(6)
  })

  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const pentagrama = helper.XMLToPentagramas(pruebaXmlSimple)
    expect(pentagrama.length).toBe(1)
    expect(pentagrama[0].instrumento).toBe('P1')
    expect(pentagrama[0].clave).toBe('treble')
    expect(pentagrama[0].compases.length).toBe(32)
    expect(pentagrama[0].compases[0].notas.length).toBe(4)
    expect(pentagrama[0].compases[0].notas[0].length).toBe(3)
    expect(pentagrama[0].compases[0].notas[0][0].nota).toBe('C4')
    expect(pentagrama[0].compases[0].notas[0][1].nota).toBe('E4')
    expect(pentagrama[0].compases[0].notas[0][2].nota).toBe('G4')
    expect(pentagrama[0].compases[0].notas[0][0].duracion).equal('4')
    expect(pentagrama[0].compases[0].notas[0][1].duracion).equal('4')
    expect(pentagrama[0].compases[0].notas[0][2].duracion).equal('4')
    expect(pentagrama[0].compases[0].notas[1].length).toBe(1)
    expect(pentagrama[0].compases[0].notas[1][0].nota).toBe('C4')
    expect(pentagrama[0].compases[0].notas[1][0].duracion).equal('4')
  })

  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXmlSimple)
    expect(score.parts.length).toBe(1)
    const parte1 = score.parts[0]
    expect(parte1.measures.length).toBe(32)
    const compas1 = parte1.measures[0]
    expect(compas1.notes.length).toBe(6)

    expect(compas1.notes[0].isChord).toBe(false)
    expect(compas1.notes[1].isChord).toBe(true)
    expect(compas1.notes[2].isChord).toBe(true)
    expect(compas1.notes[3].isChord).toBe(false)
    expect(compas1.notes[4].isChord).toBe(false)
    expect(compas1.notes[5].isChord).toBe(false)

    const compasPart: PentagramaCompas = compas1.GetPentagramaCompas(1)
    expect(compasPart.notas.length).toBe(4)
    expect(compasPart.notas[0].length).toBe(3)
    expect(compasPart.notas[0][0].nota).toBe('C4')
    expect(compasPart.notas[0][1].nota).toBe('E4')
    expect(compasPart.notas[0][2].nota).toBe('G4')
    expect(compasPart.notas[0][0].duracion).equal('4')
    expect(compasPart.notas[0][1].duracion).equal('4')
    expect(compasPart.notas[0][2].duracion).equal('4')
    expect(compasPart.notas[1].length).toBe(1)
    expect(compasPart.notas[1][0].nota).toBe('C4')
    expect(compasPart.notas[1].length).toBe(1)
    expect(compasPart.notas[1][0].nota).toBe('C4')
    expect(compasPart.notas[1].length).toBe(1)
    expect(compasPart.notas[1][0].nota).toBe('C4')
  })

  it('Procesa Vals.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXmlVals)
    expect(score.parts.length).toBe(12)
  })

  it('Procesa flaca.musicxml XMLTToScore', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXmlFlaca)
    expect(score.parts.length).toBe(1)
    expect(score.parts[0].claves).toEqual(['G', 'F'])
  })

  it('Procesa flaca.musicxml To pentagrama', () => {
    const helper = new XMLHelper()
    const pentagramas = helper.XMLToPentagramas(pruebaXmlFlaca)
    expect(pentagramas.length).toBe(2)
    expect(pentagramas[0].clave).toEqual('treble')
    expect(pentagramas[1].clave).toEqual('bass')
    const pentaSol = pentagramas[0]
    pentaSol.compases.forEach((c, nrocompas) => {
      // console.log(c.notas)
      c.notas.forEach((n, indexno) => {
        n.forEach((nn, indexno2) => {
          if (nn.nota === '') {
            console.log(
              'Compás con nota sin paso',
              nrocompas,
              indexno,
              indexno2,
            )
            expect(nn.nota).toMatch(/^[A-G][#b]?[0-9]$/)
          }
          expect(nn.nota).toMatch(/^[A-G][#b]?[0-9]$/)
        })
      })
    })
    expect(pentagramas[0].compases.length).toBe(49)
    expect(pentagramas[1].compases.length).toBe(49)
  })

  it('Flaca.musicxml Los dos pentagramas del piano', () => {
    const helper = new XMLHelper()
    const pentagramas = helper.XMLToPentagramas(pruebaXmlFlaca)
    expect(pentagramas.length).toBe(2)
    expect(pentagramas[0].clave).toEqual('treble')
    expect(pentagramas[0].compases[0].beams.length).toEqual(1)
    expect(pentagramas[0].compases[0].beams[0].numero).toBe(1)
    expect(pentagramas[0].compases[0].beams[0].inicio).toBe(2)
    expect(pentagramas[0].compases[0].beams[0].fin).toBe(5)
    expect(pentagramas[1].clave).toEqual('bass')
    expect(pentagramas[0].compases.length).toBe(49)
    expect(pentagramas[1].compases.length).toBe(49)
    expect(pentagramas[0].compases[0].notas.length > 0).toBe(true)
    expect(pentagramas[1].compases[0].notas.length > 0).toBe(true)
  })

  it('Procesa prueba1.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXmlDeMi)
    expect(score.parts.length).toBe(1)
  })

  it('Procesa adios.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXmlAdios)
    expect(score.parts.length).toBe(4)
  })

  it('Procesa OpusChopin.musicxml XMLToPentagramas', () => {
    const helper = new XMLHelper()
    const score = helper.XMLTToScore(pruebaXmlOpusChopin)
    assert(score.parts.length === 1)
  })
})
