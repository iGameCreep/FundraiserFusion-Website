import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InputModalComponent } from 'src/app/components/input-modal/input-modal.component';
import { SearchModalComponent } from 'src/app/components/search-modal/search-modal.component';
import { Action } from 'src/app/models/Action';
import { EntityType } from 'src/app/models/EntityType';
import { IEvent } from 'src/app/models/IEvent';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  standalone: false,
})
export class EventComponent {
  @ViewChild(InputModalComponent) inputModal!: InputModalComponent;
  @ViewChild(SearchModalComponent) searchModal!: SearchModalComponent;
  @Input() event!: IEvent;
  @Output() delete = new EventEmitter<IEvent>();
  @Output() sort = new EventEmitter<any>();
  protected channel!: ResultType;

  constructor(private toastr: ToastrService) {}

  openModal(type: ResultType) {
    this.channel = type;

    if (type === 'threshold') {
      this.inputModal.openModal();
      return;
    }

    let results!: { [key: string]: string };
    switch (type) {
      case 'action':
        results = Action;
        break;
      case 'data':
        results = EntityType;
        break;
    }

    this.searchModal.openModal(results);
  }

  resultChosen(result: EmitterResult): void {
    let message;
    switch(result.channel) {
      case 'action':
        this.event.action = Action[result.value as keyof typeof Action]
        message = `Set action to ${this.event.action}`;
        break;
      case 'data':
        this.event.data = result.value;
        message = `Set data to ${this.event.data}`;
        break;
      case 'threshold': {
        const value = parseInt(result.value);
        if (isNaN(value)) {
          this.toastr.error(`Can't cast value "${value}" to a number.`);
          return;
        }

        if (value < 0) {
          this.toastr.error(`Threshold must be over 0 !`);
          return;
        }

        this.event.threshold = value;
        message = `Set threshold to ${value}`;
        this.sort.emit();
        break;
      }
    }

    this.toastr.success(
      message,
      'Success !'
    );
  }

  protected removeEvent(): void {
    this.delete.emit(this.event);
    this.toastr.success("Removed event", "Success !");
  }
}

type ResultType = 'action' | 'data' | 'threshold';
