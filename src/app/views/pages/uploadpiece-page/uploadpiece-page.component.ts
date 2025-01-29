import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Piece } from '../../../interfaces/piece.model';
import { SupabaseService } from '../../../model/supabase.service';
import { AuthService } from '../../../model/auth.service';
import { User } from '../../../interfaces/user.model';
import { Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';


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
  isLoading: boolean = false;
  warningMessage: string = ''; // Nueva propiedad para el mensaje de advertencia

  constructor(
    private firestore: AngularFirestore, 
    private supabaseService: SupabaseService, 
    private authService: AuthService, 
    private router: Router, 
    private loadingService: LoadingService
  ) {}

  onTypeChange(): void {
    switch (this.piece.type) {
      case 'pintura':
        this.subcategories = ['acrilico', 'escultura', 'acuarela', 'pastel'];
        this.warningMessage = ''; // No mostrar advertencia para pintura
        break;
      case 'escultura':
      case 'ceramica': // Advertencia para escultura y cerámica
        this.subcategories = ['arquitectonica', 'urbana', 'monumental'];
        this.warningMessage = '⚠️Asegúrese que en la imagen se vea correctamente el volumen de la obra.';
        break;
      default:
        this.subcategories = [];
        this.warningMessage = ''; // Limpia el mensaje para otros tipos
        break;
    }
  }


  ngOnInit(): void {
    // Mostrar el spinner al cargar la página
    this.loadingService.show(); 

    // Suscripción para obtener el usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Suscripción para verificar si se debe mostrar el spinner (si se está cargando algo más)
    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    // Simulamos la carga de los datos del formulario o algún recurso externo
    setTimeout(() => {
      // Ocultamos el spinner cuando el formulario y datos estén cargados
      this.loadingService.hide();
    }, 1000);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
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