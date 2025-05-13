import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface ModalButton {
  id: string;
  icon: string;
  class?: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  standalone: false,
})
export class ModalComponent {
  @Input() title!: string;
  @Input() buttons: ModalButton[] = [];
  @Output() onClose: EventEmitter<Event> = new EventEmitter();
  @Output() onButtonClick: EventEmitter<ModalButton> = new EventEmitter();

  protected closeModal(event: Event): void {
    event.stopPropagation();
    this.onClose.emit(event);
  }

  protected handleButtonClick(event: Event, button: ModalButton): void {
    event.stopPropagation();
    this.onButtonClick.emit(button);
  }
}
