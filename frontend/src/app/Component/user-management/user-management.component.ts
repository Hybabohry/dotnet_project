import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  telephone: string;
  email: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>User Management</h2>
        
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading users...</p>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>

      <div *ngIf="!isLoading && !errorMessage" class="users-list">
        <div *ngIf="users.length === 0" class="empty-state">
          <i class="fas fa-users"></i>
          <p>No users available. Add a new user to get started!</p>
        </div>

        <div *ngFor="let user of users" class="user-card">
          <div class="user-content">
            <div class="user-icon">
              <i class="fas fa-user"></i>
            </div>
            <div class="user-info">
            <h3>{{ user.firstname }} {{ user.lastname }}</h3>
            <div class="user-details">
                <span><i class="fas fa-phone"></i> {{ user.telephone }}</span>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button class="action-btn edit-btn" (click)="editUser(user)" title="Edit User">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" (click)="deleteUser(user.id)" title="Delete User">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div *ngIf="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit User' : 'Add New User' }}</h3>
          <button class="close-button" (click)="closeModal()">×</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="submitUser()" #userForm="ngForm">
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input type="text" id="firstname" [(ngModel)]="currentUser.firstname" name="firstname" required>
            </div>
            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input type="text" id="lastname" [(ngModel)]="currentUser.lastname" name="lastname" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="currentUser.email" name="email" required>
            </div>
            <div class="form-group">
              <label for="telephone">Telephone</label>
              <input type="tel" id="telephone" [(ngModel)]="currentUser.telephone" name="telephone" required>
            </div>
            <div class="form-actions">
              <button type="submit" [disabled]="!userForm.form.valid" class="submit-btn">
                {{ isEditing ? 'Update' : 'Add' }} User
              </button>
              <button type="button" class="cancel-btn" (click)="closeModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      font-size: 2rem;
      color: #1a1a1a;
      font-weight: 700;
      margin: 0;
    }

    .add-user {
      background: #F59E0B;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .add-user:hover {
      background: #D97706;
      transform: translateY(-2px);
    }

    .loading-container {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #F59E0B;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .users-list {
      display: grid;
      gap: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 2px dashed #e2e8f0;
    }

    .empty-state i {
      font-size: 3rem;
      color: #94a3b8;
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    .user-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
    }

    .user-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-icon {
      width: 48px;
      height: 48px;
      background: #fff7ed;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-icon i {
      font-size: 1.5rem;
      color: #F59E0B;
    }

    .user-info h3 {
      font-size: 1.25rem;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .user-details {
      display: flex;
      gap: 1.5rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .user-details span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .edit-btn {
      background: #e0f2fe;
      color: #0284c7;
    }

    .delete-btn {
      background: #fee2e2;
      color: #dc2626;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    /* Modal Styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #1a1a1a;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4b5563;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .submit-btn {
      background: #F59E0B;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      flex: 1;
    }

    .submit-btn:disabled {
      background: #e5e7eb;
      cursor: not-allowed;
    }

    .cancel-btn {
      background: #f3f4f6;
      color: #4b5563;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      flex: 1;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .user-card {
        flex-direction: column;
        gap: 1rem;
      }

      .user-content {
        flex-direction: column;
        text-align: center;
      }

      .user-details {
        flex-direction: column;
        gap: 0.5rem;
      }

      .action-buttons {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  showModal: boolean = false;
  isEditing: boolean = false;
  currentUser: User = {
    id: '',
    firstname: '',
    lastname: '',
    telephone: '',
    email: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Authentication token not found. Please log in.';
      this.isLoading = false;
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.get<any[]>('http://localhost:5096/api/UserManagement', { headers }).subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          id: user.Id,
          firstname: user.Firstname,
          lastname: user.Lastname,
          email: user.Email,
          telephone: user.Telephone
        }));
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load users: ' + (error.message || 'Unknown error');
      }
    });
  }
  

  openAddUserModal(): void {
    this.isEditing = false;
    this.currentUser = {
      id: '',
      firstname: '',
      lastname: '',
      telephone: '',
      email: ''
    };
    this.showModal = true;
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentUser = {
      id: '',
      firstname: '',
      lastname: '',
      telephone: '',
      email: ''
    };
  }

  submitUser(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Authentication token not found. Please log in.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (this.isEditing) {
      this.http.put(`http://localhost:5096/api/UserManagement/${this.currentUser.id}`, this.currentUser, { headers }).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = 'Failed to update user: ' + (error.message || 'Unknown error');
        }
      });
    } else {
      this.http.post('http://localhost:5096/api/UserManagement', this.currentUser, { headers }).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = 'Failed to add user: ' + (error.message || 'Unknown error');
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'Authentication token not found. Please log in.';
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.delete(`http://localhost:5096/api/UserManagement/${id}`, { headers }).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user: ' + (error.message || 'Unknown error');
        }
      });
    }
  }
} 