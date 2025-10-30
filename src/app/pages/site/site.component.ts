import { Component, AfterViewInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements AfterViewInit {
  isScrolled = false;
  showRecommendationModal = false;
  showRegistrationModal = false;
  showSuccessModal = false;
  showIndividualTestsModal = false;
  isLoading = false;
  progress = 0;
  private progressInterval: any;
  mensagemWhatsApp: string = '';
  selectedPlan: string = '';
  
  // Variáveis para ensaios individuais
  testsSearchTerm: string = '';
  selectedTestCategory: string = '';
  selectedTests: Test[] = [];
  filteredTests: { [key: string]: Test[] } = {};

  // Dados do formulário de contato
  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    profile: '',
    solution: '',
    comment: '',
    privacy: false
  };

  // Dados do formulário de registro
  registrationData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    cnpj: '',
    password: '',
    confirmPassword: '',
    terms: false,
    marketing: false
  };

  // Definições dos planos
  plans = {
    free: {
      name: 'Plano Free',
      price: 'R$ 0',
      features: [
        'Acesso básico ao LIS',
        'Agenda simples',
        'Suporte via e-mail',
        'Limite de 100 exames/mês',
        '1 usuário'
      ]
    },
    basic: {
      name: 'Plano Básico',
      price: 'R$ 99',
      features: [
        'Todos os recursos do Free',
        'Integração com WhatsApp',
        'Relatórios básicos',
        'Suporte chat (9h-18h)',
        'Ilimitado exames',
        '3 usuários'
      ]
    },
    pro: {
      name: 'Plano Pro',
      price: 'R$ 199',
      features: [
        'Todos os recursos do Básico',
        'Interfaceamento com equipamentos',
        'Business Intelligence',
        'Suporte prioritário',
        'Portal do paciente',
        '10 usuários'
      ]
    },
    premium: {
      name: 'Plano Premium',
      price: 'R$ 499',
      features: [
        'Todos os recursos do Pro',
        'Recursos para redes de labs',
        'Centralização de laudos',
        'Suporte 24/7 dedicado',
        'Customizações exclusivas',
        'Usuários ilimitados'
      ]
    }
  };

  // Catálogo completo de ensaios
  allTests: { [key: string]: Test[] } = {
    'elétricos': [
      { id: 'e1', name: 'Teste de Isolamento Elétrico', description: 'Verificação da resistência de isolamento', price: 'R$ 150', category: 'elétricos', priceValue: 150 },
      { id: 'e2', name: 'SAR', description: 'Taxa de Absorção Específica', price: 'R$ 300', category: 'elétricos', priceValue: 300 },
      { id: 'e3', name: 'Análises de Qualidade de Energia', description: 'Análise completa da qualidade energética', price: 'R$ 450', category: 'elétricos', priceValue: 450 },
      { id: 'e4', name: 'Battery Funcional', description: 'Teste funcional de baterias', price: 'R$ 200', category: 'elétricos', priceValue: 200 },
      { id: 'e5', name: 'Safety Requirements', description: 'Verificação de requisitos de segurança', price: 'R$ 350', category: 'elétricos', priceValue: 350 },
      { id: 'e6', name: 'Deep Discharge Test', description: 'Teste de descarga profunda', price: 'R$ 280', category: 'elétricos', priceValue: 280 },
      { id: 'e7', name: 'Charge & Discharge Test', description: 'Ciclo completo de carga e descarga', price: 'R$ 320', category: 'elétricos', priceValue: 320 },
      { id: 'e8', name: 'Teste de Isolamento de Superfície (SIR)', description: 'Resistência de isolamento superficial', price: 'R$ 180', category: 'elétricos', priceValue: 180 }
    ],
    'mecânicos': [
      { id: 'm1', name: 'Ensaios Dimensionais Mecânicos', description: 'Verificação de dimensões mecânicas', price: 'R$ 120', category: 'mecânicos', priceValue: 120 },
      { id: 'm2', name: 'Flexão Mecânica', description: 'Teste de resistência à flexão', price: 'R$ 190', category: 'mecânicos', priceValue: 190 },
      { id: 'm3', name: 'Ensaio Resistência a Impacto', description: 'Teste de impacto mecânico', price: 'R$ 220', category: 'mecânicos', priceValue: 220 },
      { id: 'm4', name: 'Teste de Dureza Rockwell', description: 'Medição de dureza Rockwell', price: 'R$ 95', category: 'mecânicos', priceValue: 95 },
      { id: 'm5', name: 'Drop Test', description: 'Teste de queda controlada', price: 'R$ 280', category: 'mecânicos', priceValue: 280 },
      { id: 'm6', name: 'Teste de Compressão', description: 'Resistência à compressão', price: 'R$ 170', category: 'mecânicos', priceValue: 170 },
      { id: 'm7', name: 'Resistência à Tração', description: 'Teste de tração máxima', price: 'R$ 210', category: 'mecânicos', priceValue: 210 },
      { id: 'm8', name: 'Torção Mecânica', description: 'Teste de resistência à torção', price: 'R$ 195', category: 'mecânicos', priceValue: 195 }
    ],
    'ambientais': [
      { id: 'a1', name: 'Dust Test', description: 'Teste de resistência à poeira', price: 'R$ 320', category: 'ambientais', priceValue: 320 },
      { id: 'a2', name: 'Ciclagem Térmica', description: 'Ciclos de temperatura controlada', price: 'R$ 450', category: 'ambientais', priceValue: 450 },
      { id: 'a3', name: 'Choque Térmico', description: 'Teste de choque térmico rápido', price: 'R$ 380', category: 'ambientais', priceValue: 380 },
      { id: 'a4', name: 'Névoa Salina (Salt Spray)', description: 'Teste de corrosão por névoa salina', price: 'R$ 290', category: 'ambientais', priceValue: 290 },
      { id: 'a5', name: 'IPX Test', description: 'Teste de proteção contra água', price: 'R$ 260', category: 'ambientais', priceValue: 260 },
      { id: 'a6', name: 'Sunlight UVA/UVB Test', description: 'Teste de resistência UV', price: 'R$ 340', category: 'ambientais', priceValue: 340 }
    ],
    'materiais': [
      { id: 'mt1', name: 'Teste Viscosidade', description: 'Medição de viscosidade do material', price: 'R$ 110', category: 'materiais', priceValue: 110 },
      { id: 'mt2', name: 'Metalografia', description: 'Análise microestrutural de metais', price: 'R$ 280', category: 'materiais', priceValue: 280 },
      { id: 'mt3', name: 'Microscopia Ótica', description: 'Análise por microscopia ótica', price: 'R$ 150', category: 'materiais', priceValue: 150 },
      { id: 'mt4', name: 'RX (Peça)', description: 'Radiografia de peça completa', price: 'R$ 420', category: 'materiais', priceValue: 420 },
      { id: 'mt5', name: 'XRF', description: 'Fluorescência de raios X', price: 'R$ 380', category: 'materiais', priceValue: 380 },
      { id: 'mt6', name: 'MEV', description: 'Microscopia eletrônica de varredura', price: 'R$ 520', category: 'materiais', priceValue: 520 },
      { id: 'mt7', name: 'FTIR', description: 'Espectroscopia no infravermelho', price: 'R$ 310', category: 'materiais', priceValue: 310 }
    ]
  };

  aiRecommendation = {
    recommendedPlan: 'Plano Pro',
    planPrice: 'R$ 199/mês',
    planHighlights: [
      'Interfaceamento com equipamentos',
      'Business Intelligence avançado',
      'Suporte prioritário 24/7',
      'Portal do paciente integrado'
    ],
    recommendedServices: [
      'Resistência à Tração - Fluorescência de Raio X',
      'MEV - Microscopia Digital',
      'Dureza Rockwell - Resistência à Compressão'
    ],
    analysis: 'Com base na sua descrição, identificamos que sua operação requer análises técnicas avançadas com interfaceamento de equipamentos. O Plano Pro oferece o equilíbrio ideal entre recursos técnicos e suporte especializado para laboratórios em crescimento.',
    confidenceLevel: 87
  };

  constructor(private http: HttpClient) {
    this.filteredTests = { ...this.allTests };
  }

  ngAfterViewInit() {
    this.checkScroll();
    this.setupIntersectionObserver();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  private setupIntersectionObserver() {
    const sections = document.querySelectorAll('.hero, .features, .plans, .stats, .contact, .footer');
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Métodos para ensaios individuais
  openIndividualTestsModal() {
    this.showIndividualTestsModal = true;
    this.selectedTests = [];
    this.filterTests();
  }

  closeIndividualTestsModal() {
    this.showIndividualTestsModal = false;
    this.testsSearchTerm = '';
    this.selectedTestCategory = '';
    this.selectedTests = [];
  }

  filterTests() {
    if (!this.testsSearchTerm && !this.selectedTestCategory) {
      this.filteredTests = { ...this.allTests };
      return;
    }

    this.filteredTests = {};
    
    Object.keys(this.allTests).forEach(category => {
      if (this.selectedTestCategory && category !== this.selectedTestCategory) {
        return;
      }

      this.filteredTests[category] = this.allTests[category].filter(test =>
        test.name.toLowerCase().includes(this.testsSearchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(this.testsSearchTerm.toLowerCase())
      );
    });
  }

  toggleTestSelection(test: Test) {
    const index = this.selectedTests.findIndex(t => t.id === test.id);
    if (index > -1) {
      this.selectedTests.splice(index, 1);
    } else {
      this.selectedTests.push(test);
    }
  }

  isTestSelected(test: Test): boolean {
    return this.selectedTests.some(t => t.id === test.id);
  }

  removeTest(test: Test) {
    this.selectedTests = this.selectedTests.filter(t => t.id !== test.id);
  }

  calculateTotal(): number {
    return this.selectedTests.reduce((total, test) => total + test.priceValue, 0);
  }

  proceedToCheckout() {
    if (this.selectedTests.length === 0) {
      alert('Selecione pelo menos um ensaio para continuar.');
      return;
    }

    console.log('Processando compra de ensaios:', this.selectedTests);
    
    // Aqui você implementaria a integração com o gateway de pagamento
    const total = this.calculateTotal();
    const testsList = this.selectedTests.map(test => test.name).join(', ');
    
    alert(`Redirecionando para pagamento PIX\nTotal: R$ ${total}\nEnsaios: ${testsList}`);
    
    // Fechar modal após iniciar checkout
    this.closeIndividualTestsModal();
  }

  // Métodos para o modal de registro
  openRegistrationModal(plan: string) {
    this.selectedPlan = plan;
    this.showRegistrationModal = true;
    
    // Reset do formulário
    this.registrationData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      cnpj: '',
      password: '',
      confirmPassword: '',
      terms: false,
      marketing: false
    };
  }

  closeRegistrationModal() {
    this.showRegistrationModal = false;
    this.selectedPlan = '';
  }

  submitRegistration() {
    console.log('Dados de registro:', this.registrationData);
    console.log('Plano selecionado:', this.selectedPlan);

    // Validações antes de enviar
    if (!this.isFormValid()) {
      return;
    }

    // Mostrar loading
    this.isLoading = true;

    // Preparar os dados para a API
    const userData = {
      email: this.registrationData.email,
      password: this.registrationData.password,
      enrollment: this.generateEnrollment(),
      name: this.registrationData.name,
      socialName: this.registrationData.name,
      role: this.getRoleFromPlan(this.selectedPlan),
      cpf: this.registrationData.cnpj || this.generateTempCpf(),
      plan: this.selectedPlan,
      company: this.registrationData.company
    };

    // Chamar a API
    this.registerUser(userData);
  }

  private isFormValid(): boolean {
    if (this.registrationData.password !== this.registrationData.confirmPassword) {
      alert('As senhas não coincidem!');
      return false;
    }

    if (this.registrationData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return false;
    }

    if (!this.registrationData.terms) {
      alert('Você deve aceitar os termos de uso!');
      return false;
    }

    return true;
  }

  private generateEnrollment(): string {
    // Gera um número de matrícula aleatório
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  private generateTempCpf(): string {
    // Gera um CPF temporário para testes - em produção, peça ao usuário
    return '00000000000';
  }

  private getRoleFromPlan(plan: string): string {
    // Define a role baseada no plano escolhido
    const roleMap: { [key: string]: string } = {
      'free': 'USER',
      'basic': 'USER',
      'pro': 'ADMIN',
      'premium': 'ADMIN'
    };
    return roleMap[plan] || 'USER';
  }

  private registerUser(userData: any) {
    this.http.post('http://localhost:3000/users', userData, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Cadastro realizado com sucesso:', response);
        
        // Salvar informações do usuário se necessário
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userPlan', this.selectedPlan);
        
        this.processRegistrationSuccess();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro no cadastro:', error);
        this.handleRegistrationError(error);
      }
    });
  }

  private processRegistrationSuccess() {
    this.showRegistrationModal = false;
    this.showSuccessModal = true;
    
    // Limpar dados do formulário
    this.registrationData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      cnpj: '',
      password: '',
      confirmPassword: '',
      terms: false,
      marketing: false
    };
  }

  private handleRegistrationError(error: any) {
    let errorMessage = 'Erro ao realizar cadastro. Tente novamente.';
    
    if (error.status === 400) {
      errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
    } else if (error.status === 409) {
      errorMessage = 'E-mail já cadastrado. Use outro e-mail ou faça login.';
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
    
    alert(errorMessage);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.selectedPlan = '';
  }

  redirectAfterSuccess() {
    if (this.selectedPlan === 'free') {
      // Redirecionar para login
      window.open('/login', '_blank');
    } else {
      // Redirecionar para pagamento PIX
      this.redirectToPixPayment();
    }
    this.closeSuccessModal();
  }

  redirectToPixPayment() {
    const paymentData = {
      plan: this.selectedPlan,
      amount: this.getPlanPrice(this.selectedPlan),
      email: this.registrationData.email,
      name: this.registrationData.name
    };

    // Simula redirecionamento para pagamento PIX
    console.log('Redirecionando para pagamento PIX:', paymentData);
    alert(`Redirecionando para pagamento PIX do ${this.getPlanName(this.selectedPlan)}`);
  }

  // Métodos auxiliares
  getPlanName(planKey: string): string {
    return this.plans[planKey as keyof typeof this.plans]?.name || 'Plano';
  }

  getPlanPrice(planKey: string): string {
    return this.plans[planKey as keyof typeof this.plans]?.price || 'R$ 0';
  }

  getPlanFeatures(planKey: string): string[] {
    return this.plans[planKey as keyof typeof this.plans]?.features || [];
  }

  // Métodos existentes do formulário de contato
  onSubmit() {
    console.log('Form submitted:', this.formData);
    this.processAIRecommendation();
    this.formData = { 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      profile: '', 
      solution: '', 
      comment: '', 
      privacy: false 
    };
  }

  processAIRecommendation() {
    this.showRecommendationModal = true;
    this.isLoading = true;
    this.progress = 0;

    console.log('Iniciando análise da IA...');

    const phase1 = setInterval(() => {
      this.progress += Math.random() * 8;
      
      if (this.progress >= 30) {
        this.progress = 30;
        clearInterval(phase1);
        console.log('Fase 1 concluída - Análise inicial');
        this.startPhase2();
      }
    }, 300);
  }

  startPhase2() {
    const phase2 = setInterval(() => {
      this.progress += Math.random() * 5;
      
      if (this.progress >= 70) {
        this.progress = 70;
        clearInterval(phase2);
        console.log('Fase 2 concluída - Processamento profundo');
        this.startPhase3();
      }
    }, 500);
  }

  startPhase3() {
    const phase3 = setInterval(() => {
      this.progress += Math.random() * 3;
      
      if (this.progress >= 95) {
        this.progress = 95;
        clearInterval(phase3);
        console.log('Fase 3 concluída - Validação final');
        this.finalizeAIProcessing();
      }
    }, 700);
  }

  finalizeAIProcessing() {
    setTimeout(() => {
      this.progress = 100;
      console.log('Processamento da IA concluído');
      
      setTimeout(() => {
        this.isLoading = false;
        console.log('Exibindo resultados da IA');
      }, 800);
    }, 2000);
  }

  closeModal() {
    this.showRecommendationModal = false;
  }

  confirmRecommendation() {
    console.log('Recomendação confirmada:', this.aiRecommendation);
    this.enviarRecomendacaoWhatsApp();
    this.showConfirmationMessage();
  }

  enviarRecomendacaoWhatsApp() {
    const phoneNumber = '5592985497489';
    
    this.mensagemWhatsApp = `*🎯 RECOMENDAÇÃO SYNCE LAB - ANÁLISE PERSONALIZADA* 🧪\n\n`;
    this.mensagemWhatsApp += `*Cliente:* ${this.formData.name}\n`;
    this.mensagemWhatsApp += `*Empresa:* ${this.formData.company}\n`;
    this.mensagemWhatsApp += `*E-mail:* ${this.formData.email}\n`;
    this.mensagemWhatsApp += `*Telefone:* ${this.formData.phone}\n`;
    this.mensagemWhatsApp += `*Perfil:* ${this.getProfileLabel(this.formData.profile)}\n\n`;
    
    this.mensagemWhatsApp += `═══════════════════════════════\n`;
    this.mensagemWhatsApp += `*📊 RECOMENDAÇÃO DA IA*\n`;
    this.mensagemWhatsApp += `═══════════════════════════════\n\n`;
    
    this.mensagemWhatsApp += `*🏆 Plano Recomendado:* ${this.aiRecommendation.recommendedPlan}\n`;
    this.mensagemWhatsApp += `*💵 Investimento:* ${this.aiRecommendation.planPrice}\n`;
    this.mensagemWhatsApp += `*🎯 Nível de Confiança:* ${this.aiRecommendation.confidenceLevel}%\n\n`;
    
    this.mensagemWhatsApp += `*⭐ Destaques do Plano:*\n`;
    this.aiRecommendation.planHighlights.forEach((highlight, index) => {
      this.mensagemWhatsApp += `   ${index + 1}. ${highlight}\n`;
    });
    
    this.mensagemWhatsApp += `\n*🔬 Serviços Recomendados:*\n`;
    this.aiRecommendation.recommendedServices.forEach((service, index) => {
      this.mensagemWhatsApp += `   ${index + 1}. ${service}\n`;
    });
    
    this.mensagemWhatsApp += `\n═══════════════════════════════\n`;
    this.mensagemWhatsApp += `*🤖 ANÁLISE DA INTELIGÊNCIA ARTIFICIAL*\n`;
    this.mensagemWhatsApp += `═══════════════════════════════\n\n`;
    this.mensagemWhatsApp += `${this.aiRecommendation.analysis}\n\n`;
    
    this.mensagemWhatsApp += `*💬 Observações do Cliente:*\n`;
    this.mensagemWhatsApp += `"${this.formData.comment || 'Nenhuma observação adicional'}"\n\n`;
    
    this.mensagemWhatsApp += `═══════════════════════════════\n`;
    this.mensagemWhatsApp += `*🚀 PRÓXIMOS PASSOS*\n`;
    this.mensagemWhatsApp += `═══════════════════════════════\n\n`;
    this.mensagemWhatsApp += `1. ✅ *Validação Comercial* - Nossa equipe entrará em contato\n`;
    this.mensagemWhatsApp += `2. ⚙️ *Configuração Técnica* - Implementação do sistema\n`;
    this.mensagemWhatsApp += `3. 🎓 *Treinamento da Equipe* - Capacitação completa\n`;
    this.mensagemWhatsApp += `4. 🚀 *Go-Live* - Ativação da plataforma\n\n`;
    
    this.mensagemWhatsApp += `*📅 Previsão de Implementação:* 3-5 dias úteis\n\n`;
    
    this.mensagemWhatsApp += `_Gerado automaticamente pela IA Syncelab em ${new Date().toLocaleDateString('pt-BR')}_\n`;
    this.mensagemWhatsApp += `⏰ ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
    this.mensagemWhatsApp += `✨ *Sua evolução laboratorial começa aqui!* ✨`;

    const mensagemCodificada = encodeURIComponent(this.mensagemWhatsApp);
    const partesDaMensagem = this.dividirMensagemWhatsApp(this.mensagemWhatsApp, 7700);
    
    partesDaMensagem.forEach((parte, index) => {
      const mensagemParaEnviar = encodeURIComponent(parte);
      const delay = index * 2000;

      setTimeout(() => {
        window.open(
          `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${mensagemParaEnviar}`
        );
      }, delay);
    });
    
    this.closeModal();
  }

  getProfileLabel(profile: string): string {
    const profiles: { [key: string]: string } = {
      'manager': 'Gestor',
      'professional': 'Profissional de Tecnologia',
      'other': 'Outro'
    };
    return profiles[profile] || 'Não informado';
  }

  dividirMensagemWhatsApp(mensagem: string, tamanhoMaximo: number): string[] {
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

    if (parteAtual) {
      partes.push(parteAtual);
    }
    
    return partes;
  }

  showConfirmationMessage() {
    console.log('Recomendação enviada para o WhatsApp com sucesso!');
  }
}

interface Test {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  priceValue: number;
}