import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Piece } from '../../../interfaces/piece.model';
import { Review } from '../../../interfaces/review.model';
import { FirebaseService } from '../../../model/firebase.service';
import { AuthService } from '../../../model/auth.service';
import { User } from '../../../interfaces/user.model';
import { CartService } from '../../../services/cart.service';
import { Router} from '@angular/router';
import { LoadingService } from '../../../services/loading.service';



@Component({
  selector: 'app-piece-info',
  templateUrl: './piece-info.component.html',
  styleUrls: ['./piece-info.component.css']
})

export class PieceInfoComponent implements OnInit {
  pieceId: string | null = null;
  piece$: Observable<Piece[]> | null = null;
  reviews$: Observable<Review[]> | null = null;
  currentUser: User | null = null;
  isLoading: boolean = false;
  visibleReviews = 6;
  isExpanded = false;
  suggestedPieces: Piece[] = [];
  // selectedPiece: Piece | null = null; 
isEditing: boolean = false;

selectedPiece: Piece = {
  id: '',
  name: '',
  type: '',
  subcategory: '',
  description: '',
  image: '',
  price: 0,
  stock: 0,
  author: '',
  height: 0,
  width: 0,
  verification: false
};



  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirebaseService,
    private authService: AuthService,
    private cartService: CartService, 
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadingService.show();

    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.pieceId = params['id'];
      if (this.pieceId) {
        this.piece$ = this.firestoreService.getPiecesById(this.pieceId);
        this.reviews$ = this.firestoreService.getReviewsByPieceId(this.pieceId);
        
        // Oculta el spinner después de cargar los datos
        this.piece$.subscribe(() => {
          this.loadingService.hide();
        });
        
        this.reviews$.subscribe(() => {
          this.loadingService.hide();
        });

      }
    });

    // Suscribirse al usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.firestoreService.getPieces().subscribe((pieces) => {
      this.suggestedPieces = this.getRandomPieces(pieces, 2);
    });

  }
  getRandomPieces(pieces: Piece[], count: number): Piece[] {
    return pieces.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  // onCardClick(pieceId: string): void {
  //   this.router.navigate(['/pieceInfo'], { queryParams: { id: pieceId } });
  // }

  onCardClick(pieceId: string, piece: any): void {
    this.cartService.addToCart(piece);
    alert('Obra agregada al carrito!');
    this.router.navigate(['/cart'], { queryParams: { id: pieceId } });
    
  }

  showMoreReviews() {
    if (this.reviews$) {
      this.reviews$.subscribe(reviews => {
        const totalReviews = reviews.length;

        if (this.visibleReviews < totalReviews) {
          this.visibleReviews += 6; // Aumenta en 6 cada vez que se hace clic en "Ver más"
        } else {
          this.visibleReviews = 6; // Si ya se mostraron todas, se restablece a 6
        }
      });

      // Alterna el estado de isExpanded
      this.isExpanded = !this.isExpanded;
    }
  }

  editPiece(piece: Piece): void {
    this.selectedPiece = { ...piece }; // Copia los datos de la obra seleccionada
    this.isEditing = true; // Muestra el formulario
  }
  
  saveChanges(): void {
    if (this.selectedPiece) {
      this.firestoreService.updatePiece(this.selectedPiece.id, this.selectedPiece)
        .then(() => {
          alert('Obra actualizada con éxito');
          this.isEditing = false; // Cierra el formulario después de guardar
        })
        .catch(error => {
          console.error('Error al actualizar la obra:', error);
          alert('Hubo un error al actualizar la obra.');
        });
    }
  }
  
  cancelEdit(): void {
    this.isEditing = false;
    this.selectedPiece = {
      id: '',
      name: '',
      type: '',
      subcategory: '',
      description: '',
      image: '',
      price: 0,
      stock: 0,
      author: '',
      height: 0,
      width: 0,
      verification: false
    };
  }
  
  
  deletePiece(pieceId: string | null): void {
    if (!pieceId) {
      console.error('No hay ID de obra para eliminar.');
      return;
    }
  
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar esta obra?');
    if (confirmDelete) {
      this.firestoreService.deletePieceById(pieceId)
        .then(() => {
          alert('Obra eliminada con éxito');
          this.router.navigate(['/']); // Redirigir a la página principal o galería
        })
        .catch(error => {
          console.error('Error eliminando la obra:', error);
          alert('Hubo un error al eliminar la obra.');
        });
    }
  }
  

  onMouseMove(event: MouseEvent) {
    const lens = document.querySelector('.zoom-lens') as HTMLElement;
    const image = document.querySelector('.image') as HTMLImageElement;
    const pieceImage = document.querySelector('.piece-image') as HTMLElement;
  
    if (!lens || !image || !pieceImage) return;
  
    lens.style.display = 'block';
  
    const { left, top, width, height } = pieceImage.getBoundingClientRect();
    let x = event.clientX - left;
    let y = event.clientY - top;
  
    const lensSize = 100; // Tamaño de la lupa
    x = Math.max(lensSize / 2, Math.min(x, width - lensSize / 2));
    y = Math.max(lensSize / 2, Math.min(y, height - lensSize / 2));
  
    lens.style.left = `${x - lensSize / 2}px`;
    lens.style.top = `${y - lensSize / 2}px`;
  
    // Aplicar zoom
    const zoom = 2;
    image.style.transformOrigin = `${(x / width) * 100}% ${(y / height) * 100}%`;
    image.style.transform = `scale(${zoom})`;
  }
  
  onMouseLeave() {
    const lens = document.querySelector('.zoom-lens') as HTMLElement;
    const image = document.querySelector('.image') as HTMLImageElement;
    if (lens) lens.style.display = 'none';
    if (image) image.style.transform = 'scale(1)';
  }
  


  
  
  
}
