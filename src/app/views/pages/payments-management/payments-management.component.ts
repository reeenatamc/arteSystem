import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { Sale } from '../../../interfaces/sale';

@Component({
  selector: 'app-payments-management',
  templateUrl: './payments-management.component.html',
  styleUrls: ['./payments-management.component.css']
})
export class PaymentsManagementComponent implements OnInit {
  sales: Sale[] = [];

  // Variables para la paginación
  currentPage: number = 1;
  salesPerPage: number = 4;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.firebaseService.getSales().subscribe((sales: Sale[]) => {
      this.sales = sales;
    });
  }

  updateSaleStatus(saleId: string, status: boolean): void {
    if (status) {
      this.firebaseService.updateSaleStatus(saleId, status).then(() => {
        this.loadSales();
      });
    } else {
      this.firebaseService.deleteSale(saleId).then(() => {
        this.loadSales();
      });
    }
  }

  // Métodos para la paginación
  get totalPages(): number {
    return Math.ceil(this.sales.length / this.salesPerPage);
  }

  get paginatedSales(): Sale[] {
    const start = (this.currentPage - 1) * this.salesPerPage;
    const end = start + this.salesPerPage;
    return this.sales.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}