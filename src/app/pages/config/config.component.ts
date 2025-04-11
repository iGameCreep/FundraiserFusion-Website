import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {IEvent} from 'src/app/models/IEvent';
import {ACTIONS} from "../../models/IAction";
import {FILE_VERSION, IConfigFile} from "../../models/external/plugin/IConfigFile";
import {EStreamLabsEventFor, EStreamLabsEventType} from "../../models/external/streamlabs/StreamLabsEvents";

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

  constructor(private readonly toastr: ToastrService) {}

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

  protected deleteEvent(event: IEvent): void {
    this.events = this.events.filter((e: IEvent) => e !== event);
  }

  private sortEvents(): void {
    this.events.sort((a: IEvent, b: IEvent) => (a.threshold ?? 0) - (b.threshold ?? 0));
  }

  protected async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (!file) return;

    try {
      const text: string = await file.text();
      let data: IConfigFile = JSON.parse(text);
      const events: IEvent[] = data.events;
      if (events && Array.isArray(event)) {
        for (let event of events) {
          if (!this.isEvent(event)) {
            this.showFileError();
          }
        }
      }

      this.fileName = file.name;
      this.events = events;
    } catch (err: any) {
      this.showFileError();
      console.error(err);
      return;
    }
  }

  private showFileError(): void {
    this.toastr.error("Config file malformed of currupted.", "Unable to load file");
  }

  protected generateConfig(): void {
    const configFile: IConfigFile = {
      fileVersion: FILE_VERSION,
      events: this.events,
    }
    const blob = new Blob([JSON.stringify(configFile)], {
      type: 'text/plain',
    });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
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
      typeof obj.id === "string" &&
      typeof obj.eventType === "object" &&
      typeof obj.eventType.eventType === "string" &&
      Object.values(EStreamLabsEventType).includes(obj.eventType.eventType) &&
      typeof obj.eventType.eventFor === "string" &&
      Object.values(EStreamLabsEventFor).includes(obj.eventType.eventFor) &&
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
