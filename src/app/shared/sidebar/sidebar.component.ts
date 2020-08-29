import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;

  constructor(
    public _sidebarService: SidebarService,
    private _usuarioService: UsuarioService
  ) {
    //getter
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {}

  logout() {
    this._usuarioService.logout();
  }
}
