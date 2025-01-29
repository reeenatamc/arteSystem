import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Piece } from '../../../interfaces/piece.model';
import { Review } from '../../../interfaces/review.model';
import { FirebaseService } from '../../../model/firebase.service';
import { AuthService } from '../../../model/auth.service';
import { User } from '../../../interfaces/user.model';
import { CartService } from '../../../services/cart.service';
import { Router} from '@angular/router';
import { LoadingService } from '../../../services/loading.service';



@Component({
  selector: 'app-piece-info',
  templateUrl: './piece-info.component.html',
  styleUrls: ['./piece-info.component.css']
})

export class PieceInfoComponent implements OnInit {
  pieceId: string | null = null;
  piece$: Observable<Piece[]> | null = null;
  reviews$: Observable<Review[]> | null = null;
  currentUser: User | null = null;
  isLoading: boolean = false;
  visibleReviews = 6;
  isExpanded = false;


  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirebaseService,
    private authService: AuthService,
    private cartService: CartService, 
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadingService.show();

    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.pieceId = params['id'];
      if (this.pieceId) {
        this.piece$ = this.firestoreService.getPiecesById(this.pieceId);
        this.reviews$ = this.firestoreService.getReviewsByPieceId(this.pieceId);
        
        // Oculta el spinner después de cargar los datos
        this.piece$.subscribe(() => {
          this.loadingService.hide();
        });
        
        this.reviews$.subscribe(() => {
          this.loadingService.hide();
        });
      }
    });

    // Suscribirse al usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // onCardClick(pieceId: string): void {
  //   this.router.navigate(['/pieceInfo'], { queryParams: { id: pieceId } });
  // }

  onCardClick(pieceId: string, piece: any): void {
    this.cartService.addToCart(piece);
    alert('Obra agregada al carrito!');
    this.router.navigate(['/cart'], { queryParams: { id: pieceId } });
    
  }

  showMoreReviews() {
    if (this.reviews$) {
      this.reviews$.subscribe(reviews => {
        const totalReviews = reviews.length;

        if (this.visibleReviews < totalReviews) {
          this.visibleReviews += 6; // Aumenta en 6 cada vez que se hace clic en "Ver más"
        } else {
          this.visibleReviews = 6; // Si ya se mostraron todas, se restablece a 6
        }
      });

      // Alterna el estado de isExpanded
      this.isExpanded = !this.isExpanded;
    }
  }
  
}
