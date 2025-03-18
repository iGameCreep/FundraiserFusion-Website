import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';
import { InputBarComponent } from '../input-bar/input-bar.component';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
  standalone: false,
})
export class InputModalComponent {
  @ViewChild(PopupModalComponent) popupModal!: PopupModalComponent;
  @ViewChild(InputBarComponent) inputBar!: InputBarComponent;
  @Input() channel!: string;
  @Input() placeHolder!: string;
  @Output() keyUp = new EventEmitter<string>();
  @Output() validate = new EventEmitter<EmitterResult>();
  protected value!: string;

  public openModal() {
    this.popupModal.openModal();
  }

  public closeModal() {
    this.popupModal.closeModal();
  }

  protected onKeyUp(value: string) {
    this.keyUp.emit(value);
    this.value = value;
  }

  protected confirmResult() {
    this.closeModal();
    this.validate.emit({ channel: this.channel, value: this.value });
    this.inputBar.onParentClose();
  }
}
