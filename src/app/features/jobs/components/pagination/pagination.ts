import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() total = 0;
  @Input() page = 1;
  @Input() itemsPerPage = 20;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  prev() {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  next() {
    if (this.page < this.totalPages) {
      console.log('Next page:', this.page + 1);
      this.pageChange.emit(this.page + 1);
    }
  }

  goTo(page: number) {
    this.pageChange.emit(page);
  }
}
