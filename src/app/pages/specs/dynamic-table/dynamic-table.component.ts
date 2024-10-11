import {trigger, state, style, transition, animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  ColumnConfig,
  TableData,
} from '../../../models/specializations-table.interface';

@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  imports: [CommonModule],
  standalone: true,
  animations: [
    trigger('fadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: 0}), animate('300ms ease-in')]),
      transition(':leave', [animate('300ms ease-out', style({opacity: 0}))]),
    ]),
  ],
})
export class DynamicTableComponent implements OnChanges {
  @Input() tableData: TableData | null = null;
  @Input() animate = false;
  @Input() highlightComplete: boolean = false;

  displayedColumns: ColumnConfig[] = [];
  animationState = 'in';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData'] && this.tableData) {
      if (this.animate) {
        this.animationState = 'void';
        setTimeout(() => {
          this.animationState = 'in';
        }, 0);
      }
      this.displayedColumns = this.tableData.columns;
    }
  }

  resetAnimationState() {
    this.animationState = 'in';
  }

  isImageColumn(key: string): boolean {
    return key === 'icon_url';
  }

  shouldHighlight(row: any): boolean {
    return this.highlightComplete && row.isComplete === true;
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (this.tableData) {
      this.tableData.rows.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '⇵';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}
