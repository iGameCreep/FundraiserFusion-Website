import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {IEvent} from "../../../../models/IEvent";
import {ACTIONS, EAction, IAction} from "../../../../models/IAction";
import {
  EStreamLabsEventFor,
  EStreamLabsEventType,
  getEventLabel,
  streamlabs_events,
  StreamLabsEvent
} from "../../../../models/external/streamlabs/StreamLabsEvents";
import { Subject, takeUntil } from "rxjs";

type EventOption = {
  value: string,
  label: string
}

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss',
  standalone: false,
})
export class EventModalComponent implements OnInit, OnDestroy {
  @Input() event!: IEvent | undefined;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<IEvent> = new EventEmitter();

  private destroyed$: Subject<void> = new Subject<void>();

  private readonly SEPARATOR: string = ':';

  protected name!: string;
  protected isDonation: boolean = false;
  protected eventForm!: FormGroup;
  protected eventsOptions!: EventOption[];

  protected givenEventType!: EStreamLabsEventType;
  protected givenEventFor!: EStreamLabsEventFor;

  constructor(private readonly fb: FormBuilder,
              private readonly toastr: ToastrService) { }

  public ngOnInit(): void {
    this.givenEventType = this.event?.eventData?.eventType ?? EStreamLabsEventType.FOLLOW;
    this.givenEventFor = this.event?.eventData?.eventFor ?? EStreamLabsEventFor.TWITCH_ACCOUNT;

    this.eventsOptions = streamlabs_events.map(event => ({
      value: event.eventType + this.SEPARATOR + event.eventFor,
      label: event.event
    }));

    this.name = getEventLabel(this.givenEventType, this.givenEventFor);

    this.eventForm = this.fb.group({
      donationThreshold: [this.event?.donationThreshold ?? null, [Validators.min(0)]],
      eventData: [
        this.givenEventType + this.SEPARATOR + this.givenEventFor,
        Validators.required
      ],
      actions: this.fb.array([]),
    });

    if (this.event?.actions?.length) {
      this.event.actions.forEach((action: IAction) => {
        const formGroup = this.createAction(action);
        this.actions.push(formGroup);
      });

      this.event.actions.forEach((_, i) => this.updateChoices(i));
    } else {
      this.actions.push(this.createAction());
    }

    this.eventForm.get('eventData')?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((newData: string) => this.handleEventChange(newData));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private handleEventChange(newData: string): void {
    const data = this.getDataFromEventString(newData);
    this.name = getEventLabel(data.eventType, data.eventFor);
    this.isDonation = (data.eventType === EStreamLabsEventType.DONATION);
  }

  protected updateChoices(index: number): void {
    const actionControl = this.actions.at(index).get('action');
    actionControl?.valueChanges.subscribe((newAction: EAction) => {
      this.actions.at(index).patchValue({
        allValues: ACTIONS[newAction].choices,
        data: '',
      });
    });
  }

  get eventType(): FormGroup {
    return this.eventForm.get('eventData') as FormGroup;
  }

  get actions(): FormArray {
    return this.eventForm.get('actions') as FormArray;
  }

  private createAction(action?: IAction): FormGroup {
    const selectedAction: EAction = action?.action ?? EAction.COMMAND_EXEC;
    let parsedData: string;

    try {
      const rawData: string = action?.data ?? '';
      const json = JSON.parse(rawData);
      parsedData = json.command || '';
    } catch {
      parsedData = action?.data ?? '';
    }

    return this.fb.group({
      action: [selectedAction, Validators.required],
      data: [parsedData, Validators.required],
      allValues: [ACTIONS[selectedAction].choices],
    });
  }

  protected addAction(): void {
    this.actions.push(this.createAction());
  }

  protected removeAction(index: number): void {
    if (this.actions.length > 1) {
      this.actions.removeAt(index);
    }
  }

  protected submitForm(event?: Event): void {
    event?.preventDefault();

    if (this.eventForm.invalid || this.actions.length < 1) {
      this.toastr.error("Form is invalid or no actions present");
      return;
    }

    const { donationThreshold, eventData, actions } = this.eventForm.value;
    const newEvent: IEvent = {
      id: this.event?.id ??  crypto.randomUUID(),
      donationThreshold,
      eventData: this.getDataFromEventString(eventData),
      actions: actions.map((a: IAction) => {
        return {
          action: a.action,
          data: this.getActionDataFromValue(a.action, a.data),
        }
      })
    };

    this.onSubmit.emit(newEvent);
    this.onClose.emit();
  }

  private getActionDataFromValue(action: EAction, value: string): string {
    if (action == EAction.COMMAND_EXEC) {
      return JSON.stringify({ command: value });
    }
    return JSON.stringify({});
  }

  private getDataFromEventString(eventString: string): StreamLabsEvent {
    try {
      const parts: string[] = eventString.split(this.SEPARATOR);

      return {
        eventType: parts[0] as EStreamLabsEventType,
        eventFor: parts[1] as EStreamLabsEventFor,
      };
    } catch (err) {
      this.toastr.error(`Unable to find event: ${err}`);
      console.error(err);
      return {
        eventType: EStreamLabsEventType.FOLLOW,
        eventFor: EStreamLabsEventFor.TWITCH_ACCOUNT,
      }
    }
  }

  protected getAllActions(): string[] {
    return Object.keys(ACTIONS);
  }

  protected getAction(key: string) {
    return ACTIONS[key as EAction];
  }
}
