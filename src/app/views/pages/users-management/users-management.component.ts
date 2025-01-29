import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../model/firebase.service';
import { User } from '../../../interfaces/user.model';
import { getAuth, updateEmail, sendEmailVerification } from 'firebase/auth';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  // Variables para la paginación
  currentPage: number = 1;
  usersPerPage: number = 4;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.firebaseService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
  }

  async saveUser(): Promise<void> {
    if (this.selectedUser) {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Actualizar el correo electrónico en Firebase Authentication si ha cambiado
          if (this.selectedUser.email !== currentUser.email) {
            await updateEmail(currentUser, this.selectedUser.email);
            // Envía el correo de verificación
            await sendEmailVerification(currentUser);
            alert('Se ha enviado un correo de verificación al nuevo correo electrónico. Por favor, verifícalo antes de continuar.');
            // No actualices Firestore hasta que el correo sea verificado
            return;
          }

          // Actualizar el usuario en Firestore usando el método del servicio
          await this.firebaseService.updateUser(this.selectedUser);

          this.selectedUser = null;
          this.loadUsers();
          console.log('User updated successfully in database');
        } else {
          throw new Error('No hay usuario autenticado');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        let errorMessage = 'Hubo un error al intentar actualizar el usuario. Por favor, inténtalo de nuevo.';
        if (error instanceof Error) {
          errorMessage += ' Detalles: ' + error.message;
        }
        alert(errorMessage);
      }
    }
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }

  deleteUser(userId: string): void {
    this.firebaseService.deleteUser(userId).then(() => {
      this.loadUsers();
    }).catch(error => {
      console.error('Error deleting user:', error);
      alert('Hubo un error al eliminar el usuario. Por favor, inténtalo de nuevo.');
    });
  }

  // Métodos para la paginación
  get totalPages(): number {
    return Math.ceil(this.users.length / this.usersPerPage);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.usersPerPage;
    const end = start + this.usersPerPage;
    return this.users.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}