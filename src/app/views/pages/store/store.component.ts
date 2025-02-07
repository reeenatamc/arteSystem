import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../../model/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { Piece } from '../../../interfaces/piece.model';
import { LoadingService } from '../../../services/loading.service';




@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  pieces$: Observable<any[]> | undefined;
  filteredPieces$: Observable<any[]> | undefined;
  type: string | null = null;
  subcategory: string = '';
  searchQuery: string = '';
  isLoading: boolean = false;


  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private cartService: CartService, private router: Router, private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.loadingService.show();

    // Se suscribe a los cambios en los parámetros de la URL (query params)
    this.route.queryParamMap.subscribe(params => {
      // Obtiene el valor del parámetro 'type' de la URL
      this.type = params.get('type');

      // Si el parámetro 'type' está presente en la URL:
      if (this.type) {
        // Llama al servicio para obtener las piezas verificadas de ese tipo específico
        this.pieces$ = this.firebaseService.getPiecesVerifiedByType(this.type);
      } else {
        // Si no hay parámetro 'type', llama al servicio para obtener todas las piezas verificadas
        this.pieces$ = this.firebaseService.getPiecesVerified();
      }

      // Una vez que las piezas se han cargado, se suscribe al observable 'pieces$'
      this.pieces$?.subscribe(() => {
        // Oculta el loader (ícono de carga) una vez que los datos están disponibles
        this.loadingService.hide();
      });

      // Aplica los filtros a las piezas cargadas (esto probablemente filtrará los datos de alguna forma)
      this.applyFilters();
    });
  }


  applyFilters(): void {
    this.filteredPieces$ = this.pieces$?.pipe(
      map(pieces => pieces.filter(piece =>
        //condición ? valorSiVerdadero : valorSiFalso
        // compara la subcategoria del menu con la de la pieza
        (this.subcategory ? piece.subcategory === this.subcategory : true) &&
        (this.searchQuery ? piece.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
      ))

    );
  }

  addToCart(piece: any) {
    this.cartService.addToCart(piece);
    alert('Obra agregada al carrito!');
  }

  onCardClick(pieceId: string): void {
    this.router.navigate(['/pieceInfo'], { queryParams: { id: pieceId } });
  }
}