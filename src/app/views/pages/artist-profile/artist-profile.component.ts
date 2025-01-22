import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { User } from '../../../interfaces/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../model/auth.service';
import { Piece } from '../../../interfaces/piece.model';

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

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.authService.currentUser$.subscribe(currentUser => {
        console.log(currentUser);
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
    this.firebaseService.getArtistById(id).subscribe((artists: User[]) => {
      if (artists.length > 0) {
        this.artist = artists[0];
        console.log(this.artist.id);
        this.loadPieces(this.artist.id);
      } else {
        console.error('No artist found with the given ID');
      }
    });
  }

  loadPieces(authorId: string): void {
    this.firebaseService.getPiecesByAuthor(authorId).subscribe((pieces: Piece[]) => {
      this.pieces = pieces;
    });
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.pieces = this.pieces.filter(piece => piece.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    } else {
      this.loadPieces(this.artistId || this.artist?.id || '');
    }
  }

  onCardClick(pieceId: string): void {
    this.router.navigate(['/pieceInfo'], { queryParams: { id: pieceId } });
  }

  // Métodos para manejar la edición
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.artist) {
      this.firebaseService.updateUser(this.artist).then(() => {
        this.isEditing = false;
        alert('Perfil actualizado con éxito');
        if (this.artist) {
          this.loadArtistInfo(this.artist.id);
        }
      });
    }
  }
}