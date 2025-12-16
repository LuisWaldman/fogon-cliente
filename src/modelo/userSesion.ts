import type { Perfil } from '../modelo/perfil'

export type RolesSesion = 'director' | 'admin' | 'visitante' | 'noasignado'
export class UserSesion {
  ID: string
  Usuario: string
  RolSesion: RolesSesion
  PerfilUsr: Perfil

  constructor(
    id: string,
    usuario: string,
    perfil: Perfil,
    rolSesion: RolesSesion,
  ) {
    this.ID = id
    this.Usuario = usuario
    this.PerfilUsr = perfil
    this.RolSesion = rolSesion
  }
}
