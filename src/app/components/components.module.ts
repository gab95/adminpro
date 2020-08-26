import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonaComponent } from './dona/dona.component';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';

const components = [
  IncrementadorComponent,
  DonaComponent,
  ModalImagenComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, FormsModule, ChartsModule],
})
export class ComponentsModule {}
