import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;

  constructor(private router: Router, private _usuarioService: UsuarioService) {
    //getter
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {}

  logout() {
    this._usuarioService.logout();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return;
    }
    this.router.navigate(['/dashboard/buscar', termino]);
  }
}
