import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    };
  }

  cargarHospitales() {
    return this.http
      .get(`${baseUrl}/hospitales`, this.headers)
      .pipe(
        map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales)
      );
  }

  crearHospital(nombre: string) {
    return this.http.post(`${baseUrl}/hospitales`, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    return this.http.put(
      `${baseUrl}/hospitales/${_id}`,
      { nombre },
      this.headers
    );
  }

  borrarHospital(_id: string) {
    return this.http.delete(`${baseUrl}/hospitales/${_id}`, this.headers);
  }
}
