import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
 

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('LayoutComponent initialized');
 

   
  }
  ngAfterViewInit() {
    feather.replace();
}

toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mini');
        if (window.innerWidth <= 992) {
            sidebar.classList.toggle('active');
        }
    }
}
logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}

 
  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
}
