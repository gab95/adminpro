import { Component, OnInit, OnDestroy } from '@angular/core';

import { BusquedasService } from '../../../services/busquedas.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Usuario } from '../../../models/usuario.model';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  totalRegistros: number = 0;
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  desde: number = 0;

  cargando: boolean = true;

  imgSubs: Subscription;

  constructor(
    private _usuarioService: UsuarioService,
    private _busquedasService: BusquedasService,
    private _modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(150))
      .subscribe((img) => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ totalRegistros, usuarios }) => {
        this.totalRegistros = totalRegistros;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalRegistros) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.usuarios = this.usuariosTemp);
    }

    this._busquedasService
      .buscar('usuarios', termino)
      .subscribe((resp: any) => {
        this.usuarios = resp;
      });
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this._usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: 'Borrar Usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
    }).then((result) => {
      if (result.value) {
        this._usuarioService.eliminarUsuario(usuario).subscribe(() => {
          Swal.fire(
            'Usuario Eliminado!',
            `${usuario.nombre} eliminado con exito`,
            'success'
          );
          this.cargarUsuarios();
        });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this._usuarioService.guardarRoleUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    this._modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }
}
