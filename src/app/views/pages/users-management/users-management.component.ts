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
  originalEmail: string | undefined;

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
    this.originalEmail = user.email; // Guardamos el email original al iniciar la edición
  }

  async saveUser(): Promise<void> {
    if (this.selectedUser) {
      try {
        // Actualizamos el email en Firestore directamente
        if (this.selectedUser.email !== this.originalEmail) {
          await this.firebaseService.updateUserEmail(this.selectedUser.id, this.selectedUser.email);
          alert('El email del usuario ha sido actualizado en la base de datos.');
        } else {
          // Si el email no ha cambiado, simplemente actualizamos el resto de los campos
          await this.firebaseService.updateUser(this.selectedUser);
        }

        this.selectedUser = null;
        this.originalEmail = undefined;
        this.loadUsers();
        console.log('Usuario actualizado con éxito en la base de datos');
        alert('Usuario actualizado con éxito');
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
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
    this.originalEmail = undefined;
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