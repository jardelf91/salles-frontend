import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any;
  constructor(
    private authService: AuthService,
    public uiService: UIService,
    private router: Router
  ) {}
  @Output() menuToggle = new EventEmitter<void>();
  ngOnInit(): void {
    this.user = this.authService.getDecodedToken();

    console.log(this.user, '2234');
  }

  menuAberto = false; // Controla a visibilidade do menu

  onMenuClick() {
    this.menuToggle.emit();
  }

  logout() {

    this.router.navigate(['/login']);
    //this.loginService.clearSession();
  }
  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
}
