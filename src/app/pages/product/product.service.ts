import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

// Interface que representa a resposta da API para categorias
interface CategoriaResponse {
  result: { id: number; name: string }[];
  total: number;
  totalPages: number;
}

// arquivo: produto.interface.ts
export interface ProdutoResponse {
  result: {
    id: number;
    name: string;
    price: string;
    description: string;
    items: string;
    imageUrl: string;
    categoriaId: number;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  total: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Método para buscar categorias
  findAllCategories(): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${environment.API}/categories`);
  }


  findAll(page: number = 0, size: number = 5): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${environment.API}/products?page=${page}`);
  }
  

  // Método para criar um produto
  create(obj: any): Observable<any> {
    return this.http.post<any>(`${environment.API}/products`, obj);
  }
}

