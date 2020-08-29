import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

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

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }

  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados;
  }

  busquedaGlobal(termino: string) {
    return this.http.get(`${baseUrl}/todo/${termino}`, this.headers);
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    return this.http
      .get<any[]>(`${baseUrl}/todo/coleccion/${tipo}/${termino}`, this.headers)
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);

            case 'hospitales':
              return this.transformarHospitales(resp.resultados);

            case 'medicos':
              return this.transformarMedicos(resp.resultados);

            default:
              return [];
          }
        })
      );
  }
}
