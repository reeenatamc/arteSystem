import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { Piece } from '../../../interfaces/piece.model';
import { LoadingService } from '../../../services/loading.service';


@Component({
  selector: 'app-piece-management',
  templateUrl: './piece-management.component.html',
  styleUrls: ['./piece-management.component.css']
})
export class PieceManagementComponent implements OnInit {
  pieces: Piece[] = [];
  filteredPieces: Piece[] = [];
  isLoading: boolean = false;

  // Variables para la paginación
  currentPage: number = 1;
  piecesPerPage: number = 4;

  constructor(private firebaseService: FirebaseService, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.loadPieces();
  }

  loadPieces(): void {
    this.loadingService.show(); 

    this.firebaseService.getPieces().subscribe((pieces: Piece[]) => {
      this.pieces = pieces;
      this.filteredPieces = pieces;
      this.loadingService.hide();

    });
  }

  updatePieceVerification(pieceId: string, verification: boolean): void {
    this.firebaseService.updatePieceVerification(pieceId, verification).then(() => {
      this.loadPieces();
    });
  }

  filterPieces(filter: string): void {
    if (filter === 'all') {
      this.filteredPieces = this.pieces;
    } else if (filter === 'verified') {
      this.filteredPieces = this.pieces.filter(piece => piece.verification);
    } else if (filter === 'not-verified') {
      this.filteredPieces = this.pieces.filter(piece => !piece.verification);
    }
  }

  // Métodos para la paginación
  get totalPages(): number {
    return Math.ceil(this.filteredPieces.length / this.piecesPerPage);
  }

  get paginatedPieces(): Piece[] {
    const start = (this.currentPage - 1) * this.piecesPerPage;
    const end = start + this.piecesPerPage;
    return this.filteredPieces.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  deletePiece(pieceId: string): void {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta obra?");
if (confirmed) {
  this.firebaseService.deletePiece(pieceId).then(() => {
    this.loadPieces(); // Recargar las piezas después de eliminarlas
  });
}
}
  

}