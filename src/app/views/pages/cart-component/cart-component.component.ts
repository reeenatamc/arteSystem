import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../interfaces/carItem';
import { Router } from '@angular/router';
import { Sale } from '../../../interfaces/sale';
import { FirebaseService } from '../../../model/firebase.service';
import { SupabaseService } from '../../../model/supabase.service';
import { User } from '../../../interfaces/user.model';
import { AuthService } from '../../../model/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart-component.component.html',
  styleUrls: ['./cart-component.component.css']
})
export class CartComponent implements OnInit {
  totalPrice: number = 0;
  cartItems: CartItem[] = [];
  currentUser!: User;
  selectedFile: File | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private firestoreService: FirebaseService,
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item, quantity);
    this.calculateTotalPrice(); // Calcula el total después de actualizar la cantidad
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item);
    this.calculateTotalPrice(); // Calcula el total después de eliminar un elemento
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = []; // Asegúrate de limpiar los elementos del carrito localmente
    this.calculateTotalPrice(); // Calcula el total después de vaciar el carrito
    alert('Cart cleared!');
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  async submitForReview() {
    let paymentProofUrl = '';

    if (this.selectedFile) {
      try {
        paymentProofUrl = await this.supabaseService.uploadImage(this.selectedFile);
      } catch (error) {
        console.error('Error uploading payment proof:', error);
        alert('There was an error uploading the payment proof. Please try again.');
        return;
      }
    }

    const sale: Sale = {
      id: '',
      piece: this.cartItems.map(item => item), // Arreglo de IDs de los objetos del carrito
      saleDate: new Date().toISOString(),
      client: this.currentUser, // Asegúrate de que el campo client sea del tipo User
      quantity: this.cartItems.reduce((acc, item) => acc + item.quantity, 0),
      total: this.totalPrice,
      status: false,
      imagePayment: paymentProofUrl // Agrega el campo paymentProofUrl a la interfaz Sale
    };

    try {
      await this.firestoreService.addSale(sale);
      alert('Sale submitted for review!');
      this.cartService.clearCart();
      this.router.navigate(['/check'], { queryParams: { option: 'pago' } });
    } catch (error) {
      console.error('Error submitting sale:', error);
      alert('There was an error submitting the sale. Please try again.');
    }
  }


}