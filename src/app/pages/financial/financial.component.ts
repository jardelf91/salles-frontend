import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order/order.service';

interface CashFlowByDay {
  date: string;
  revenue: number;
  expenses: number;
}

interface SalesByPaymentMethod {
  paymentMethod: string;
  total: number;
}

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
  totalRevenue: number = 0; // Receita total
  totalExpenses: number = 0; // Despesas totais
  balance: number = 0; // Saldo final
  cashFlowByDay: CashFlowByDay[] = [];
  salesByPaymentMethod: SalesByPaymentMethod[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadFinancialData();
  }

  loadFinancialData(): void {
    this.orderService.findAll(0, 100).subscribe(
      (response: any) => {
        const orders = response.result;
        this.totalRevenue = this.calculateTotalRevenue(orders);
        this.totalExpenses = this.calculateTotalExpenses(orders);
        this.balance = this.totalRevenue - this.totalExpenses;
        this.cashFlowByDay = this.calculateCashFlowByDay(orders);
        this.salesByPaymentMethod = this.calculateSalesByPaymentMethod(orders);
      },
      (error) => {
        console.error('Erro ao carregar dados financeiros', error);
        alert('Erro ao carregar os dados financeiros. Tente novamente mais tarde.');
      }
    );
  }

  // Método para calcular a receita total
  calculateTotalRevenue(orders: any[]): number {
    return orders.reduce((acc: number, order: any) => acc + this.parseValue(order.total), 0);
  }

  // Método para calcular as despesas totais
  calculateTotalExpenses(orders: any[]): number {
    return orders.reduce((acc: number, order: any) => acc + this.parseValue(order.expenses || 0), 0);
  }

  // Método para calcular o fluxo de caixa por dia
  calculateCashFlowByDay(orders: any[]): CashFlowByDay[] {
    const cashFlow = orders.reduce((acc: any, order: any) => {
      const date = new Date(order.orderDate).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, revenue: 0, expenses: 0 };
      acc[date].revenue += this.parseValue(order.total);
      acc[date].expenses += this.parseValue(order.expenses || 0);
      return acc;
    }, {});

    return Object.values(cashFlow); // Retorna diretamente os valores do objeto
  }

  // Método para calcular as vendas por método de pagamento
  calculateSalesByPaymentMethod(orders: any[]): SalesByPaymentMethod[] {
    const sales = orders.reduce((acc: any, order: any) => {
      const method = order.paymentMethod?.method || 'Não informado';
      if (!acc[method]) acc[method] = 0;
      acc[method] += this.parseValue(order.total);
      return acc;
    }, {});

    return Object.keys(sales).map(paymentMethod => ({
      paymentMethod,
      total: sales[paymentMethod]
    }));
  }

  // Método para garantir que o valor seja numérico
  parseValue(value: any): number {
    return !isNaN(value) ? parseFloat(value) : 0;
  }
}
