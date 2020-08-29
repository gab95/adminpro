import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private _usuarioService: UsuarioService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this._usuarioService.role === 'admin_role') {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
