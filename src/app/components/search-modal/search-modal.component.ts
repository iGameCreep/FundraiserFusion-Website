import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { InputModalComponent } from '../input-modal/input-modal.component';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
  standalone: false,
})
export class SearchModalComponent {
  @ViewChild(InputModalComponent) inputModal!: InputModalComponent;
  @Output() resultChosen = new EventEmitter<EmitterResult>();
  @Input() channel!: string;
  protected results!: ResultsEnum;
  protected allResults!: string[];
  protected searchResult!: string[];
  protected selectedResult!: string;
  private search: string = '';

  public openModal(results: ResultsEnum) {
    this.results = results;
    this.loadResults();
    this.filter(this.search);
    this.inputModal.openModal();
  }

  private loadResults() {
    this.allResults = Object.keys(this.results).filter((item) => {
      return isNaN(Number(item));
    });
  }

  protected onKeyUp(search: string) {
    this.search = search;
    this.filter(search);
  }

  protected filter(search: string) {
    this.searchResult = this.allResults.filter((it) => {
      return it.toLocaleLowerCase().includes(search.toLocaleLowerCase());
    });
  }

  protected onValidate() {
    this.resultChosen.emit({
      channel: this.channel,
      value: this.selectedResult,
    });
    this.search = '';
  }

  protected choose(newResult: string) {
    this.selectedResult = newResult;
  }
}
