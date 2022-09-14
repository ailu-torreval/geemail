import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwipeItemComponent } from './swipe-item/swipe-item.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SwipeItemComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    SwipeItemComponent
  ]
})
export class SharedComponentsModule { }
