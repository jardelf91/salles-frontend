import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit {
  // Estados de visualização
  showLogin = false;
  showRegister = false;
  showCalendar = false;
  
  // Laboratório selecionado
  selectedLab: any = null;
  
  // Dados de formulário
  loginData = {
    email: '',
    password: ''
  };
  
  registerData = {
    name: '',
    cpf: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  // Dados do calendário
  currentMonth: Date = new Date();
  calendarDays: Date[] = [];
  selectedDate: Date | null = null;
  selectedTime: any = null;
  availableTimes: any[] = [];

  // Controle de agendamentos ativos
  hasActiveBooking = false;
  activeBooking: any = null;

  // Dados dos laboratórios
  labs = [
    {
      id: 1,
      name: 'Laboratório de Biologia',
      description: 'Equipamentos modernos para análises biológicas e genéticas.',
      image: 'https://placehold.co/600x400/3498db/ffffff?text=Lab+Biologia'
    },
    {
      id: 2,
      name: 'Laboratório de Química',
      description: 'Análises químicas com equipamentos de última geração.',
      image: 'https://placehold.co/600x400/e74c3c/ffffff?text=Lab+Química'
    },
    {
      id: 3,
      name: 'Laboratório de Física',
      description: 'Espaço equipado para experimentos e pesquisas físicas.',
      image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Lab+Física'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.generateCalendar();
    this.checkActiveBookings();
  }

  // Verifica se há agendamentos ativos
  checkActiveBookings(): void {
    // Simulação - na prática, você buscaria isso de um serviço
    const savedBooking = localStorage.getItem('activeBooking');
    if (savedBooking) {
      this.activeBooking = JSON.parse(savedBooking);
      this.hasActiveBooking = true;
      this.simulateProgress(); // Inicia a simulação de progresso
    }
  }

  // Navegação
  scrollToLabs(): void {
    const labsSection = document.getElementById('labsSection');
    if (labsSection) {
      labsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Controle de formulários
  showLoginForm(): void {
    this.showLogin = true;
    this.showRegister = false;
  }

  showRegisterForm(): void {
    this.showLogin = false;
    this.showRegister = true;
  }

  onLoginSubmit(): void {
    console.log('Dados de login:', this.loginData);
    // Aqui você implementaria a lógica de autenticação
    alert('Login realizado com sucesso!');
    this.showLogin = false;
  }

  onRegisterSubmit(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    console.log('Dados de registro:', this.registerData);
    // Aqui você implementaria a lógica de registro
    alert('Conta criada com sucesso!');
    this.showRegister = false;
  }

viewSchedule(lab: any): void {
  // Verifica se já existe um agendamento ativo E não está concluído
  if (this.hasActiveBooking && this.activeBooking.currentStep < 5) {
    alert('Você já possui um agendamento ativo. Acompanhe o andamento na seção de Acompanhamento.');
    return;
  }
  
  // Se está concluído, limpa o agendamento anterior
  if (this.hasActiveBooking && this.activeBooking.currentStep === 5) {
    this.hasActiveBooking = false;
    this.activeBooking = null;
    localStorage.removeItem('activeBooking');
  }
  
  this.selectedLab = lab;
  this.showCalendar = true;
  this.generateCalendar();
}

  closeCalendar(): void {
    this.showCalendar = false;
    this.selectedLab = null;
    this.selectedDate = null;
    this.selectedTime = null;
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    this.calendarDays = [];
    
    // Preencher dias do mês anterior (se necessário)
    const startingDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const date = new Date(year, month, 1 - i);
      this.calendarDays.unshift(date);
    }
    
    // Dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.calendarDays.push(new Date(year, month, i));
    }
    
    // Preencher dias do próximo mês (se necessário)
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      this.calendarDays.push(new Date(year, month + 1, i));
    }
    
    // Gerar horários disponíveis
    this.generateAvailableTimes();
  }

  changeMonth(direction: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + direction,
      1
    );
    this.generateCalendar();
    this.selectedDate = null;
    this.selectedTime = null;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }

  isUnavailable(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Datas passadas não estão disponíveis
    if (date < today) {
      return true;
    }
    
    // Finais de semana não estão disponíveis
    if (date.getDay() === 0 || date.getDay() === 6) {
      return true;
    }
    
    return false;
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    return date.getDate() === this.selectedDate.getDate() && 
           date.getMonth() === this.selectedDate.getMonth() && 
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  selectDate(date: Date): void {
    if (this.isUnavailable(date)) return;
    
    this.selectedDate = date;
    this.selectedTime = null;
    this.generateAvailableTimes();
  }

  generateAvailableTimes(): void {
    this.availableTimes = [];
    
    if (!this.selectedDate) return;
    
    // Gerar horários das 8h às 17h
    for (let hour = 8; hour <= 17; hour++) {
      // Horários cheios (ex: 8:00, 9:00)
      this.availableTimes.push({
        value: `${hour}:00`,
        available: Math.random() > 0.3
      });
      
      // Horários de meia hora (ex: 8:30, 9:30)
      if (hour < 17) {
        this.availableTimes.push({
          value: `${hour}:30`,
          available: Math.random() > 0.4
        });
      }
    }
  }

  isTimeSelected(time: any): boolean {
    return this.selectedTime === time;
  }

  selectTime(time: any): void {
    if (!time.available) return;
    this.selectedTime = time;
  }

  confirmBooking(): void {
    if (!this.selectedLab || !this.selectedDate || !this.selectedTime) return;
    
    // Cria o objeto de agendamento
    const bookingData = {
      labName: this.selectedLab.name,
      date: this.selectedDate.toLocaleDateString('pt-BR'),
      time: this.selectedTime.value,
      bookingDate: new Date(),
      currentStep: 1,
      step1Date: new Date(), // Agendamento confirmado
      step2Date: null, // Equipamento enviado
      step3Date: null, // Testes em andamento
      step4Date: null, // Resultados prontos
      step5Date: null  // Equipamento retornado
    };
    
    // Salva no localStorage (simulação)
    localStorage.setItem('activeBooking', JSON.stringify(bookingData));
    
    console.log('Agendamento confirmado:', bookingData);
    alert(`Agendamento confirmado!\nLaboratório: ${bookingData.labName}\nData: ${bookingData.date}\nHorário: ${bookingData.time}`);
    
    // Atualiza a interface
    this.activeBooking = bookingData;
    this.hasActiveBooking = true;
    
    // Inicia a simulação de progresso
    this.simulateProgress();
    
    this.closeCalendar();
  }

  // Métodos para o acompanhamento
  getStepClass(stepNumber: number): string {
    if (!this.activeBooking) return 'pending';
    
    if (this.activeBooking.currentStep > stepNumber) {
      return 'completed';
    } else if (this.activeBooking.currentStep === stepNumber) {
      return 'in-progress';
    } else {
      return 'pending';
    }
  }

  getStepIcon(stepNumber: number): string {
    const stepClass = this.getStepClass(stepNumber);
    
    switch (stepClass) {
      case 'completed':
        return 'fa-check';
      case 'in-progress':
        return 'fa-sync-alt fa-spin';
      default:
        return 'fa-clock';
    }
  }

  getStatusText(): string {
    if (!this.activeBooking) return 'Pendente';
    
    switch (this.activeBooking.currentStep) {
      case 1: return 'Agendado';
      case 2: return 'Enviado';
      case 3: return 'Em Teste';
      case 4: return 'Resultado Pronto';
      case 5: return 'Concluído';
      default: return 'Pendente';
    }
  }

  getStatusBadgeClass(): string {
    if (!this.activeBooking) return 'badge-pending';
    
    switch (this.activeBooking.currentStep) {
      case 1: return 'badge badge-pending';
      case 2: 
      case 3: return 'badge badge-in-progress';
      case 4: 
      case 5: return 'badge badge-completed';
      default: return 'badge badge-pending';
    }
  }

  downloadResults(): void {
    if (this.activeBooking.currentStep >= 4) {
      alert('Download dos resultados iniciado...');
      // Aqui você implementaria o download real dos resultados
    } else {
      alert('Os resultados ainda não estão disponíveis.');
    }
  }

  cancelTracking(): void {
    this.hasActiveBooking = false;
    this.activeBooking = null;
    localStorage.removeItem('activeBooking');
  }

  // Simulação de progresso (apenas para demonstração)
simulateProgress(): void {
  if (!this.activeBooking) return;

  const intervals = [
    { step: 2, delay: 5000 },   // 5 segundos
    { step: 3, delay: 10000 },  // 10 segundos
    { step: 4, delay: 15000 },  // 15 segundos
    { step: 5, delay: 20000 }   // 20 segundos
  ];

  intervals.forEach(interval => {
    setTimeout(() => {
      if (this.activeBooking && this.activeBooking.currentStep < interval.step) {
        this.activeBooking.currentStep = interval.step;
        this.activeBooking[`step${interval.step}Date`] = new Date();
        
        // Atualiza no localStorage
        localStorage.setItem('activeBooking', JSON.stringify(this.activeBooking));
        
        // Se chegou no último step (concluído), mostra mensagem
        if (interval.step === 5) {
          setTimeout(() => {
            alert('Processo concluído! Agora você pode fazer um novo agendamento.');
          }, 1000);
        }
      }
    }, interval.delay);
  });
}

finalizeBooking(): void {
  if (this.activeBooking) {
    // Marca como concluído
    this.activeBooking.currentStep = 5;
    this.activeBooking.step5Date = new Date();
    localStorage.setItem('activeBooking', JSON.stringify(this.activeBooking));
    
    alert('Processo finalizado! Agora você pode fazer um novo agendamento.');
  }
}

}