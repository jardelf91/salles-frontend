import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppSacolaService } from './app-sacola.service';
import { CustomersService } from 'src/app/pages/customers/customers.service';

@Component({
  selector: 'app-app-sacola',
  templateUrl: './app-sacola.component.html',
  styleUrls: ['./app-sacola.component.css'],
})
export class AppSacolaComponent {
  @Input() itensNaSacola: any[] = [];
  @Input() modalAberto: boolean = true;
  @Output() fecharModals: EventEmitter<void> = new EventEmitter<void>();
  @Output() limparProdutosSalles: EventEmitter<void> = new EventEmitter<void>();
  telefoneClienteInput: string = '';
  paymentMethodId : number = 0;

  opcaoPagamentoSelecionada: string | null = null;
  mensagemPedido: string = '';
  numeroPedido: number = 0;
  nomeCliente: string = '';
  enderecoCliente: string = '';
  numberCliente: string = '';
  telefoneCliente: string = '';
  bairro: string = '';
  formaPagamento: string = '';
  showFormClient: boolean = false;
  clientForm: any;
  customerId: number | null = null;
  telefoneBloqueado: boolean = false;
  isButtonDisabled: boolean = true;

  constructor(
    private sacolaService: AppSacolaService,
    private customersService: CustomersService
  ) {}

  verificarClientePorTelefone() {
    const telefone = this.telefoneClienteInput.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!telefone || telefone.length < 10) {
      alert('Por favor, insira um telefone válido.');
      return;
    }

