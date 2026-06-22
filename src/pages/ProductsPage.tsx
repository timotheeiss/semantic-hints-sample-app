import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { useProducts, ProductFilters as FiltersType } from '@/context/ProductContext';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { products, filterProducts } = useProducts();
  
  const maxPrice = Math.max(...products.map((p) => p.price));
  
  const [filters, setFilters] = useState<FiltersType>(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    return {
      category: category as FiltersType['category'] || 'all',
      sortBy: 'newest',
      searchQuery: search || '',
    };
  });

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilters((prev) => ({ ...prev, searchQuery: search }));
    }
  }, [searchParams]);

  const filteredProducts = filterProducts(filters);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            All Products
          </h1>
          <p
            data-agent-id="products.result-count"
            data-agent-role="observable"
            data-agent-state="products.count"
            className="text-muted-foreground"
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            maxPrice={maxPrice}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          emptyMessage="No products match your filters. Try adjusting your search."
        />
      </div>
    </Layout>
  );
};

export default ProductsPage;
