import type { Perfil } from '../modelo/perfil'

export class UserSesion {
  ID: string
  Usuario: string
  RolSesion: string
  PerfilUsr: Perfil

  constructor(id: string, usuario: string, perfil: Perfil, rolSesion: string) {
    this.ID = id
    this.Usuario = usuario
    this.PerfilUsr = perfil
    this.RolSesion = rolSesion
  }
}
