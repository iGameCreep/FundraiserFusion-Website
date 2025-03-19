import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";

import {provideHttpClient} from "@angular/common/http";
import {provideToastr, ToastrModule} from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LandingComponent} from './pages/landing/landing.component';
import {AuthComponent} from './pages/auth/auth.component';
import {ConfigComponent} from './pages/config/config.component';
import {SearchModalComponent} from './components/search-modal/search-modal.component';
import {PopupModalComponent} from './components/popup-modal/popup-modal.component';
import {InputModalComponent} from './components/input-modal/input-modal.component';
import {InputBarComponent} from './components/input-bar/input-bar.component';
import {ModalComponent} from "./components/modal/modal.component";
import {EventModalComponent} from "./pages/config/components/event-modal/event-modal.component";
import {EventCardComponent} from "./pages/config/components/event-card/event-card.component";

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    AuthComponent,
    ConfigComponent,
    SearchModalComponent,
    PopupModalComponent,
    InputModalComponent,
    InputBarComponent,
    ModalComponent,
    EventModalComponent,
    EventCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
