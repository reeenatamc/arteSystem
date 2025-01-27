import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Piece } from '../../../interfaces/piece.model';
import { Review } from '../../../interfaces/review.model';
import { FirebaseService } from '../../../model/firebase.service';

@Component({
  selector: 'app-piece-info',
  templateUrl: './piece-info.component.html',
  styleUrls: ['./piece-info.component.css']
})
export class PieceInfoComponent implements OnInit {
  pieceId: string | null = null;
  piece$: Observable<Piece[]> | null = null;
  reviews$: Observable<Review[]> | null = null;

  constructor(private route: ActivatedRoute, private firestoreService: FirebaseService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pieceId = params['id'];
      if (this.pieceId) {
        this.piece$ = this.firestoreService.getPiecesById(this.pieceId);
        this.reviews$ = this.firestoreService.getReviewsByPieceId(this.pieceId);
      }
    });
  }
  
}
