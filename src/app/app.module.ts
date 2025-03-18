import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";

import {provideHttpClient} from "@angular/common/http";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LandingComponent} from './pages/landing/landing.component';
import {AuthComponent} from './pages/auth/auth.component';
import {ConfigComponent} from './pages/config/config.component';
import {EventComponent} from './pages/config/event/event.component';
import {SearchModalComponent} from './components/search-modal/search-modal.component';
import {PopupModalComponent} from './components/popup-modal/popup-modal.component';
import {InputModalComponent} from './components/input-modal/input-modal.component';
import {InputBarComponent} from './components/input-bar/input-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    AuthComponent,
    ConfigComponent,
    EventComponent,
    SearchModalComponent,
    PopupModalComponent,
    InputModalComponent,
    InputBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
