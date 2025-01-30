import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { AuthService } from '../../../model/auth.service';
import { Sale } from '../../../interfaces/sale';
import { Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';


@Component({
  selector: 'app-mis-pedidospage',
  templateUrl: './mis-pedidospage.component.html',
  styleUrls: ['./mis-pedidospage.component.css']
})
export class MisPedidospageComponent implements OnInit {
  sales: Sale[] = [];
  filteredSales: Sale[] = []; // Lista filtrada de pedidos
  currentUser: any;
  isLoading: boolean = false;
  searchQuery: string = ''; // 🔹 Variable de búsqueda

  // Variables para la paginación
  currentPage: number = 1;
  salesPerPage: number = 4;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        console.log(user.id);
        this.loadSales(user.id);
      }
    });
  }

  loadSales(clientId: string): void {
    this.loadingService.show();

    this.firebaseService.getSalesByClient(clientId).subscribe((sales: Sale[]) => {
      this.sales = sales;
      this.filteredSales = sales; // Inicialmente, todas las ventas
      this.loadingService.hide();
    });
  }

  // 🔹 Filtrar ventas por ID del pedido
  applyFilters(): void {
    this.filteredSales = this.sales.filter(sale =>
      sale.id.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1; // Reiniciar a la primera página después del filtrado
  }

  navigateToReviews(saleId: string): void {
    this.router.navigate(['/reviews'], { queryParams: { saleId } });
  }

  // Métodos para la paginación
  get totalPages(): number {
    return Math.ceil(this.filteredSales.length / this.salesPerPage);
  }

  get paginatedSales(): Sale[] {
    const start = (this.currentPage - 1) * this.salesPerPage;
    const end = start + this.salesPerPage;
    return this.filteredSales.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}