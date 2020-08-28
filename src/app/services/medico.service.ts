import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Medico } from '../models/medico.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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

  cargarMedicos() {
    return this.http
      .get(`${baseUrl}/medicos`, this.headers)
      .pipe(map((resp: { ok: boolean; medicos: Medico[] }) => resp.medicos));
  }

  obtenerMedicoPorId(id: string) {
    return this.http
      .get(`${baseUrl}/medicos/${id}`, this.headers)
      .pipe(map((resp: { ok: boolean; medico: Medico }) => resp.medico));
  }

  crearMedico(medico: { nombre: string; hospital: string }) {
    return this.http.post(`${baseUrl}/medicos`, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {
    return this.http.put(
      `${baseUrl}/medicos/${medico._id}`,
      medico,
      this.headers
    );
  }

  borrarMedico(_id: string) {
    return this.http.delete(`${baseUrl}/medicos/${_id}`, this.headers);
  }
}
