import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {IEvent} from 'src/app/models/IEvent';
import {ACTIONS} from "../../models/IAction";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: false,
})
export class ConfigComponent {

  protected showEventModal: boolean = false;
  protected selectedEvent: IEvent | undefined = undefined;
  protected events: IEvent[] = [];
  protected fileName!: string;

  constructor(private toastr: ToastrService) {}

  protected openModal(event?: IEvent): void {
    if (event) {
      this.selectedEvent = event;
    }
    this.showEventModal = true
  }

  protected closeModal(): void {
    this.showEventModal = false;
    this.selectedEvent = undefined;
  }

  protected saveEvent(event: IEvent): void {
    const index: number = this.events.findIndex(e => e.id === event.id);

    if (index !== -1) {
      this.events[index] = event;
    } else {
      this.events.push(event);
    }

    this.sortEvents();
    this.toastr.success('Event successfully saved!');
  }

  protected deleteEvent(event: IEvent) {
    this.events = this.events.filter((e: IEvent) => e !== event);
  }

  private sortEvents() {
    this.events.sort((a: IEvent, b: IEvent) => a.threshold - b.threshold);
  }

  protected onFileSelected(event: any) {
    //TODO: Redo file upload
    const file: File = event.target.files[0];
    let data;

    file.text().then((text) => {
      try {
        data = JSON.parse(text);
        if (Array.isArray(data)) {
          for (let event of data) {
            if (!this.isEvent(event)) {
              throw new Error('Not correct json file.');
            }
          }
        }
      } catch (err: any) {
        this.toastr.error("Config file malformed of currupted.", "Unable to load file");
        return;
      }

      this.fileName = file.name;
      this.events = data;
    });
  }

  protected generateConfig() {
    const blob = new Blob([JSON.stringify(this.events)], {
      type: 'text/plain',
    });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private isEvent(obj: any): obj is IEvent {
    return (
      obj !== null &&
      typeof obj === "object" &&
      typeof obj.threshold === "number" &&
      Array.isArray(obj.actions) &&
      obj.actions.every(
        (action: any) =>
          typeof action === "object" &&
          typeof action.action === "string" &&
          Object.keys(ACTIONS).includes(action.action) &&
          typeof action.data === "string"
      )
    );
  }
}
