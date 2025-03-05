import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategorieService } from './categorie.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css'],
})
export class CategorieComponent implements OnInit {
  categorias: any[] = [];
  exibirFormulario = false;
  exibirModal = false; // Controle para exibir o modal de confirmação
  categoriaForm: FormGroup;
  actionType: string = '';
  constructor(
    private categorieService: CategorieService,
    private fb: FormBuilder
  ) {
    this.categoriaForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
    });
  }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.categorieService.findAll().subscribe((res: any) => {
      console.log('categorias', res);
      this.categorias = res.result;
    });
  }

  toggleFormulario(): void {
    this.exibirFormulario = !this.exibirFormulario;
    if (!this.exibirFormulario) {
      this.categoriaForm.reset();
    }
  }

  adicionarCategoria(): void {
    if (this.categoriaForm.valid) {
      this.actionType = 'adicionar';
      this.toggleModal(); // Exibe o modal antes de salvar
    }
  }

  excluirCategoria(id: number): void {
    console.log('1', id);
    
    this.categorieService.delete(id.toString()).subscribe(() => {
      this.listarCategorias();
      this.actionType = 'excluir';
      this.toggleModal();
    });
  }

  toggleModal(): void {
    this.exibirModal = !this.exibirModal;
  }

  confirmarAdicao(): void {
    // Salva a categoria após a confirmação
    this.categorieService.create(this.categoriaForm.value).subscribe(() => {
      this.listarCategorias();
      this.toggleFormulario();
      this.toggleModal(); // Fecha o modal
    });
  }

  cancelarAdicao(): void {
    console.log('Ação cancelada.');
    this.toggleModal(); // Fecha o modal sem salvar
  }
}
