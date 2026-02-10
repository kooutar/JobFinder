import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../components/navbar/navbar';
import { Footer } from '../components/footer/footer';



@NgModule({
 
  imports: [
    CommonModule, Navbar, Footer
  ],
  exports: [CommonModule, Navbar, Footer]
})
export class SharedModule { }
