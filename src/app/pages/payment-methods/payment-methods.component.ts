import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css'],
})
export class PaymentMethodsComponent implements OnInit {
  paymentMethods: any[] = [];
  showForm = false;
  showModal = false; // Controla a visibilidade do modal
  paymentMethodForm: FormGroup;

  constructor(private service: PaymentService, private fb: FormBuilder) {
    this.paymentMethodForm = this.fb.group({
      method: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
    });
  }

  ngOnInit(): void {
    this.getPaymentMethods();
  }

  getPaymentMethods(): void {
    this.service.findAll().subscribe((res: any) => {
      this.paymentMethods = res.result;
      console.log('paymentMethods', this.paymentMethods);
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.paymentMethodForm.reset(); // Limpa o formulário se o mesmo for fechado
  }

  addPaymentMethod(): void {
    if (this.paymentMethodForm.valid) {
      this.toggleModal(); // Exibe o modal de confirmação
    }
  }

  handleConfirm(): void {
    // Salva o método de pagamento após confirmação
    console.log(this.paymentMethodForm.value);
    this.service.create(this.paymentMethodForm.value).subscribe(() => {
      this.getPaymentMethods(); // Atualiza a lista de métodos de pagamento
      this.toggleForm(); // Fecha o formulário
      this.toggleModal(); // Fecha o modal
    });
  }

  handleCancel(): void {
    console.log('Ação cancelada!');
    this.toggleModal(); // Fecha o modal sem salvar
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  deletePaymentMethod(id: number): void {
    this.service.delete(id.toString()).subscribe(() => {
      this.getPaymentMethods(); 
    });
  }
}
