import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Piece } from '../../../interfaces/piece.model';
import { SupabaseService } from '../../../model/supabase.service';
import { AuthService } from '../../../model/auth.service';
import { User } from '../../../interfaces/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-piece',
  templateUrl: './uploadpiece-page.component.html',
  styleUrls: ['./uploadpiece-page.component.css']
})
export class UploadPieceComponent {
  piece: Piece = {
    id: 's',
    name: '',
    type: '',
    description: '',
    image: '',
    price: 0,
    subcategory: '',
    stock: 0,
    author: 's',
    verification: false,
    height: 0,
    width: 0
  };
  selectedFile: File | null = null;
  currentUser: User | null = null;
  subcategories: string[] = [];

  constructor(private firestore: AngularFirestore, private supabaseService: SupabaseService, 
    private authService: AuthService,  private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onTypeChange(): void {
    switch (this.piece.type) {
      case 'pintura':
        this.subcategories = ['acrilico', 'escultura', 'acuarela','pastel'];
        break;
      case 'escultura':
        this.subcategories = ['arquitectonica', 'urbana', 'monumental'];
        break;
      default:
        this.subcategories = [];
        break;
    }
  }

  submitForReview() {
    this.router.navigate(['/check'], { queryParams: { option: 'publicacion' } });
  }

  async onSubmit(): Promise<void> {
    console.log('Piece: ', this.piece);
    if (!this.piece.name || !this.piece.type || !this.piece.description || !this.piece.author) {
      console.error('All fields are required');
      return;
    }

    if (this.selectedFile) {
      try {
        const imageUrl = await this.supabaseService.uploadImage(this.selectedFile);
        this.piece.image = imageUrl;

        const pieceId = this.firestore.createId();
        this.piece.id = pieceId;
        this.piece.author = this.currentUser?.id || '';
        await this.firestore.collection('pieces').doc(pieceId).set(this.piece);

        console.log('Piece uploaded successfully');
        this.submitForReview();
      } catch (error) {
        console.error('Error uploading piece: ', error);
      }
    }
  }
}