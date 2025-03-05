import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomersService } from '../customers/customers.service';
import { PaymentService } from '../payment-methods/payment.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  totalOrders: number = 0;
  searchTerm: string = '';

  
  currentPage = 0;
  totalPages = 1;

  constructor(
    private orderService: OrderService,
    private customerService: CustomersService,
    private paymentMethodService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadOrders(this.currentPage);
  }

  loadOrders(page: number): void {
    this.orderService.findAll(page).subscribe(
      (response: any) => {
        const orders = response.result;
        this.totalOrders = response.total;
        this.totalPages = Math.ceil(this.totalOrders / 5); // Supondo que o tamanho da página seja 5

        const ordersWithDetails$: Observable<any>[] = orders.map((order: any) =>
          forkJoin({
            customer: this.customerService.findOne(order.customerId),
            paymentMethod: this.paymentMethodService.findOne(order.paymentMethodId),
          }).pipe(
            map(({ customer, paymentMethod }) => ({
              ...order,
              customerName: (customer as any)?.name || 'Não informado',
              paymentMethodName: (paymentMethod as any)?.method || 'Não informado',
            }))
          )
        );

        forkJoin(ordersWithDetails$).subscribe(
          (detailedOrders: any[]) => {
            this.orders = detailedOrders;
            this.filteredOrders = detailedOrders;
          },
          (error) => {
            console.error('Erro ao buscar detalhes dos pedidos:', error);
          }
        );
      },
      (error) => {
        console.error('Erro ao buscar pedidos:', error);
      }
    );
  }

  

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders(this.currentPage);
    }
  }

  // Método para carregar a página anterior
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders(this.currentPage);
    }
  }


  filterOrders(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => 
        order.id.toString().includes(this.searchTerm) || 
        order.customer?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        order.customer?.phone.includes(this.searchTerm)
      );
    }
  }

  printOrder(order: any): void {
    const printWindow: Window | null = window.open('', '', 'height=600,width=400');
  
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cupom de Pedido #${order.id}</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                font-size: 14px;
                margin: 0;
                padding: 0;
                width: 100%;
                background-color: #fff;
                text-align: center;
              }
              .container {
                width: 100%;
                margin: 0 auto;
                padding: 10px;
                border: 1px solid #000;
                max-width: 300px;
                background-color: #fff;
                font-size: 12px;
              }
              .header {
                font-size: 16px;
                font-weight: bold;
                padding-bottom: 10px;
                border-bottom: 2px solid #000;
                margin-bottom: 10px;
              }
              .section {
                margin-bottom: 5px;
              }
              .section label {
                font-weight: bold;
                width: 40%;
                display: inline-block;
              }
              .section p {
                display: inline-block;
                width: 55%;
                margin-left: 5%;
              }
              .order-details {
                padding: 10px;
                margin-top: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
                text-align: left;
              }
              .order-details p {
                margin: 3px 0;
                font-size: 12px;
              }
              .footer {
                margin-top: 10px;
                font-size: 10px;
                padding-top: 5px;
                border-top: 1px solid #000;
                color: #777;
              }
              .items-table {
                width: 100%;
                margin-top: 10px;
                border-collapse: collapse;
              }
              .items-table th, .items-table td {
                padding: 4px;
                border: 1px solid #ddd;
                text-align: left;
              }
              .items-table th {
                background-color: #f0f0f0;
                font-weight: bold;
              }
              .items-table td {
                font-size: 12px;
              }
              .qr-code {
                margin-top: 10px;
              }
              @media print {
                body {
                  font-size: 12px;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 100%;
                  padding: 0;
                  border: none;
                  max-width: 300px;
                }
                .footer {
                  font-size: 10px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                CUPOM DE PEDIDO #${order.id}
              </div>
  
              <div class="section">
                <label>Cliente:</label>
                <p>${order.customer?.name || 'Não informado'}</p>
              </div>
  
              <div class="section">
                <label>Endereço:</label>
                <p>${order.customer?.address || 'Não informado'}</p>
              </div>
  
              <div class="section">
                <label>Telefone:</label>
                <p>${order.customer?.phone || 'Não informado'}</p>
              </div>
  
              <div class="section">
                <label>Pagamento:</label>
                <p>${order.paymentMethod?.method || 'Não informado'}</p>
              </div>
  
              <div class="order-details">
                <p><strong>Total:</strong> R$ ${order.total}</p>
                <p><strong>Status:</strong> ${order.status || 'Em andamento'}</p>
                <p><strong>Data do Pedido:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
              </div>
  
              <div class="order-details">
                <h3>Itens:</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.items.map((item: any) => `
                      <tr>
                        <td>${item.product.name}</td>
                        <td>${item.quantity}</td>
                        <td>R$ ${item.totalPrice}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
  
              <div class="footer">
                <p>Obrigado pela sua compra!</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      console.error('A janela de impressão não pôde ser aberta.');
    }
  }
  
  

  sendNotification(order: any): void {
    // Exemplo de notificação. Em um sistema real, você faria uma chamada de API para enviar a mensagem
    const message = `Seu pedido #${order.id} está sendo preparado. Acompanhe seu pedido!`;
    
    alert(`Notificação enviada para ${order.customer?.phone}: ${message}`);
     window.open(`https://wa.me/${order.customer?.phone}?text=${encodeURIComponent(message)}`);
  }
}
