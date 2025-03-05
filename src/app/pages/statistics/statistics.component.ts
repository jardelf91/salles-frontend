import { Component } from '@angular/core';
import { OrderService } from '../order/order.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  totalSales: number = 0;
  totalOrders: number = 0;
  averageTicket: number = 0;
  salesByDay: any[] = [];
  salesByPaymentMethod: any[] = [];
  salesByCustomer: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadSalesStatistics();
  }

  loadSalesStatistics(): void {
    this.orderService.findAll(0, 1000).subscribe( // Buscando até 1000 pedidos
      (response: any) => {
        const orders = response.result || [];
        this.totalOrders = orders.length;
        this.totalSales = orders.reduce((acc: number, order: any) => acc + this.parseValue(order.total), 0);
        this.averageTicket = this.totalOrders > 0 ? this.totalSales / this.totalOrders : 0;
  
        this.salesByDay = this.calculateSalesByDay(orders);
        this.salesByPaymentMethod = this.calculateSalesByPaymentMethod(orders);
        this.salesByCustomer = this.calculateSalesByCustomer(orders);
      },
      (error) => {
        console.error('Erro ao carregar pedidos para estatísticas', error);
      }
    );
  }
  

  calculateSalesByDay(orders: any[]): any[] {
    const sales = orders.reduce((acc: any, order: any) => {
      const date = new Date(order.orderDate).toLocaleDateString(); // Agrupar por dia
      if (!acc[date]) acc[date] = 0;
      acc[date] += this.parseValue(order.total);
      return acc;
    }, {});

    return Object.keys(sales).map(date => ({ date, total: sales[date] }));
  }

  calculateSalesByPaymentMethod(orders: any[]): any[] {
    const sales = orders.reduce((acc: any, order: any) => {
      const method = order.paymentMethod?.method || 'Não informado';
      if (!acc[method]) acc[method] = 0;
      acc[method] += this.parseValue(order.total);
      return acc;
    }, {});

    return Object.keys(sales).map(paymentMethod => ({ paymentMethod, total: sales[paymentMethod] }));
  }

  calculateSalesByCustomer(orders: any[]): any[] {
    const sales = orders.reduce((acc: any, order: any) => {
      const customerName = order.customer?.name || 'Não informado';
      if (!acc[customerName]) acc[customerName] = 0;
      acc[customerName] += this.parseValue(order.total);
      return acc;
    }, {});

    return Object.keys(sales).map(customerName => ({ name: customerName, total: sales[customerName] }));
  }

  // Função para verificar se é um número
  isNumber(value: any): boolean {
    return !isNaN(value) && typeof value === 'number';
  }

  // Função para formatar a data
  formatDate(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleDateString('pt-BR') : 'Data inválida';
  }

  // Função para garantir que o valor é um número válido
  parseValue(value: any): number {
    return !isNaN(value) ? parseFloat(value) : 0;
  }
}
