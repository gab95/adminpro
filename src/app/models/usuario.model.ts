import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: 'admin_role' | 'user_role',
    public uid?: string
  ) {}

  get imagenURL() {
    if (!this.img) {
      return `${baseUrl}/upload/usuarios/no-image`;
    } else if (this.img.includes('https')) {
      return this.img;
    } else if (this.img) {
      return `${baseUrl}/upload/usuarios/${this.img}`;
    } else {
      return `${baseUrl}/upload/usuarios/no-image`;
    }
  }
}
