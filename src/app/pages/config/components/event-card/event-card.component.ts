import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {IEvent} from "../../../../models/IEvent";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  standalone: false,
})
export class EventCardComponent {
  @Input() event!: IEvent;
  @Output() onDelete = new EventEmitter<IEvent>();
  @Output() onOpenModal = new EventEmitter<IEvent>();

  constructor(private readonly toastr: ToastrService) {}

  protected openModal() {
    this.onOpenModal.emit(this.event);
  }

  protected removeEvent(): void {
    this.onDelete.emit(this.event);
    this.toastr.success("Removed event", "Success !");
  }
}
