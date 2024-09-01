import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
email: string = '';
password: string = '';
errorMessage: string = '';

constructor(private auth: AuthenticationService, private router: Router) {
}

onLogin() {
  const data = {
    email: this.email,
    password: this.password
  }
  this.auth.userLogin(data).subscribe(
    (resp: any) => {
      console.log('login successful', resp);
      this.auth.setToken(resp.jwt); 
      this.router.navigate(['/dashboard']);
    },
    (error: any) => {
      this.errorMessage = error;
      });
}
}