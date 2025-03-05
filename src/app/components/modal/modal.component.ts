import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() visible = false; // Controla a visibilidade do modal
  @Input() title = 'Confirmação'; // Título do modal
  @Input() message = 'Deseja confirmar esta ação?'; // Mensagem de confirmação

  @Output() onConfirm = new EventEmitter<void>(); // Evento para confirmação
  @Output() onCancel = new EventEmitter<void>(); // Evento para cancelamento

  confirm(): void {
    this.onConfirm.emit(); // Emite o evento de confirmação
    this.visible = false; // Fecha o modal
  }

  cancel(): void {
    this.onCancel.emit(); // Emite o evento de cancelamento
    this.visible = false; // Fecha o modal
  }
}
