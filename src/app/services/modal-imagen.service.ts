import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _ocultarModal: boolean = true;

  tipo: 'usuarios' | 'medicos' | 'hospitales';
  id: string;
  img: string;

  nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${baseUrl}/upload/${tipo}/${img}`;
    }
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() {}
}
