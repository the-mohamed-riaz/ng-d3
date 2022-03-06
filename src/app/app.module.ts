import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PieComponent } from './pie/pie.component';

@NgModule({
  declarations: [AppComponent, PieComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PieComponent],
})
export class AppModule {}
