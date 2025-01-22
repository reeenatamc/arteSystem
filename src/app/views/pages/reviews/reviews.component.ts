import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../model/firebase.service';
import { AuthService } from '../../../model/auth.service';
import { Sale } from '../../../interfaces/sale';
import { Piece } from '../../../interfaces/piece.model';
import { Review } from '../../../interfaces/review.model';
import { User } from '../../../interfaces/user.model';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  saleId: string | null = null;
  currentUser: any;
  sale: Sale | null = null;
  selectedPiece: Piece | null = null;
  review: Review = {
    id: '',
    user: {} as User,
    piece: {} as Piece,
    score: 0,
    description: ''
  };

  // Variables para la paginación
  currentPage: number = 1;
  piecesPerPage: number = 4;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.saleId = params['saleId'];
      if (this.saleId) {
        this.loadSale(this.saleId);
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.review.user = user;
      }
    });
  }

  loadSale(saleId: string): void {
    this.firebaseService.getSaleById(saleId).subscribe((sale: Sale) => {
      this.sale = sale;
    });
  }

  selectPiece(piece: Piece): void {
    this.selectedPiece = piece;
    this.review.piece = piece;
  }

  submitReview(): void {
    this.firebaseService.addReview(this.review).then(() => {
      alert('Reseña enviada con éxito');
      this.selectedPiece = null;
      this.review = {
        id: '',
        user: this.currentUser,
        piece: {} as Piece,
        score: 0,
        description: ''
      };
    });
  }

  // Métodos para la paginación
  get totalPages(): number {
    return Math.ceil((this.sale?.piece?.length || 0) / this.piecesPerPage);
  }

  get paginatedPieces(): Piece[] {
    const start = (this.currentPage - 1) * this.piecesPerPage;
    const end = start + this.piecesPerPage;
    return this.sale?.piece.slice(start, end) || [];
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}