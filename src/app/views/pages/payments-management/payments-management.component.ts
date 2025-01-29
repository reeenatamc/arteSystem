import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { Sale } from '../../../interfaces/sale';
import { LoadingService } from '../../../services/loading.service';


@Component({
  selector: 'app-payments-management',
  templateUrl: './payments-management.component.html',
  styleUrls: ['./payments-management.component.css']
})
export class PaymentsManagementComponent implements OnInit {
  sales: Sale[] = [];
  isLoading: boolean = false;


  // Variables para la paginación
  currentPage: number = 1;
  salesPerPage: number = 4;

  constructor(private firebaseService: FirebaseService, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.loadSales();
  }

  loadSales(): void {
    this.loadingService.show(); 

    this.firebaseService.getSales().subscribe((sales: Sale[]) => {
      this.sales = sales;
      this.loadingService.hide();

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