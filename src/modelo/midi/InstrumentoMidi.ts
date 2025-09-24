export class InstrumentoMidi {
  static GetCategoria(): any {
    // Puedes ajustar el tipo de retorno según lo que necesites
    return [
      'Cuerdas',
      'Vientos',
      'Percusion',
      'Teclados',
      'Metales',
      'Maderas',
      'Sintetizadores',
      'Efectos',
      'Voces',
      'Otros',
    ]
  }
  public nombre: string
  public archivo: string
  public categoria: string
  constructor(nombre: string, archivo: string, categoria: string) {
    this.nombre = nombre
    this.archivo = archivo
    this.categoria = categoria
  }

  public static GetInstrumentos(): InstrumentoMidi[] {
    return [
      new InstrumentoMidi('Accordion', 'accordion.json', 'Vientos'),
      new InstrumentoMidi('Bateria', 'bateria.json', 'Percusion'),
      new InstrumentoMidi('Acoustic Bass', 'acoustic_bass.json', 'Cuerdas'),
      new InstrumentoMidi(
        'Acoustic Grand Piano',
        'acoustic_grand_piano.json',
        'Teclados',
      ),
      new InstrumentoMidi(
        'Acoustic Guitar Nylon',
        'acoustic_guitar_nylon.json',
        'Cuerdas',
      ),
      new InstrumentoMidi(
        'Acoustic Guitar Steel',
        'acoustic_guitar_steel.json',
        'Cuerdas',
      ),
      new InstrumentoMidi('Agogo', 'agogo.json', 'Percusion'),
      new InstrumentoMidi('Alto Sax', 'alto_sax.json', 'Maderas'),
      new InstrumentoMidi('Applause', 'applause.json', 'Efectos'),
      new InstrumentoMidi('Bagpipe', 'bagpipe.json', 'Vientos'),
      new InstrumentoMidi('Banjo', 'banjo.json', 'Cuerdas'),
      new InstrumentoMidi('Baritone Sax', 'baritone_sax.json', 'Maderas'),
      new InstrumentoMidi('Bassoon', 'bassoon.json', 'Maderas'),
      new InstrumentoMidi('Bird Tweet', 'bird_tweet.json', 'Efectos'),
      new InstrumentoMidi('Blown Bottle', 'blown_bottle.json', 'Vientos'),
      new InstrumentoMidi('Brass Section', 'brass_section.json', 'Metales'),
      new InstrumentoMidi('Breath Noise', 'breath_noise.json', 'Efectos'),
      new InstrumentoMidi(
        'Bright Acoustic Piano',
        'bright_acoustic_piano.json',
        'Teclados',
      ),
      new InstrumentoMidi('Celesta', 'celesta.json', 'Teclados'),
      new InstrumentoMidi('Cello', 'cello.json', 'Cuerdas'),
      new InstrumentoMidi('Choir Aahs', 'choir_aahs.json', 'Voces'),
      new InstrumentoMidi('Church Organ', 'church_organ.json', 'Teclados'),
      new InstrumentoMidi('Clarinet', 'clarinet.json', 'Maderas'),
      new InstrumentoMidi('Clavinet', 'clavinet.json', 'Teclados'),
      new InstrumentoMidi('Contrabass', 'contrabass.json', 'Cuerdas'),
      new InstrumentoMidi(
        'Distortion Guitar',
        'distortion_guitar.json',
        'Cuerdas',
      ),
      new InstrumentoMidi('Drawbar Organ', 'drawbar_organ.json', 'Teclados'),
      new InstrumentoMidi('Dulcimer', 'dulcimer.json', 'Cuerdas'),
      new InstrumentoMidi(
        'Electric Bass Finger',
        'electric_bass_finger.json',
        'Cuerdas',
      ),
      new InstrumentoMidi(
        'Electric Bass Pick',
        'electric_bass_pick.json',
        'Cuerdas',
      ),
      new InstrumentoMidi(
        'Electric Grand Piano',
        'electric_grand_piano.json',
        'Teclados',
      ),
      new InstrumentoMidi(
        'Electric Guitar Clean',
        'electric_guitar_clean.json',
        'Cuerdas',
      ),
      new InstrumentoMidi(
        'Electric Guitar Jazz',
        'electric_guitar_jazz.json',
        'Cuerdas',
      ),
      new InstrumentoMidi(
        'Electric Guitar Muted',
        'electric_guitar_muted.json',
        'Cuerdas',
      ),
      new InstrumentoMidi(
        'Electric Piano 1',
        'electric_piano_1.json',
        'Teclados',
      ),
      new InstrumentoMidi(
        'Electric Piano 2',
        'electric_piano_2.json',
        'Teclados',
      ),
      new InstrumentoMidi('English Horn', 'english_horn.json', 'Maderas'),
      new InstrumentoMidi('Fiddle', 'fiddle.json', 'Cuerdas'),
      new InstrumentoMidi('Flute', 'flute.json', 'Maderas'),
      new InstrumentoMidi('French Horn', 'french_horn.json', 'Metales'),
      new InstrumentoMidi('Fretless Bass', 'fretless_bass.json', 'Cuerdas'),
      new InstrumentoMidi('Fx 1 Rain', 'fx_1_rain.json', 'Efectos'),
      new InstrumentoMidi('Fx 2 Soundtrack', 'fx_2_soundtrack.json', 'Efectos'),
      new InstrumentoMidi('Fx 3 Crystal', 'fx_3_crystal.json', 'Efectos'),
      new InstrumentoMidi('Fx 4 Atmosphere', 'fx_4_atmosphere.json', 'Efectos'),
      new InstrumentoMidi('Fx 5 Brightness', 'fx_5_brightness.json', 'Efectos'),
      new InstrumentoMidi('Fx 6 Goblins', 'fx_6_goblins.json', 'Efectos'),
      new InstrumentoMidi('Fx 7 Echoes', 'fx_7_echoes.json', 'Efectos'),
      new InstrumentoMidi('Fx 8 Scifi', 'fx_8_scifi.json', 'Efectos'),
      new InstrumentoMidi('Glockenspiel', 'glockenspiel.json', 'Percusion'),
      new InstrumentoMidi(
        'Guitar Fret Noise',
        'guitar_fret_noise.json',
        'Efectos',
      ),
      new InstrumentoMidi(
        'Guitar Harmonics',
        'guitar_harmonics.json',
        'Efectos',
      ),
      new InstrumentoMidi('Gunshot', 'gunshot.json', 'Efectos'),
      new InstrumentoMidi('Harmonica', 'harmonica.json', 'Vientos'),
      new InstrumentoMidi('Harpsichord', 'harpsichord.json', 'Teclados'),
      new InstrumentoMidi('Helicopter', 'helicopter.json', 'Efectos'),
      new InstrumentoMidi(
        'Honkytonk Piano',
        'honkytonk_piano.json',
        'Teclados',
      ),
      new InstrumentoMidi('Kalimba', 'kalimba.json', 'Percusion'),
      new InstrumentoMidi('Koto', 'koto.json', 'Cuerdas'),
      new InstrumentoMidi(
        'Lead 1 Square',
        'lead_1_square.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi(
        'Lead 2 Sawtooth',
        'lead_2_sawtooth.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi(
        'Lead 3 Calliope',
        'lead_3_calliope.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi(
        'Lead 4 Chiff',
        'lead_4_chiff.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi(
        'Lead 5 Charang',
        'lead_5_charang.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi(
        'Lead 6 Voice',
        'lead_6_voice.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi(
        'Lead 7 Fifths',
        'lead_7_fifths.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi(
        'Lead 8 Bass  Lead',
        'lead_8_bass__lead.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi('Marimba', 'marimba.json', 'Percusion'),
      new InstrumentoMidi('Melodic Tom', 'melodic_tom.json', 'Percusion'),
      new InstrumentoMidi('Music Box', 'music_box.json', 'Percusion'),
      new InstrumentoMidi('Muted Trumpet', 'muted_trumpet.json', 'Metales'),
      new InstrumentoMidi('Oboe', 'oboe.json', 'Maderas'),
      new InstrumentoMidi('Ocarina', 'ocarina.json', 'Vientos'),
      new InstrumentoMidi('Orchestral Harp', 'orchestral_harp.json', 'Cuerdas'),
      new InstrumentoMidi('Orchestra Hit', 'orchestra_hit.json', 'Efectos'),
      new InstrumentoMidi(
        'Overdriven Guitar',
        'overdriven_guitar.json',
        'Cuerdas',
      ),
      new InstrumentoMidi(
        'Pad 1 New Age',
        'pad_1_new_age.json',
        'Sintetizadores',
      ),
      new InstrumentoMidi('Pad 2 Warm', 'pad_2_warm.json', 'Sintetizadores'),
      // Puedes seguir agregando más instrumentos y categorías según sea necesario
    ]
  }
}
