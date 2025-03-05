import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategorieService } from '../categorie/categorie.service';
import { ProductService } from '../product/product.service';
import { LoginComponent } from '../login/login.component';

interface Produto {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  items: string;
  categoriaId: number;
  categoriaName?: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriaResponse {
  result: { id: number; name: string }[];
  total: number;
  totalPages: number;
}

interface ProdutoResponse {
  result: Produto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @Output() novoProduto = new EventEmitter<any>();
  produtoForm: FormGroup;
  produtosCadastrados: Produto[] = [];
  exibirFormulario: boolean = false;
  categorias: { id: number; name: string }[] = [];
  page: number = 1;
  exibirModalCategoria = false;
  exibirModalConfirmacao: boolean = false;
  nomeCategoria: string = '';
  categoriaForm: FormGroup;

  currentPage = 0;
  totalPages = 1;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categorieService: CategorieService
  ) {
    this.produtoForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imageUrl: ['', Validators.required],
      categoryId: ['', Validators.required],
      isEnabled: [true],
      items: ['', Validators.required],
    });

    this.categoriaForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarProdutos();
  }

  carregarCategorias() {
    this.productService.findAllCategories().subscribe(
      (categorias: CategoriaResponse) => {
        this.categorias = categorias.result;
      },
      (error) => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }

  adicionarProduto() {
    if (this.produtoForm.valid) {
      this.toggleModalConfirmacao(); // Exibe o modal de confirmação
    }
  }

  confirmarAdicaoProduto() {
    const produtoCriado = { ...this.produtoForm.value };

    this.productService.create(produtoCriado).subscribe(
      (response) => {
        this.produtosCadastrados.push(response);
        this.novoProduto.emit(response);
        this.produtoForm.reset({
          name: '',
          description: '',
          items: '',
          price: 0,
          imageUrl: '',
          categoryId: '',
          isEnabled: true,
        });
        this.exibirFormulario = false;
        this.toggleModalConfirmacao(); // Fecha o modal de confirmação
      },
      (error) => {
        console.error('Erro ao adicionar produto:', error);
        alert(
          `Erro ao adicionar produto: ${error.message || 'Erro desconhecido'}`
        );
      }
    );
  }

  cancelarAdicaoProduto() {
    this.toggleModalConfirmacao(); // Fecha o modal de confirmação sem salvar
  }

  toggleModalConfirmacao() {
    this.exibirModalConfirmacao = !this.exibirModalConfirmacao;
  }

  carregarProdutos(page: number = 0) {
    this.productService.findAll(page).subscribe(
      (produtos: ProdutoResponse) => {
        this.produtosCadastrados = produtos.result.map((produto) => {
          console.log('produtos', this.produtosCadastrados);

          const categoria = this.categorias.find(
            (cat) => cat.id === produto.categoriaId
          );
          return {
            ...produto,
            categoriaName: categoria
              ? categoria.name
              : 'Categoria não encontrada',
          };
        });

        this.currentPage = Number(produtos.currentPage) || 0;
        this.totalPages = produtos.totalPages;
      },
      (error) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  
  toggleFormulario() {
    this.exibirFormulario = !this.exibirFormulario;
  }

  abrirModalCadastroCategoria() {
    this.exibirModalCategoria = true;
  }

  fecharModalCadastroCategoria() {
    this.exibirModalCategoria = false;
  }

  salvarCategoria() {
    console.log('chegou aqui', this.categoriaForm.value);
  }

  editarProduto(produto: Produto): void {
    console.log('Editar produto:', produto);
  }

  excluirProduto(produtoId: number): void {
    console.log('Excluir produto com ID:', produtoId);
  }
}
