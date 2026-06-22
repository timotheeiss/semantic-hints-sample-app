import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Tag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/products/RatingStars';
import { CategoryBadge } from '@/components/products/CategoryBadge';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/context/ProductContext';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, getProductsByCategory } = useProducts();
  
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Link
          to="/products"
          data-agent-id="product.detail.back"
          data-agent-role="navigation"
          data-agent-target="products.page"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <article
          data-agent-id="product.detail"
          data-agent-role="product-detail"
          data-product-id={product.id}
          data-category={product.category}
          data-price={product.price}
          data-rating={product.rating}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
        >
          {/* Image */}
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start gap-3 mb-4">
              <CategoryBadge category={product.category} />
              <RatingStars rating={product.rating} size="md" />
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {product.shortDescription}
            </p>

            <div className="flex items-baseline gap-4 mb-6">
              <span
                data-agent-id="product.detail.price"
                data-agent-role="observable"
                data-agent-state="product.price"
                className="font-display text-4xl font-bold text-foreground"
              >
                {formatPrice(product.price)}
              </span>
            </div>

            {/* CTA Button */}
            <Button
              variant="affiliate"
              size="xl"
              asChild
              className="w-full sm:w-auto mb-8"
            >
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                data-agent-id="product.detail.buy"
                data-agent-role="primary-action"
                data-agent-action="buy-product"
                data-agent-target="external.affiliate"
              >
                Buy Now
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
            </Button>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Specs */}
            <div
              data-agent-id="product.detail.specs"
              data-agent-role="observable"
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="bg-muted/50 px-4 py-3 border-b border-border">
                <h3 className="font-display font-semibold text-foreground">
                  Key Specifications
                </h3>
              </div>
              <div className="divide-y divide-border">
                {product.specs.map((spec, index) => (
                  <div key={index} className="flex justify-between px-4 py-3">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Full Review */}
        <section className="max-w-3xl mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            My Review
          </h2>
          <div className="prose prose-lg text-muted-foreground">
            <p className="leading-relaxed">{product.fullReview}</p>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              More in {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} collectionId="product.related" />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
