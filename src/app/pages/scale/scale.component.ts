
import { Component, AfterViewInit, HostListener } from '@angular/core';

interface Project {
  title: string;
  description: string;
  image: string; // Changed from 'icon' to 'image'
  technologies: string[];
}


@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.css']
})
export class ScaleComponent implements AfterViewInit {
  isScrolled = false;
  currentSlide = 0;
  slidesToShow = 3; // Default number of slides to show
  isModalOpen = false;
  selectedProject: Project | null = null;

  projects: Project[] = [
    {
      title: 'Sistema de Gestão para Laboratórios',
      description: 'Sistema LIS completo e modular para gestão laboratorial, com agenda inteligente, interfaceamento com equipamentos e emissão de laudos.',
      image: 'assets/imagem/syncelab_l.png',
      technologies: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL']
    },
    {
      title: 'Sistema ERP Protheus',
      description: 'Desenvolvimento e customização de módulos do sistema Protheus para gestão empresarial integrada.',
      image: 'assets/images/project2.webp',
      technologies: ['ADVPL', 'TL++', 'SQL Server']
    },
    {
      title: 'Solução de Business Intelligence',
      description: 'Plataforma de análise de dados com ETL, dashboards interativos e relatórios automatizados para tomada de decisão.',
      image: 'assets/images/project3.avif',
      technologies: ['Pentaho', 'Python', 'React', 'Machine Learning']
    }
  ];

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  ngAfterViewInit() {
    this.checkScroll();
    this.setupIntersectionObserver();
    this.updateSlidesToShow();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.updateSlidesToShow();
  }

  private checkScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  private setupIntersectionObserver() {
    const sections = document.querySelectorAll('.hero, .about, .experience, .skills, .projects, .contact, .footer');
    
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

  downloadCV() {
    console.log('Download do CV iniciado');
    const link = document.createElement('a');
    link.href = 'assets/cv.pdf';
    link.download = 'Elcy_Arruda_CV.pdf';
    link.click();
  }

  onSubmit() {
    console.log('Form submitted:', this.formData);
    this.formData = { name: '', email: '', subject: '', message: '' };
  }

  // Carousel methods
  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide() {
    if (this.currentSlide < this.projects.length - this.slidesToShow) {
      this.currentSlide++;
    }
  }

  private updateSlidesToShow() {
    if (window.innerWidth <= 768) {
      this.slidesToShow = 1;
    } else if (window.innerWidth <= 1024) {
      this.slidesToShow = 2;
    } else {
      this.slidesToShow = 3;
    }
    // Reset current slide if it exceeds the valid range
    if (this.currentSlide > this.projects.length - this.slidesToShow) {
      this.currentSlide = Math.max(0, this.projects.length - this.slidesToShow);
    }
  }

  // Modal methods
  openModal(project: Project) {
    this.selectedProject = project;
    this.isModalOpen = true;
  }

  closeModal(event?: Event) {
    if (event && ((event.target as HTMLElement).classList.contains('modal') || (event.target as HTMLElement).classList.contains('modal-image')) || !event) {
      this.isModalOpen = false;
      this.selectedProject = null;
    }
  }
}
