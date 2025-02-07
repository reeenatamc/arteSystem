import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../model/firebase.service';
import { AuthService } from '../../../model/auth.service';
import { Review } from '../../../interfaces/review.model';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-viewreviews',
  templateUrl: './viewreviews.component.html',
  styleUrls: ['./viewreviews.component.css']
})
export class ViewreviewsComponent implements OnInit {
  currentUser: any;
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  selectedReview: Review | null = null;
  isLoading: boolean = false;
  searchQuery: string = '';

  // Variables para la paginación
  currentPage: number = 1;
  reviewsPerPage: number = 8;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadReviews();
  }

  loadReviews(): void {
    this.loadingService.show();

    this.firebaseService.getReviews().subscribe((reviews: Review[]) => {
      this.reviews = reviews;
      this.filteredReviews = reviews; // Inicialmente, las reseñas filtradas son todas
      this.loadingService.hide();
    });
  }

  applyFilters(): void {
    this.filteredReviews = this.reviews.filter(review =>
      review.piece.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1; // Reiniciar a la primera página después del filtrado
  }

  editReview(review: Review): void {
    this.selectedReview = { ...review };
  }

  saveReview(): void {
    if (this.selectedReview) {
      this.firebaseService.updateReview(this.selectedReview).then(() => {
        this.selectedReview = null;
        this.loadReviews();
      });
    }
  }

  cancelEdit(): void {
    this.selectedReview = null;
  }

  deleteReview(reviewId: string): void {
    this.firebaseService.deleteReview(reviewId).then(() => {
      this.loadReviews();
    });
  }

  // toggleFullDescription(review: Review | null): void {
  //   this.selectedReview = review;
  // }

  

  // Métodos para la paginación
  get totalPages(): number {
    return Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
  }

  get paginatedReviews(): Review[] {
    const start = (this.currentPage - 1) * this.reviewsPerPage;
    const end = start + this.reviewsPerPage;
    return this.filteredReviews.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
