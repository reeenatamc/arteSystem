import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Piece } from '../interfaces/piece.model';
import { Sale } from '../interfaces/sale';
import { Review } from '../interfaces/review.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  async saveUser(user: Omit<User, 'id'>): Promise<void> {
    try {
      const userRef = this.firestore.collection('users').doc();
      const id = userRef.ref.id;
      await userRef.set({ ...user, id });
    } catch (error) {
      console.error('Error saving user: ', error);
    }
  }

  getPieces(): Observable<any[]> {
    return this.firestore.collection('pieces').valueChanges();
  }

  getPiecesVerified(): Observable<any[]> {
    return this.firestore.collection('pieces', ref => 
      ref.where('verification', '==', true)
    ).valueChanges();
  }

  getPiecesVerifiedByType(type: string): Observable<any[]> {
    return this.firestore.collection('pieces', ref => 
      ref.where('type', '==', type).where('verification', '==', true)
    ).valueChanges();
  }

  getArtists(): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => ref.where('role', '==', 'artist')).valueChanges();
  }

  getArtistById(id: string): Observable<any> {
    return this.firestore.collection<any>('users',ref => ref.where('id', '==', id)).valueChanges();
  }
  getPiecesByAuthor(authorId: string): Observable<Piece[]> {
    return this.firestore.collection<Piece>('pieces', ref => ref.where('author', '==', authorId)).valueChanges();
  }

  getPiecesById(Id: string): Observable<any> {
    return this.firestore.collection<Piece>('pieces', ref => ref.where('id', '==', Id)).valueChanges();
  }

  getSalesByClient(Id: string): Observable<any> {
    return this.firestore.collection<Piece>('sales', ref => ref.where('client.id', '==', Id)).valueChanges();
  }

  async addSale(sale: Sale) {
    try {
      const userRef = this.firestore.collection('sales').doc();
      const id = userRef.ref.id;
      await userRef.set({ ...sale, id });
    } catch (error) {
      console.error('Error saving user: ', error);
    }
  }
  
  getSaleById(saleId: string): Observable<any> {
    return this.firestore.collection('sales').doc<Sale>(saleId).valueChanges();
  }


  
  async addReview(user: Omit<Review, 'id'>): Promise<void> {
    try {
      const userRef = this.firestore.collection('reviews').doc();
      const id = userRef.ref.id;
      await userRef.set({ ...user, id });
    } catch (error) {
      console.error('Error saving user: ', error);
    }
  }

  getSales(): Observable<Sale[]> {
    return this.firestore.collection<Sale>('sales', ref => ref.where('status', '==', false))
      .snapshotChanges()
      .pipe(
      map((actions: any[]) => actions.map((a: any) => {
        const data = a.payload.doc.data() as Sale;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
      );
  }
  updateSaleStatus(saleId: string, status: boolean): Promise<void> {
    return this.firestore.collection('sales').doc(saleId).update({ status });
  }

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }
  updateUser(user: User): Promise<void> {
    return this.firestore.collection('users').doc(user.id).update(user);
  }

  deleteUser(userId: string): Promise<void> {
    return this.firestore.collection('users').doc(userId).delete();
  }

  deleteSale(saleId: string): Promise<void> {
    return this.firestore.collection('sales').doc(saleId).delete();
  }

  updatePieceVerification(pieceId: string, verification: boolean): Promise<void> {
    return this.firestore.collection('pieces').doc(pieceId).update({ verification });
  }

  getReviews(): Observable<Review[]> {
    return this.firestore.collection<Review>('reviews')
      .snapshotChanges()
      .pipe(
        map((actions: any[]) => actions.map((a: any) => {
          const data = a.payload.doc.data() as Review;
          const id = a.payload.doc.id;
          return { ...data, id };
        }))
      );
  }
  updateReview(review: Review): Promise<void> {
    return this.firestore.collection('reviews').doc(review.id).update(review);
  }

  deleteReview(saleId: string): Promise<void> {
    return this.firestore.collection('reviews').doc(saleId).delete();
  }

 
}