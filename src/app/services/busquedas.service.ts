import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  usuario: Usuario;

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    };
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      (user) =>
        new Usuario(
          user.nombre,
          user.email,
          '',
          user.img,
          user.google,
          user.role,
          user.uid
        )
    );
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    return this.http
      .get<any[]>(`${baseUrl}/todo/coleccion/${tipo}/${termino}`, this.headers)
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);
              break;

            case 'hospitales':
              break;

            case 'medicos':
              break;

            default:
              break;
          }
        })
      );
  }
}
