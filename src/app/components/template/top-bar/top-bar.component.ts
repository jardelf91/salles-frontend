import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  nameStore: string = 'Loja Team';
  logo: string = 'assets/imagem/Internapp-icon.svg';
  constructor(){

  }
}
