import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email harus diisi' },
      { type: 'pattern', message: 'Masukkan email yang terdaftar' }
    ],
    'password': [
      { type: 'required', message: 'Password harus diisi.' },
      { type: 'minLength', message: 'Minimal password 5 karakter.' }
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group( {
      email: new FormControl('', Validators.compose( [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose( [
        Validators.minLength(5),
        Validators.required
      ])),
      confirmpassword: new FormControl('', Validators.compose( [
        Validators.minLength(5),
        Validators.required
      ])),
      namadepan: new FormControl('', Validators.compose( [
        Validators.required
      ])),
      namabelakang: new FormControl('', Validators.compose( [
        Validators.required
      ])),
      nim: new FormControl('', Validators.compose( [
        Validators.required
      ])),
      foto: new FormControl('', Validators.compose( [
 
      ]))
    }, { validator: this.matchingPasswords('password', 'confirmpassword')});
  
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  tryRegister(value) {
    this.authService.registerUser(value)
      .then(res => {
        console.log(res);
        this.errorMessage = '';
        this.successMessage = "Akun anda berhasil dibuat.";
        this.navCtrl.navigateForward('/login');
      }, err=> {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = '';

        this.successMessage = '';      });
  }

  onSubmit(form: NgForm){
    console.log(form);

    this.userService.create(form.value).then(res => {
      console.log(res);
      this.navCtrl.navigateForward('/login');
    }).catch(error => console.log(error));

    form.reset();
    //this.router.navigateByUrl('/week10/index');
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }

}
