import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import csvtojson from 'csvtojson';
import {
  SpecializationsTable,
  SpecializationsTableParsed,
  SpecializationsTableTrimmed,
} from '../../models/specializations-table.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'specializations',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './specs.component.html',
  styleUrl: './specs.component.scss',
})
export class SpecsComponent implements OnInit {
  private subscriptions = new Subscription();
  data: SpecializationsTable[] = [];
  url =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRqSMjLk44rRJyZrSS1QAgaLw_S-QsJvqI8t33bt4yqltI4ZH2JD85djtBjrMAZtdGkMTA8RsqUxh2e/pub?output=csv';

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    const response = this.http.get(this.url, {responseType: 'text'});

    const sub = response.subscribe(async x => {
      this.data = await csvtojson().fromString(x);
      const tableData = this.parseDataForTables(this.data);
      console.log(tableData);
    });
    this.subscriptions.add(sub);
  }

  parseDataForTables(data: SpecializationsTable[]): SpecializationsTableParsed {
    const result: {
      [key: string]: {[key: string]: SpecializationsTableTrimmed[]};
    } = {};

    data.forEach(item => {
      if (item.players?.length) {
        item.players = (item.players as string).split(', ');
      } else {
        item.players = '';
      }

      if (!result[item.spec_type]) {
        result[item.spec_type] = {};
      }
      if (!result[item.spec_type][item.spec_target]) {
        result[item.spec_type][item.spec_target] = [];
      }
      const {spec_type, spec_target, ...rest} = item;
      result[item.spec_type][item.spec_target].push(
        rest as SpecializationsTableTrimmed
      );
    });

    return result;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
