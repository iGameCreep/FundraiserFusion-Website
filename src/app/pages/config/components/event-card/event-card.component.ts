import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {IEvent} from "../../../../models/IEvent";
import {getEventLabel} from "../../../../models/external/streamlabs/StreamLabsEvents";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  standalone: false,
})
export class EventCardComponent implements OnInit {
  @Input() event!: IEvent;
  @Output() onDelete = new EventEmitter<IEvent>();
  @Output() onOpenModal = new EventEmitter<IEvent>();

  protected title!: string;

  constructor(private readonly toastr: ToastrService) {}

  ngOnInit() {
    this.title = getEventLabel(this.event.eventData.eventType, this.event.eventData.eventFor)
  }

  protected openModal() {
    this.onOpenModal.emit(this.event);
  }

  protected removeEvent(): void {
    this.onDelete.emit(this.event);
    this.toastr.success("Removed event", "Success !");
  }
}
