import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-bar',
  templateUrl: './input-bar.component.html',
  styleUrls: ['./input-bar.component.scss'],
  standalone: false,
})
export class InputBarComponent {
  @Output() keyUp = new EventEmitter<string>();
  @Input() placeholder: string = "Search...";
  protected search!: string;

  protected onKeyUp() {
    this.keyUp.emit(this.search);
  }

  public onParentClose() {
    this.search = '';
  }
}
