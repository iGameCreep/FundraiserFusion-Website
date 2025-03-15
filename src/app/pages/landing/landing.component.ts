import {Component} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  protected api_url: string = environment.api_url;
}
