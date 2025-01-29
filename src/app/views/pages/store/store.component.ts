import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../../model/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from '../../../services/cart.service';
import { Router} from '@angular/router';
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


  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private cartService: CartService, private router: Router,private loadingService: LoadingService
    ) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.loadingService.show(); 

    this.route.queryParamMap.subscribe(params => {
      this.type = params.get('type');
      if (this.type) {
        this.pieces$ = this.firebaseService.getPiecesVerifiedByType(this.type);
      } else {
        this.pieces$ = this.firebaseService.getPiecesVerified();
      }
      this.pieces$?.subscribe(() => {
        this.loadingService.hide(); // Oculta el loader cuando los datos están listos
      });
  
      this.applyFilters();

    });
  }

  applyFilters(): void {
    this.filteredPieces$ = this.pieces$?.pipe(
      map(pieces => pieces.filter(piece => 
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