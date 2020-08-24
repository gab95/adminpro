import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  auth2: any;

  formSubmitted = false;

  loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [localStorage.getItem('remember') || false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private _usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    this._usuarioService.login(this.loginForm.value).subscribe(
      (resp: any) => {
        if (this.loginForm.get('remember')) {
          localStorage.setItem('email', this.loginForm.get('email').value);
          localStorage.setItem(
            'remember',
            this.loginForm.get('remember').value
          );
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigate(['/dashboard']);
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });
    this.startApp();
  }

  async startApp() {
    await this._usuarioService.googleInit();
    this.auth2 = this._usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        var id_token = googleUser.getAuthResponse().id_token;
        this._usuarioService.loginGoogle(id_token).subscribe(() => {
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        });
      },
      function (error) {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
