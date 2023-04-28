import { Component } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { User } from 'src/app/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = new User();
 

  save(registerForm: NgForm) {
    console.log(registerForm.form)
    console.log('Saved:' + JSON.stringify(registerForm.value))
  }
}
