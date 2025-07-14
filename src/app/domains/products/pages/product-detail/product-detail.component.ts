import {Component, inject, input, linkedSignal, effect,} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@envi/environment';
import { MetaTagsService } from '@shared/services/meta-tags.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent{
  readonly slug = input.required<string>();

  
  productRs = rxResource({
    request: () => ({
      slug: this.slug(),
    }),
    loader: ({ request }) => {
      return this.productService.getOneBySlug(request.slug);
    }
  });

  $cover = linkedSignal({
    source: this.productRs.value,
    computation: (product, previousValue) => {
      if (product && product.images.length > 0) {
        return product.images[0];
      }
      return previousValue?.value;
    },
  });

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private metaTagsService = inject(MetaTagsService)

  constructor() {
    effect (() => {
      const product = this.productRs.value();
          if (product) {
              this.metaTagsService.updateMetaTags({
                title: product.title,
                description: product.description,
                image: product.images[0],
                url: `${environment.domain}/product/${product.slug}`
              })
          }
      });
    
    
  }


  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productRs.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
