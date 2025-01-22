import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/carItem';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(piece: CartItem) {
    const existingPiece = this.cartItems.find(item => item.id === piece.id);
    if (existingPiece) {
      existingPiece.quantity += 1;
    } else {
      piece.quantity = 1;
      this.cartItems.push(piece);
    }
    this.saveCartToLocalStorage();
    this.cartItemsSubject.next(this.cartItems);
  }

  updateQuantity(piece: CartItem, quantity: number) {
    const existingPiece = this.cartItems.find(item => item.id === piece.id);
    if (existingPiece) {
      existingPiece.quantity = quantity;
      if (existingPiece.quantity <= 0) {
        this.removeFromCart(existingPiece);
      } else {
        this.saveCartToLocalStorage();
        this.cartItemsSubject.next(this.cartItems);
      }
    }
  }

  removeFromCart(piece: CartItem) {
    this.cartItems = this.cartItems.filter(item => item.id !== piece.id);
    this.saveCartToLocalStorage();
    this.cartItemsSubject.next(this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.saveCartToLocalStorage();
    this.cartItemsSubject.next(this.cartItems);
  }
}