import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ModalService } from './service/modal.service';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  declarations: [
    ModalComponent
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule { }