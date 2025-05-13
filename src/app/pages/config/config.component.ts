import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from 'ngx-toastr';
import {IEvent} from 'src/app/models/IEvent';
import {EAction} from "../../models/IAction";
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
  protected configFile!: IConfigFile;
  protected fileName!: string;

  protected configForm!: FormGroup;

  constructor(private readonly fb: FormBuilder,
              private readonly toastr: ToastrService) {
    this.configFile = {
      fileVersion: FILE_VERSION,
      settings: {
        cumulateDonationEvents: false
      },
      events: []
    }

    this.configForm =  this.fb.group({
      cumulateDonationEvents: [this.configFile.settings.cumulateDonationEvents, Validators.required]
    });

    this.subscribeForm();
  }

  private subscribeForm(): void {
    this.configForm.valueChanges.subscribe(formValue => {
      this.configFile.settings = {
        ...this.configFile.settings,
        ...formValue
      };
    });
  }

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
    const index: number = this.configFile.events.findIndex(e => e.id === event.id);

    if (index !== -1) {
      this.configFile.events[index] = event;
    } else {
      this.configFile.events.push(event);
    }

    this.sortEvents();
    this.toastr.success('Event successfully saved!');
  }

  protected deleteEvent(event: IEvent): void {
    this.configFile.events = this.configFile.events.filter((e: IEvent) => e !== event);
  }

  private sortEvents(): void {
    this.configFile.events.sort((a: IEvent, b: IEvent) => {
      // First, compare by eventType alphabetically
      if (a.eventData.eventType !== b.eventData.eventType) {
        return a.eventData.eventType.localeCompare(b.eventData.eventType);
      }

      // If eventType is the same, sort by donationThreshold
      const aThreshold = a.donationThreshold;
      const bThreshold = b.donationThreshold;

      if (aThreshold !== null && bThreshold !== null) {
        return aThreshold - bThreshold; // ascending
      } else if (aThreshold === null && bThreshold !== null) {
        return 1; // nulls go after numbers
      } else if (aThreshold !== null && bThreshold === null) {
        return -1; // non-nulls come first
      } else {
        return 0; // both are null
      }
    });

  }

  protected async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (!file) return;

    try {
      const text: string = await file.text();
      let data: IConfigFile = JSON.parse(text);

      if (data && !this.isConfigFileCorrect(data)) {
        this.showFileError();
        return;
      }

      if (data.fileVersion < FILE_VERSION) {
        //TODO: Handle migrations for old file versions;
        return;
      }

      this.fileName = file.name;
      this.configFile = data;
    } catch (err: any) {
      this.showFileError();
      console.error(err);
      return;
    }
  }

  private showFileError(): void {
    this.toastr.error("Config file malformed of corrupted.", "Unable to load file");
  }

  protected generateConfig(): void {
    const blob = new Blob([JSON.stringify(this.configFile)], {
      type: 'text/plain',
    });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private isConfigFileCorrect(obj: any): obj is IConfigFile {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      typeof obj.fileVersion === 'number' &&
      typeof obj.settings.cumulateDonationEvents === 'boolean' &&
      Array.isArray(obj.events) &&
      obj.events.every((event: any) => this.isEvent(event))
    )
  }

  private isEvent(obj: any): obj is IEvent {
    return (
      obj !== null &&
      typeof obj === "object" &&
      typeof obj.id === "string" &&
      (typeof obj.donationThreshold === "number" || obj.donationThreshold === null) &&
      typeof obj.eventData === "object" &&
      typeof obj.eventData.eventType === "string" &&
      Object.values(EStreamLabsEventType).includes(obj.eventData.eventType) &&
      typeof obj.eventData.eventFor === "string" &&
      Object.values(EStreamLabsEventFor).includes(obj.eventData.eventFor) &&
      Array.isArray(obj.actions) &&
      obj.actions.every(
        (action: any) =>
          typeof action === "object" &&
          typeof action.action === "string" &&
          Object.values(EAction).includes(action.action) &&
          typeof action.data === "string"
      )
    );
  }
}
