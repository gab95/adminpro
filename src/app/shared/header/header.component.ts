import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;

  constructor(private _usuarioService: UsuarioService) {
    //getter
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {}

  logout() {
    this._usuarioService.logout();
  }
}
