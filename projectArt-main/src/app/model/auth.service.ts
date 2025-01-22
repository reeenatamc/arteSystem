import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    // Cargar el usuario desde localStorage si existe
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      console.log('uid', uid);
      if (uid) {
        const userQuerySnapshot = await this.firestore.collection('users', ref => ref.where('uid', '==', uid)).get().toPromise();
        if (userQuerySnapshot && !userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0];
          const userData = userDoc.data() as User;
          console.log('userData', userData);
          if (userData) {
            const currentUser = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              uid: userData.uid,
              image: userData.image,
              phone: userData.phone,
              role: userData.role,
              description: userData.description,
              skills: userData.skills
            };
            this.currentUserSubject.next(currentUser);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.router.navigate(['/home']);
          }
        }
      }
    } catch (error) {
      console.error('Error logging in: ', error);
    }
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      this.router.navigate(['/home']);
    });
  }
}