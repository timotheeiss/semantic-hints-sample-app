import { Product } from '@/data/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export const ProductGrid = ({ products, emptyMessage = 'No products found.' }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div
        data-agent-id="products.grid"
        data-agent-role="collection"
        data-agent-state="empty"
        className="text-center py-16"
      >
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      data-agent-id="products.grid"
      data-agent-role="collection"
      data-agent-observes="products.count"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} collectionId="products.grid" />
      ))}
    </div>
  );
};
