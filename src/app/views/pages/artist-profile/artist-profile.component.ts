import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { SupabaseService } from '../../../model/supabase.service';
import { User } from '../../../interfaces/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../model/auth.service';
import { Piece } from '../../../interfaces/piece.model';
import { LoadingService } from '../../../services/loading.service';


@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.css']
})
export class ArtistProfileComponent implements OnInit {
  artist: User | undefined;
  artistId: string | undefined;
  pieces: Piece[] = [];
  searchQuery: string = '';
  currentUser!: User;
  isEditing: boolean = false; // Estado de edición
  selectedImage: File | null = null; // Imagen seleccionada para cargar
  isLoading: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, 
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.authService.currentUser$.subscribe(currentUser => {
        if (currentUser && currentUser.role === 'artist') {
          this.currentUser = currentUser;
          this.artist = currentUser;
          this.loadPieces(currentUser.id);
        } else {
          this.artistId = id;
          this.loadArtistInfo(this.artistId || '');
        }
      });
    });
  }

  loadArtistInfo(id: string): void {
    this.loadingService.show();

    this.firebaseService.getArtistById(id).subscribe((artists: User[]) => {
      if (artists.length > 0) {
        this.artist = artists[0];
        this.loadPieces(this.artist.id);
      } else {
        console.error('No artist found with the given ID');
      }
    });
  }

  loadPieces(authorId: string): void {
    this.firebaseService.getPiecesByAuthor(authorId).subscribe((pieces: Piece[]) => {
      this.pieces = pieces;
      this.loadingService.hide();

    });
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.pieces = this.pieces.filter(piece =>
        piece.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadPieces(this.artistId || this.artist?.id || '');
    }
  }

  onCardClick(pieceId: string): void {
    this.router.navigate(['/pieceInfo'], { queryParams: { id: pieceId } });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  async saveChanges(): Promise<void> {
    if (this.artist) {
      try {
        if (this.selectedImage) {
          const imageUrl = await this.supabaseService.uploadImage(this.selectedImage);
          this.artist.image = imageUrl; // Actualizar la URL de la imagen en el artista
        }
        await this.firebaseService.updateUser(this.artist);
        this.isEditing = false;
        alert('Perfil actualizado con éxito');
        this.loadArtistInfo(this.artist.id);
      } catch (error) {
        console.error('Error al guardar los cambios: ', error);
      }
    }
  }
}
