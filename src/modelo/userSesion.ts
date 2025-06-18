export class UserSesion {
  Usuario: string
  NombrePerfil: string
  RolSesion: string

  constructor(usuario: string, nombrePerfil: string, rolSesion: string) {
    this.Usuario = usuario
    this.NombrePerfil = nombrePerfil
    this.RolSesion = rolSesion
  }
}
