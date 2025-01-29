import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.model';
import { FirebaseError } from '@angular/fire/app'; // Asegúrate de que esta importación es correcta según tu configuración de Firebase

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
      // Lanzamos el error para que el componente pueda capturarlo y manejarlo
      throw error;
    }
  }

  logout(): void {
    this.afAuth.signOut().then(() => {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      this.router.navigate(['/home']);
    });
  }

  // Método público para actualizar el usuario actual
  updateCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  // Método público para actualizar el usuario en Firestore
  async updateUserInFirestore(user: User): Promise<void> {
    try {
      // Usamos 'set' con la opción 'merge' para asegurar que todos los campos se actualicen correctamente
      await this.firestore.collection('users').doc(user.id).set(user, { merge: true });
      this.updateCurrentUser(user);
      console.log('Usuario actualizado en Firestore con éxito');
    } catch (error) {
      console.error('Error al actualizar el usuario en Firestore: ', error);
      throw error;
    }
  }

  // Método para verificar la contraseña actual
  async verifyCurrentPassword(currentPassword: string): Promise<boolean> {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const credential = await this.afAuth.signInWithEmailAndPassword(user.email!, currentPassword);
        // Si la autenticación es exitosa, la contraseña es correcta
        if (credential.user) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error verifying current password: ', error);
      return false;
    }
  }

  // Método para cambiar la contraseña
  async changePassword(newPassword: string): Promise<void> {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.updatePassword(newPassword);
        console.log('Contraseña cambiada con éxito.');
      } else {
        throw new Error('No user is currently signed in.');
      }
    } catch (error) {
      console.error('Error changing password: ', error);
      throw error;
    }
  }
}