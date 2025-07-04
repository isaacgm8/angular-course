import {
  Component,
  Input,
  SimpleChanges,
  inject,
  signal,
  OnInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';
import { ActivatedRoute } from '@angular/router';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
import { Category } from '@shared/models/category.model';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
})
export default class ListComponent implements OnInit, OnChanges {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
    private route = inject(ActivatedRoute);
   slug: string | null = null;

     ngOnChanges(changes: SimpleChanges) {
    if (changes['category_id']) {
      this.getProducts();
    }
  }

 ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug');
       this.getProducts(); 
    });
    this.getCategories();
  }
    
  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  private getProducts() { 
     const params: any = {};
      if (this.slug) {
        params.category_slug = this.slug;
  }
    this.productService.getProducts(params).subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  private getCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }
}
