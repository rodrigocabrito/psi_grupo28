import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls
  : ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: User | undefined;
  hide: boolean = true;
  username: string = "";
  password: string = "";
  confirmPassword: string = "";
  usernameError: string = "";
  passwordError: string = "";

  constructor(private fb: FormBuilder,private userService: UserService,private router: Router) {
  }

  ngOnInit() {
  }

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), this.validateUsername.bind(this)]],
    password: ['', [Validators.required, Validators.minLength(8), this.validatePassword.bind(this)]]
  })


  register() {
    if (!this.registerForm.valid) {
      return;
    }
    this.username = this.registerForm.get('username')!.value;
    this.password = this.registerForm.get('password')!.value;
    this.userService.registerUser({username: this.username, password:this.password})
    .subscribe(user => {
      this.user = user;
      if (this.user) {
        if (this.user.id === '0') {
          alert('Username is already taken');
        }else{this.router.navigate(['/dashboard', this.user.id]);}
      }
    });
  

  }

  validateUsername(control: any) {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (control.value && control.value.length < 3) {
      this.usernameError = 'Username must have at least 3 characters.';
      return { usernameInvalid: true };
    } else if (control.value && !usernameRegex.test(control.value)) {
      this.usernameError = 'Username can only contain alphanumeric characters.';
      return { usernameInvalid: true };
    } else {
      this.usernameError = '';
      return null;
    }
  }
  
  validatePassword(control: any) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (control.value && control.value.length < 8) {
      this.passwordError = 'Password must have at least 8 characters.';
      return { passwordInvalid: true };
    } else if (control.value && !passwordRegex.test(control.value)) {
      this.passwordError =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
      return { passwordInvalid: true };
    } else {
      this.passwordError = '';
      return null;
    }
  }

}
