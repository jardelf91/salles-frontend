import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  @Input() showPasswordRecoveryModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  closePasswordRecovery() {
    console.log('chegouaqui1');
    
    this.showPasswordRecoveryModal = false;
  }
}
