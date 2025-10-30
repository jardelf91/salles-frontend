import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordView: boolean = false;
  showPasswordRecoveryModal: boolean = false;
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private snackBar: MatSnackBar
    
  ) {
    this.form = formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility() {
    this.passwordView = !this.passwordView;
  }

  showPasswordRecovery() {
    this.showPasswordRecoveryModal = true;
  }

  closePasswordRecovery() {
    this.showPasswordRecoveryModal = false;
  }

  // loginSystem() {
  //   if (this.form.valid) {
  //     const formValue = this.form.value;

  //     this.loginService
  //       .login(formValue.login, formValue.password)
  //       .subscribe({
  //         next: (response) => {
  //           this.loginService.setAuthToken(response.token);
  //           this.router.navigate(['/statistics']);
  //         },
  //         error: (err) => {
  //           console.error('Erro no login:', err);

  //           if (err.status === 401) {
  //             this.showToast('Usuário ou senha inválidos!', 'error');
  //           } else {
  //             this.showToast('Erro ao realizar login. Tente novamente.', 'error');
  //           }
  //         },
  //       });
  //   } else {
  //     this.showToast('Por favor, preencha todos os campos.', 'warning');
  //   }
  // }
  loginSystem() {
  if (this.form.valid) {
    const formValue = this.form.value;
    const login = formValue.login;
    const password = formValue.password;
    this.loginService
      .login(login, password)
      .subscribe({
        next: (response) => {
          this.loginService.setAuthToken(response.token);
          
          // Verifica o role e redireciona conforme necessário
          if (response.user?.role === 'ADMIN') {
            this.router.navigate(['/statistics']);
          } else if (response.user?.role === 'USER') {
            console.log('chegou aaqui ',  response.user?.role );
            
            this.router.navigate(['/lab']); // ou a rota que usuários comuns devem acessar
          } else {
            // Role não reconhecido, redireciona para uma página padrão
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Erro no login:', err);

          if (err.status === 401) {
            this.showToast('Usuário ou senha inválidos!', 'error');
          } else {
            this.showToast('Erro ao realizar login. Tente novamente.', 'error');
          }
        },
      });
  } else {
    this.showToast('Por favor, preencha todos os campos.', 'warning');
  }
}

  private showToast(message: string, type: 'error' | 'warning') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top', 
      horizontalPosition: 'center', 
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-warning'],
    });
  }
  
}

