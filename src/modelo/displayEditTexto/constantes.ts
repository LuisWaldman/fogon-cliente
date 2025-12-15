export enum TipoRima {
  SIN_RIMA = 'sin rima',
  CONSONANTE = 'consonante',
  ASONANTE = 'asonante',
}

export const CONFIGURACION_ANALISIS = {
  UMBRAL_RIMA_PREDOMINANTE: 0.7,
  VENTANA_BUSQUEDA_RIMA: 5,
  RANGO_TOLERANCIA_SILABAS: 2,
  MAX_GRUPOS_SILABAS: 2,
  CODIGO_ASCII_A_MAYUSCULA: 65,
  CODIGO_ASCII_A_MINUSCULA: 97,
} as const

export type ConfiguracionAnalisis = typeof CONFIGURACION_ANALISIS