    this.customersService.findOne(`phone/${telefone}`).subscribe(
      (response) => {
        console.log('Dados recebidos da API:', response);

        // Se o retorno for um array, pegue o primeiro item
        const cliente = Array.isArray(response) ? response[0] : response;

        if (cliente) {
          console.log(cliente, 'client');

          this.customerId = cliente.id;
          this.nomeCliente = cliente.name;
          this.enderecoCliente = cliente.address;
          this.numberCliente = cliente.number;
          this.telefoneCliente = cliente.phone;
          this.bairro = cliente.district;
          this.telefoneBloqueado = true;
        } else {
          this.openFormClient();
        }
      },
      (error) => {
        console.error('Erro ao buscar cliente:', error);
        alert('Erro ao buscar cliente. Tente novamente.');
      }
    );
  }

  onInputChangePhone(event: any): void {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value.replace(/\D/g, '');

    if (inputValue.length > 2) {
      inputValue = `(${inputValue.slice(0, 2)}) ${inputValue.slice(2)}`;
    }
    if (inputValue.length > 10) {
      inputValue = `${inputValue.slice(0, 10)}-${inputValue.slice(10)}`;
    }

    this.telefoneClienteInput = inputValue;
  }

  adicionarItem(item: any) {
    const itemNaSacola = this.itensNaSacola.find((i) => i.id === item.id);
    if (itemNaSacola) {
      itemNaSacola.quantidade++;
    } else {
      this.itensNaSacola.push({ ...item, quantidade: 1 });
    }
  }

  removerItem(item: any) {
    const itemNaSacola = this.itensNaSacola.find((i) => i.id === item.id);
    if (itemNaSacola) {
      if (itemNaSacola.quantidade > 1) {
        itemNaSacola.quantidade--;
      } else {
        this.itensNaSacola = this.itensNaSacola.filter((i) => i.id !== item.id);
      }
    }

    if (this.itensNaSacola.length === 0) {
      this.modalAberto = false;
      this.fecharModal();
      this.limparProdutosSalles.emit();
    }
  }

  enviarPedido(opcao: string) {
    this.opcaoPagamentoSelecionada =
      this.opcaoPagamentoSelecionada === opcao ? null : opcao;
    this.formaPagamento = this.opcaoPagamentoSelecionada || '';

    switch (this.opcaoPagamentoSelecionada) {
      case 'PIX':
        this.paymentMethodId = 10; // ID para PIX
        break;
      case 'Cartão':
        this.paymentMethodId = 9; // ID para Cartão de Crédito
        break;
      case 'Dinner':
        this.paymentMethodId = 11; // ID para Dinner
        break;
      default:
        this.paymentMethodId = 9; // ID padrão, caso nenhuma opção seja selecionada
        break;
    }
  }

  calcularValorTotal() {
    // Certifique-se de que o total retornado seja um número puro
    const total = this.itensNaSacola.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
    console.log('resultado', total);
    return parseFloat(total.toFixed(2));
    
  
    // Retorna o total com 2 casas decimais como número
  }

  receberform(cliente: any) {
    console.log('Dados do cliente cadastrados:', cliente);
    this.customerId = cliente.id;
    this.nomeCliente = cliente.name;
    this.enderecoCliente = cliente.address;
    this.telefoneCliente = cliente.telefone;
    this.numberCliente = cliente.num;
    this.bairro = cliente.bairro;

    this.showFormClient = false;
  }


  finalizarPedido() {
    this.telefoneBloqueado = true;
    if (this.telefoneBloqueado === true) {
      this.isButtonDisabled = false;
      const pedido = {
        customerId: this.customerId,
        items: this.itensNaSacola.map((item) => ({
          productId: item.id,
          quantity: item.quantidade,
          price: item.preco,
          totalPrice: item.quantidade * item.preco,
        })),
        paymentMethodId: this.paymentMethodId,
        total: this.calcularValorTotal()
      };

      console.log('Pedido enviado para API:', pedido);

      this.sacolaService.create(pedido, '/orders').subscribe(
        (response) => {
          console.log('Pedido salvo com sucesso na API:', response);
         
         
          this.enviarParaWhatsapp();
          
        },
        (error) => {
          console.error('Erro ao salvar pedido na API:', error);

          if (error.status === 400) {
            alert('Erro de validação. Verifique os dados do pedido.');
          } else if (error.status === 500) {
            alert('Erro interno no servidor. Tente novamente mais tarde.');
          } else {
            alert(
              'Erro ao processar o pedido. Entre em contato com o suporte.'
            );
          }
        }
      );
    }
    this.telefoneBloqueado = true;
  }

  

  // enviarParaWhatsapp() {
  //   const np = (this.numeroPedido += 1);

  //   this.mensagemPedido = `*🛒 Pedido #${np} de ${this.nomeCliente}*\n\n`;
  //   this.mensagemPedido += `Olá! Muito boas-vindas ao Estabelecimento.\n\n`;

  //   this.itensNaSacola.forEach((item) => {
  //     this.mensagemPedido += `*🍔 Pedido: ${item.nome}*\n`;
  //     this.mensagemPedido += `- *Quantidade:* ${item.quantidade}\n`;
  //     this.mensagemPedido += `- *Preço:* R$ ${item.preco}\n`;
  //     this.mensagemPedido += `- *Descrição:* ${item.itens}\n\n`;
  //   });

  //   this.mensagemPedido += `*💰 Total: R$ ${this.calcularValorTotal()} Reais*\n`;
  //   this.mensagemPedido += `----------------------------------\n`;
  //   this.mensagemPedido += `*Forma de Pagamento:* ${this.formaPagamento}\n`;
  //   this.mensagemPedido += `----------------------------------\n`;
  //   this.mensagemPedido += `*🚚 Endereço de Entrega*\n`;
  //   this.mensagemPedido += `*Endereço:* ${this.enderecoCliente}\n`;
  //   this.mensagemPedido += `*Nr:* ${this.numberCliente}\n`;
  //   this.mensagemPedido += `*Bairro:* ${this.bairro}\n`;
  //   this.mensagemPedido += `*📞 Telefone de Contato:* ${this.telefoneCliente}\n\n`;
  //   this.mensagemPedido += `*Sua satisfação é nosso principal objetivo!* 😊 😘\n`;

  //   const enderecoEntrega = `${this.enderecoCliente}, ${this.numberCliente}, ${this.bairro}`;
  //   const enderecoCodificado = encodeURIComponent(enderecoEntrega);
  //   const urlGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`;
  //   const mensagemCodificada = encodeURIComponent(this.mensagemPedido);

  //   const mensagemComMapa = `${mensagemCodificada}\n\n*Localização no Google Maps:*\n${urlGoogleMaps}`;
  //   const partesDaMensagem = this.dividirMensagem(mensagemComMapa, 7700);

  //   partesDaMensagem.forEach((parte, index) => {
  //     const mensagemParaEnviar = encodeURIComponent(parte);
  //     const delay = index * 2000;

  //     setTimeout(() => {
  //       window.open(
  //         `https://api.whatsapp.com/send?phone=92985497489&text=${mensagemParaEnviar}`
  //       );
  //     }, delay);
  //   });
  // }

  enviarParaWhatsapp() {
    //const np = (this.numeroPedido += 1);
  
    this.mensagemPedido = `*🛒 Cliente ${this.nomeCliente}*\n\n`;
    this.mensagemPedido += `Olá! Muito boas-vindas ao Estabelecimento.\n\n`;
  
    this.itensNaSacola.forEach((item) => {

      console.log("ver o que tem ", item);
      
      let emojiProduto = '🍔'; // Emoji padrão (hamburguer)
      
      // Substituindo o emoji conforme o tipo de produto
      if (item.nome.toLowerCase().includes('pizza')) {
        emojiProduto = '🍕'; // Pizza
      } else if (item.nome.toLowerCase().includes('sorvete')) {
        emojiProduto = '🍦'; // Sorvete
      } else if (item.nome.toLowerCase().includes('feijão')) {
        emojiProduto = '🍲'; // Feijão
      } else if (item.nome.toLowerCase().includes('bebida')) {
        emojiProduto = '🥤'; // Bebida
      } else if (item.nome.toLowerCase().includes('carne')) {
        emojiProduto = '🍖'; // Carne
      }
  
      this.mensagemPedido += `*${emojiProduto} Pedido: ${item.nome}*\n`;
      this.mensagemPedido += `- *Quantidade:* ${item.quantidade}\n`;
      this.mensagemPedido += `- *Preço:* R$ ${item.preco}\n`;
      this.mensagemPedido += `- *Descrição:* ${item.itens}\n\n`;
    });
  
    this.mensagemPedido += `*💰 Total: R$ ${this.calcularValorTotal()} Reais*\n`;
    this.mensagemPedido += `----------------------------------\n`;
    this.mensagemPedido += `*Forma de Pagamento:* ${this.formaPagamento}\n`;
    this.mensagemPedido += `----------------------------------\n`;
    this.mensagemPedido += `*🚚 Endereço de Entrega*\n`;
    this.mensagemPedido += `*Endereço:* ${this.enderecoCliente}\n`;
    this.mensagemPedido += `*Nr:* ${this.numberCliente}\n`;
    this.mensagemPedido += `*Bairro:* ${this.bairro}\n`;
    this.mensagemPedido += `*📞 Telefone de Contato:* ${this.telefoneCliente}\n\n`;
    this.mensagemPedido += `*Sua satisfação é nosso principal objetivo!* 😊 😘\n`;
  
    // Codifique a URL do Google Maps
    const enderecoEntrega = `${this.enderecoCliente}, ${this.numberCliente}, ${this.bairro}`;
    const enderecoCodificado = encodeURIComponent(enderecoEntrega);
    const urlGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`;
  
    // A mensagem codificada apenas no final
    const mensagemComMapa = `${this.mensagemPedido}\n\n*Localização no Google Maps:*\n${urlGoogleMaps}`;
  
    // Divida a mensagem se necessário
    const partesDaMensagem = this.dividirMensagem(mensagemComMapa, 7700);
  
    partesDaMensagem.forEach((parte, index) => {
      const mensagemParaEnviar = encodeURIComponent(parte);
      const delay = index * 2000;
  
      setTimeout(() => {
        window.open(
          `https://api.whatsapp.com/send?phone=92985497489&text=${mensagemParaEnviar}`
        );
      }, delay);
    });
  }
  

  dividirMensagem(mensagem: string, tamanhoMaximo: number): string[] {
    const partes: string[] = [];
    let parteAtual = '';

    mensagem.split('\n').forEach((linha) => {
      if (parteAtual.length + linha.length <= tamanhoMaximo) {
        parteAtual += linha + '\n';
      } else {
        partes.push(parteAtual);
        parteAtual = linha + '\n';
      }
    });

    partes.push(parteAtual);
    return partes;
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.fecharModals.emit();
  }

  openFormClient() {
    this.showFormClient = true;
  }
}
