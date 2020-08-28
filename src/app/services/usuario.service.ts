import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/registerForm.interface';
import { LoginForm } from '../interfaces/loginForm.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

const baseUrl = environment.baseUrl;
declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  auth2: any;

  usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

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

  googleInit() {
    return new Promise((resolve) => {
      console.log('google init');
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id:
            '289092067510-1ro086em3qgo4s68ebp77220bn6kjar5.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${baseUrl}/auth/renew`, this.headers).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

        localStorage.setItem('token', resp.token);

        return true;
      }),
      catchError((error) => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${baseUrl}/usuarios`, formData);
  }

  login(formData: LoginForm) {
    return this.http.post(`${baseUrl}/auth/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token) {
    return this.http.post(`${baseUrl}/auth/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(['/login']);
      });
    });
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = { ...data, role: this.usuario.role };
    return this.http.put(`${baseUrl}/usuarios/${this.uid}`, data, this.headers);
  }

  cargarUsuarios(desde: number = 0) {
    return this.http
      .get<CargarUsuario>(`${baseUrl}/usuarios?desde=${desde}`, this.headers)
      .pipe(
        map((resp) => {
          const usuarios = resp.usuarios.map(
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

          return {
            usuarios,
            totalRegistros: resp.totalRegistros,
          };
        })
      );
  }

  guardarRoleUsuario(usuario: Usuario) {
    return this.http.put(
      `${baseUrl}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }

  eliminarUsuario(usuario: Usuario) {
    return this.http.delete(`${baseUrl}/usuarios/${usuario.uid}`, this.headers);
  }
}
