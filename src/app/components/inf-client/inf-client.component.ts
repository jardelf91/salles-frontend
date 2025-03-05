import { CustomersService } from 'src/app/pages/customers/customers.service';
import { ApiCepService } from './../app-sacola/api-cep.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inf-client',
  templateUrl: './inf-client.component.html',
  styleUrls: ['./inf-client.component.css']
})
export class InfClientComponent {
  @Input() modalAberto: boolean = true;
  @Output() fecharModals: EventEmitter<void> = new EventEmitter<void>();
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private cepService: ApiCepService, private customerService: CustomersService) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      telefone: [''],
      cep: [''],
      address: [''],
      num: [''],
      bairro: ['']
    });
  }

  buscarCep() {
    const cepControl = this.form.get('cep');
    if (cepControl && cepControl.value && cepControl.value.length === 8) {
      const cep = cepControl.value;
      this.cepService.getEnderecoByCep(cep).subscribe(data => {
        this.form.patchValue({
          address: data.logradouro,
          bairro: data.bairro
          
        });
      });
    }
  }

  onInputChange(event: any) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const numericValue = inputValue.replace(/\D/g, '');
    this.form.get('cep')?.setValue(numericValue);
  }

  onInputChangeNum(event: any) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const numericValue = inputValue.replace(/\D/g, '');
    this.form.get('num')?.setValue(numericValue);
  }
  
  onInputChangePhone(event: any) {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;
    inputValue = inputValue.replace(/\D/g, '');
    if (inputValue.length >= 2) {
      inputValue = `(${inputValue.slice(0, 2)}) ${inputValue.slice(2)}`;
    }
    if (inputValue.length >= 10) {
      inputValue = `${inputValue.slice(0, 10)}-${inputValue.slice(10)}`;
    }
    this.form.get('telefone')?.setValue(inputValue);
  }
  
  sendForm(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
  
      // Preparar o objeto cliente para envio
      const cliente = {
        name: formValue.name,
        address: formValue.address,
        number: formValue.num,
        district: formValue.bairro,
        phone: formValue.telefone
      };
  
      // Enviar os dados ao CustomerService
      this.customerService.create(cliente).subscribe(
        (response) => {
          console.log('Cliente salvo com sucesso:', response);
  
          // Incluir o id retornado no cliente emitido para o componente pai
          const clienteComId = {
            ...cliente,
            id: response.id // Capturar o ID retornado pela API
          };
  
          this.formSubmit.emit(clienteComId); // Emitir os dados com o ID para o componente pai
          this.modalAberto = false;
          this.fecharModals.emit();
        },
        (error) => {
          console.error('Erro ao salvar cliente:', error);
          alert('Erro ao salvar cliente. Tente novamente.');
        }
      );
    }
  }
  

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.fecharModals.emit();
  }
}
