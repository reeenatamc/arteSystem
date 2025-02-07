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
import { Router } from '@angular/router';
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
  ) { }

  ngOnInit(): void {
    this.loadingService.show();

    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.pieceId = params['id'];
      if (this.pieceId) {
        // obtiene la pieza con la id
        this.piece$ = this.firestoreService.getPiecesById(this.pieceId);
        // obtiene las reviews asociadas a esa pieza
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


   // piezas aleatorias para quizá te interese
    this.firestoreService.getPieces().subscribe((pieces) => {
      this.suggestedPieces = this.getRandomPieces(pieces, 2);
    });
  }

  // logica para obtener piezas random
  getRandomPieces(pieces: Piece[], count: number): Piece[] {
    return pieces.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  // onCardClick(pieceId: string): void {
  //   this.router.navigate(['/pieceInfo'], { queryParams: { id: pieceId } });
  // }

  // onCardClick(pieceId: string, piece: any): void {
  //   this.cartService.addToCart(piece);
  //   alert('Obra agregada al carrito!');
  //   this.router.navigate(['/cart'], { queryParams: { id: pieceId } });

  // }

  showMoreReviews() {
    //ve que no sea nulo
    if (this.reviews$) {
      this.reviews$.subscribe(reviews => {
        const totalReviews = reviews.length;

        if (this.visibleReviews < totalReviews) {
          this.visibleReviews += 6; // Aumenta en 6 cada vez que se hace clic en "Ver más"
        } else {
          this.visibleReviews = 6; // Si ya se mostraron todas, se restablece a 6
        }
      });

      // Alterna el estado de isExpanded. isExpanded es true, el botón mostrará "Mostrar menos", y si es false, mostrará "Ver más".
      // alterna el estado en sí
      this.isExpanded = !this.isExpanded;
    }
  }

  editPiece(piece: Piece): void {
    this.selectedPiece = { ...piece }; // Copia los datos de la obra seleccionada
    this.isEditing = true; // Muestra el formulario
  }

  saveChanges(): void {
    if (this.selectedPiece) { // que la pieza seleccionada no sea nula
      this.firestoreService.updatePiece(this.selectedPiece.id, this.selectedPiece) // manda el id de la pieza seleccionada y luego la pieza total
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
//selectedPiece en una COPIAAA
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
    // Selecciona el elemento de la lupa (zoom-lens) y la imagen de la obra
    const lens = document.querySelector('.zoom-lens') as HTMLElement;
    const image = document.querySelector('.image') as HTMLImageElement;
    const pieceImage = document.querySelector('.piece-image') as HTMLElement;

    // Si no se encuentran los elementos, sale de la función
    if (!lens || !image || !pieceImage) return;

    // Muestra la lupa al pasar el mouse sobre la imagen
    lens.style.display = 'block';

    // Obtiene las coordenadas del contenedor de la imagen (pieceImage)
    const { left, top, width, height } = pieceImage.getBoundingClientRect(); // obtiene las medidas en 4 medidas
    let x = event.clientX - left; // Calcula la posición horizontal del mouse dentro de la imagen
    let y = event.clientY - top;  // Calcula la posición vertical del mouse dentro de la imagen

    // Tamaño de la lupa (la lupa tendrá un tamaño de 100px)
    const lensSize = 100;

    // Asegura que la lupa no se desborde de la imagen, limitando las coordenadas x e y
    x = Math.max(lensSize / 2, Math.min(x, width - lensSize / 2));
    y = Math.max(lensSize / 2, Math.min(y, height - lensSize / 2));

    // Mueve la lupa a la posición donde se encuentra el mouse
    lens.style.left = `${x - lensSize / 2}px`; //coloca el borde izquierdo de la lupa en la posición x píxeles desde el borde izquierdo de la imagen
    lens.style.top = `${y - lensSize / 2}px`;

    // Configura el zoom en la imagen
    const zoom = 2; // Factor de zoom
    // Establece el origen del zoom en función de la posición del mouse dentro de la imagen
    image.style.transformOrigin = `${(x / width) * 100}% ${(y / height) * 100}%`; // hace que se llene el contenedor
    // Aplica el zoom a la imagen (escala de 2 veces su tamaño original)
    image.style.transform = `scale(${zoom})`;
}

onMouseLeave() {
    // Selecciona la lupa y la imagen
    const lens = document.querySelector('.zoom-lens') as HTMLElement;
    const image = document.querySelector('.image') as HTMLImageElement;

    // Si la lupa existe, ocúltala
    if (lens) lens.style.display = 'none';
    // Si la imagen existe, restablece el zoom a su tamaño original
    if (image) image.style.transform = 'scale(1)';
}


  addToCart(piece: any) {
    this.cartService.addToCart(piece);
    alert('Obra agregada al carrito!');
  }

  onCardClick(pieceId: string): void {
    this.router.navigate(['/cart'], { queryParams: { id: pieceId } });
  }






}
