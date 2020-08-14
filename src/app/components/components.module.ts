import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonaComponent } from './dona/dona.component';

const components = [IncrementadorComponent, DonaComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, FormsModule, ChartsModule],
})
export class ComponentsModule {}
