import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/models/Action';
import { EntityType } from 'src/app/models/EntityType';
import { IEvent } from 'src/app/models/IEvent';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: false,
})
export class ConfigComponent implements OnInit {
  events!: IEvent[];
  fileName!: string;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.events = [];
  }

  protected add() {
    const event: IEvent = {
      action: Action.SPAWN_ENTITY,
      data: EntityType.TNT,
      threshold: 0,
    };

    this.events.push(event);
    this.sortEvents();
  }

  protected onFileSelected(event: any) {
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

  protected onDelete(event: IEvent) {
    this.events = this.events.filter((e) => e !== event);
  }

  protected sortEvents() {
    this.events.sort((a, b) => a.threshold - b.threshold);
  }

  private isEvent(obj: any): obj is IEvent {
    return (
      typeof obj.action == 'string' &&
      Object.values(Action).includes(obj.action) &&
      typeof obj.data == 'string' &&
      typeof obj.threshold == 'number'
    );
  }
}
