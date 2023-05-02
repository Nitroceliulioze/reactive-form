import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { debounceTime } from 'rxjs';

import { User } from 'src/app/user';

// validator to match emails
function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmControl?.value) {
    return null;
  }
  return { match: true };
}

//validator to match passwords
function passwordMatcher(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const passwordControl = c.get('password');
  const confirmControl = c.get('confirmPassword');

  if (passwordControl?.pristine || confirmControl?.pristine) {
    return null;
  }

  if (passwordControl?.value === confirmControl?.value) {
    return null;
  }

  return { match: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  user: User = new User();

  //error messages for formControls
  nameMessage!: string;
  surnameMessage!: string;
  emailMessage!: string;
  confirmEmailMessage!: string;
  passwordMessage!: string;
  confirmPasswordMessage!: string;

  private nameValidationMessages: any = {
    required: 'Please enter your First Name.',
    minlength: 'The First Name must be longer than 2 characters.',
  };

  private surnameValidationMessages: any = {
    required: 'Please enter your Surname.',
    minlength: 'Surname must be longer than 2 characters.',
  };

  private emailValidationMessages: any = {
    required: 'Please enter your email.',
    email: 'Enter valid email',
  };

  private confirmEmailValidationMessages: any = {
    match: 'Emails do not match',
  };

  private passwordValidationMessages: any = { 
    required: 'Please enter your password.',
    minlength: 'Password must be longer than 8 characters.',
  }

  private confirmPasswordValidationMessages: any = {
    match: 'Passwords do not match',
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validators: emailMatcher }
      ),
      passwordGroup: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required],
        },
        { validators: passwordMatcher }
      ),
    });

    //error messages for formControls
    const firstNameControl = this.registerForm.get('firstName');
    firstNameControl?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => this.setNameErrorMessage(firstNameControl));

    const surnameControl = this.registerForm.get('surname');
    surnameControl?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => this.setSurnameErrorMessage(surnameControl));

    const emailControl = this.registerForm.get('emailGroup.email');
    emailControl?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => this.setEmailErrorMessage(emailControl));

    const confirmEmailControl = this.registerForm.get('emailGroup');
    confirmEmailControl?.valueChanges
      .pipe(debounceTime(200))
      .subscribe((value) =>
        this.setConfirmEmailErrorMessage(confirmEmailControl)
      );

    const passwordControl = this.registerForm.get('passwordGroup.password'); 
    passwordControl?.valueChanges.pipe(debounceTime(1000)).subscribe( value => this.setPasswordErrorMessage(passwordControl))

    const confirmPasswordControl = this.registerForm.get('passwordGroup');
    confirmPasswordControl?.valueChanges.pipe(debounceTime(500)).subscribe(value => this.setConfrmPasswordMessage(confirmPasswordControl))
  }

  //methonds for error messages for formControls
  setNameErrorMessage(c: AbstractControl): void {
    this.nameMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.nameMessage = Object.keys(c.errors)
        .map((key) => this.nameValidationMessages[key])
        .join(' ');
    }
  }

  setSurnameErrorMessage(c: AbstractControl): void {
    this.surnameMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.surnameMessage = Object.keys(c.errors)
        .map((key) => this.surnameValidationMessages[key])
        .join(' ');
    }
  }

  setEmailErrorMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors)
        .map((key) => this.emailValidationMessages[key])
        .join(' ');
    }
  }

  setConfirmEmailErrorMessage(c: AbstractControl): void {
    this.confirmEmailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.confirmEmailMessage = Object.keys(c.errors)
        .map((key) => this.confirmEmailValidationMessages[key])
        .join(' ');
    }
  }

  setPasswordErrorMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.passwordMessage = Object.keys(c.errors).map((key)=> this.passwordValidationMessages[key]).join(' ')
    }
  }

  setConfrmPasswordMessage(c: AbstractControl): void {
    this.confirmPasswordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.confirmPasswordMessage = Object.keys(c.errors).map((key) => this.confirmPasswordValidationMessages[key]).join(' ');
    }
  }

  save() {
    console.log(this.registerForm);
    console.log('Saved:' + JSON.stringify(this.registerForm.value));
  }
}
