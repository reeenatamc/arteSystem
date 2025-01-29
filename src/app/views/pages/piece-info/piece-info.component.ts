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

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirebaseService,
    private authService: AuthService,
    private cartService: CartService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.pieceId = params['id'];
      if (this.pieceId) {
        this.piece$ = this.firestoreService.getPiecesById(this.pieceId);
        this.reviews$ = this.firestoreService.getReviewsByPieceId(this.pieceId);
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
}
