import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
signupForm: FormGroup;

constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) {
  this.signupForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
}
onSignup() {
  if (this.signupForm.valid) {
    this.auth.userSignUp(this.signupForm.value).subscribe(
      (resp: any) => {
        console.log("You have successfully signed up!", resp);
        this.auth.setToken(resp.jwt); 
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.log(error);
        });
  }
}
}


