import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { User } from 'src/app/user';

function emailMatcher(c: AbstractControl): {[key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmControl?.pristine) {
    return null
  }

  if( emailControl?.value === confirmControl?.value) {
    return null
  }
  return { 'match': true}
}

function passwordMatcher(c: AbstractControl): { [key: string] : boolean} | null {
  const passwordControl = c.get('password');
  const confirmControl = c.get('confirmPassword');

  if(passwordControl?.pristine || confirmControl?.pristine) {
    return null
  }

  if(passwordControl?.value === confirmControl?.value) {
    return null
  }

  return { 'match' : true }
}

 @Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  user: User = new User();
  emailMessage!: string;
  
  private validationMessages: any = {
    required: 'Please enter your email.',
    email: 'Enter valid email'
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, { validators: emailMatcher }),
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      }, {validators: passwordMatcher}),
    });

    const emailControl = this.registerForm.get('emailGroup.email');
    emailControl?.valueChanges.pipe(debounceTime(1000)).subscribe(
      value => this.setMessage(emailControl)
    );
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key=> this.validationMessages[key]).join(' ');
    }
  }

  save() {
    console.log(this.registerForm);
    console.log('Saved:' + JSON.stringify(this.registerForm.value));
  }
}
