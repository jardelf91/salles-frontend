import { LoginService } from './../login/login.service';
import { Component, OnInit } from '@angular/core';
import { SallesService } from './salles.service';

export interface Produto {
  id: number;
  nome: string;
  itens: string;
  preco: number;
  imagemUrl: string;
  quantidade: number;
  categoriaId: number;
}

@Component({
  selector: 'app-salles',
  templateUrl: './salles.component.html',
  styleUrls: ['./salles.component.css'],
})
export class SallesComponent implements OnInit {
  quantidadePedidos: number = 0;
  carPreenchido: boolean = true;
  quantidade: number = 0;
  mostrarSacola: boolean = false;
  itensNaSacola: Produto[] = [];
  categorias: any[] = [];
  produtos: Produto[] = [];
  termoDeBusca: string = '';
  isLoggedIn: boolean = false;
  constructor(private sallesService: SallesService, private loginService: LoginService) {
    this.isLoggedIn = this.loginService.isUserLoggedIn();
  }

  ngOnInit() {
    this.sallesService.getCategories().subscribe((categoriesData: any) => {
      this.categorias = categoriesData.result.map((categoria: any) => ({
        id: categoria.id,
        nome: categoria.name,
        produtos: [],
      }));

      this.sallesService.getProducts().subscribe((productsData: any) => {
        
        this.produtos = productsData.result
          .filter((produto: any) => produto.isEnabled)  
          .map((produto: any) => ({
            id: produto.id,
            nome: produto.name,
            preco: parseFloat(produto.price),
            itens: produto.items,
            description: produto.description,
            imagemUrl: produto.imageUrl,
            quantidade: 0,
            categoriaId: produto.categoriaId || null,
          }));
  
        this.associarProdutosComCategorias();
      });
    });
  
    console.log('product', this.produtos);
  }

  associarProdutosComCategorias() {
    this.categorias.forEach((categoria) => {
      categoria.produtos = this.produtos.filter(
        (produto: Produto) => produto.categoriaId === categoria.id
      );
    });
  }

  adicionarAoCarrinho(produto: Produto) {
    produto.quantidade++;
    this.itensNaSacola.push(produto);
    this.quantidadePedidos++;
  }

  removerDoCarrinho(produto: Produto) {
    if (produto.quantidade > 0) {
      produto.quantidade--;
      const index = this.itensNaSacola.indexOf(produto);
      if (index !== -1) {
        this.itensNaSacola.splice(index, 1);
      }
      this.quantidadePedidos--;
      this.carPreenchido = this.itensNaSacola.length > 0;
    }
  }

  limparSacola() {
    this.limparProdutos();
    this.itensNaSacola = [];
    this.quantidadePedidos = 0;
  }

  limparProdutos() {
    this.categorias.forEach((categoria) => {
      categoria.produtos.forEach((produto: Produto) => {
        produto.quantidade = 0;
      });
    });
  }

  toggleSacola() {
    this.mostrarSacola = !this.mostrarSacola;
  }

  fecharModal() {
    this.mostrarSacola = false;
  }

  buscarProduto() {
    const termo = this.termoDeBusca.toLowerCase();
    this.categorias.forEach((categoria) => {
      categoria.produtos = this.produtos.filter(
        (produto: Produto) =>
          produto.categoriaId === categoria.id &&
          produto.nome.toLowerCase().includes(termo)
      );
    });
  }
}
