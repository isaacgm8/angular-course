import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Product } from '@shared/models/product.model';
import { ProductService } from '@shared/services/product.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-related',
  imports: [ProductComponent],
  templateUrl: './related.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedComponent {
  productService = inject(ProductService);
  $slug = input.required<string>({ alias: 'slug' });

  relatedProducts = rxResource({
    request: () => ({
      slug: this.$slug(),
    }),
    loader: ({ request }) =>
      this.productService.getRelatedProducts(request.slug),
  });
}
