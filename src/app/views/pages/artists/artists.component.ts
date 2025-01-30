import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { User } from '../../../interfaces/user.model';
import { Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  artists: User[] = [];
  filteredArtists: User[] = []; // 🔹 Lista filtrada
  isLoading: boolean = false;
  searchQuery: string = ''; // 🔹 Variable de búsqueda

  // Variables para la paginación
  currentPage: number = 1;
  artistsPerPage: number = 4;

  constructor(private firebaseService: FirebaseService, private router: Router, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.loadingService.show(); 

    this.firebaseService.getArtists().subscribe((artists: User[]) => {
      this.artists = artists;
      this.filteredArtists = artists; // 🔹 Inicialmente, todos los artistas
      this.loadingService.hide();
    });
  }

  // 🔹 Filtrar artistas por nombre
  applyFilters(): void {
    this.filteredArtists = this.artists.filter(artist =>
      artist.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1; // Reiniciar a la primera página después del filtrado
  }

  onCardClick(artistId: string): void {
    this.router.navigate(['/profileartist'], { queryParams: { id: artistId } });
  }

  // Métodos para la paginación
  get totalPages(): number {
    return Math.ceil(this.filteredArtists.length / this.artistsPerPage);
  }

  get paginatedArtists(): User[] {
    const start = (this.currentPage - 1) * this.artistsPerPage;
    const end = start + this.artistsPerPage;
    return this.filteredArtists.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
