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
  displayedColumns: ColumnConfig[] = [];
  animationState = 'in';

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
}
