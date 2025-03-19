import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {IEvent} from "../../../../models/IEvent";
import {ACTIONS, EAction, IAction} from "../../../../models/IAction";

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss',
  standalone: false,
})
export class EventModalComponent implements OnInit {
  @Input() event!: IEvent | undefined;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<IEvent> = new EventEmitter();

  protected name!: string;
  protected eventForm!: FormGroup;

  constructor(private readonly fb: FormBuilder,
              private readonly toastr: ToastrService) {}

  ngOnInit(): void {
    this.name = `Event - ${this.event?.threshold ?? 0}$`;

    this.eventForm = this.fb.group({
      threshold: [this.event?.threshold ?? 0, [Validators.required, Validators.min(0)]],
      actions: this.fb.array([]),
    });

    if (this.event?.actions?.length) {
      this.event.actions.forEach((action, i) => {
        const formGroup = this.createAction(action);
        this.actions.push(formGroup);
      });

      this.event.actions.forEach((_, i) => this.updateChoices(i));
    } else {
      this.actions.push(this.createAction());
    }

    this.updateName();
  }

  protected updateName(): void {
    const thresholdControl = this.eventForm.get('threshold');
    thresholdControl?.valueChanges.subscribe((newAmount: number) => {
      this.name = `Event - ${newAmount ?? 0}$`;
    });
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

  get actions(): FormArray {
    return this.eventForm.get('actions') as FormArray;
  }

  private createAction(action?: IAction): FormGroup {
    const selectedAction = action?.action ?? "SPAWN_ENTITY";
    return this.fb.group({
      action: [selectedAction, Validators.required],
      data: [action?.data ?? '', Validators.required],
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

    const { threshold, actions } = this.eventForm.value;
    const newEvent: IEvent = {
      id: this.event?.id ??  crypto.randomUUID(),
      threshold,
      actions
    };

    this.onSubmit.emit(newEvent);
    this.onClose.emit();
  }

  protected getAllActions(): string[] {
    return Object.keys(ACTIONS);
  }

  protected getAction(key: string) {
    return ACTIONS[key as EAction];
  }
}
