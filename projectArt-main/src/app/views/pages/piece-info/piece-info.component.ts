import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Piece } from '../../../interfaces/piece.model'; // Asegúrate de que la ruta sea correcta
import { FirebaseService } from '../../../model/firebase.service';

@Component({
  selector: 'app-piece-info',
  templateUrl: './piece-info.component.html',
  styleUrls: ['./piece-info.component.css']
})
export class PieceInfoComponent implements OnInit {
  pieceId: string | null = null;
  piece$: Observable<Piece[]> | null = null;

  constructor(private route: ActivatedRoute, private firestoreService: FirebaseService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pieceId = params['id'];
      if (this.pieceId) {
        this.piece$ = this.firestoreService.getPiecesById(this.pieceId);
      }
    });
  }
}