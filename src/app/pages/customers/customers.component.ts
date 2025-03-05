import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from './customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  showForm = false;
  exibirModal = false; // Controle para exibir o modal de confirmação
  customerForm: FormGroup;
  actionType: string = ''; // Define se a ação é de adição ou exclusão
  customerToDelete: any = null; // Armazena o cliente a ser excluído
  customerToAdd: any = null; // Armazena o cliente a ser adicionado

  constructor(private service: CustomersService, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      number: ['', [Validators.required, Validators.maxLength(10)]],
      district: ['', Validators.maxLength(50)],
      phone: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.service.findAll().subscribe((res: any) => {
      this.customers = res.result;
    });
  }

  toggleFormulario(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.customerForm.reset();
    }
  }

  adicionarCliente(): void {
    if (this.customerForm.valid) {
      this.customerToAdd = { ...this.customerForm.value };
      this.actionType = 'adicionar';  // Ação de adicionar
      this.toggleModal();  // Exibe o modal de confirmação
    }
  }

  confirmarExclusao(customer: any): void {
    this.customerToDelete = customer;
    this.actionType = 'excluir';  // Ação de excluir
    this.toggleModal();  // Exibe o modal de confirmação
  }

  toggleModal(): void {
    this.exibirModal = !this.exibirModal;
  }

  confirmarAcoes(): void {
    if (this.actionType === 'adicionar' && this.customerToAdd) {
      // Adiciona o cliente
      this.service.create(this.customerToAdd).subscribe(() => {
        this.getCustomers();
        this.toggleFormulario();  // Fecha o formulário
        this.toggleModal();  // Fecha o modal de confirmação
      });
    } else if (this.actionType === 'excluir' && this.customerToDelete) {
      // Exclui o cliente
      this.service.delete(this.customerToDelete.id.toString()).subscribe(() => {
        this.getCustomers();
        this.toggleModal();  // Fecha o modal de confirmação
      });
    }
  }

  cancelarAcoes(): void {
    console.log('Ação cancelada.');
    this.toggleModal();  // Fecha o modal sem fazer nada
  }
}
