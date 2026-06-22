import { Link } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { RatingStars } from './RatingStars';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  // Identifier of the collection this card is rendered in (e.g. "products.grid",
  // "home.featured"). Used to build a stable, page-unique data-agent-id per item
  // so an agent can act on a specific product by selector. The same product may
  // appear in more than one collection on a page, so the id is scoped by it.
  collectionId?: string;
}

export const ProductCard = ({ product, featured = false, collectionId }: ProductCardProps) => {
  const itemId = collectionId ? `${collectionId}.item.${product.slug}` : undefined;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article
      // Semantic role for the agent: a repeatable product summary inside a collection.
      // Observable values (price, rating, category, featured) are annotated on the
      // elements that render them, so they read from displayed text rather than
      // duplicated raw attributes. When a collectionId is supplied, the card and its
      // primary controls carry a page-unique, slug-keyed data-agent-id so an agent
      // can select this specific product without falling back to the a11y tree.
      data-agent-id={itemId}
      data-agent-role="product-card"
      data-agent-observes="product.price,product.rating,product.category"
      className={cn(
        'group relative bg-card rounded-xl overflow-hidden border border-border/50 transition-all duration-300',
        'hover:border-border hover:shadow-lg',
        featured && 'md:col-span-2 md:row-span-2'
      )}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden">
        <div className={cn('relative', featured ? 'aspect-[16/9]' : 'aspect-[4/3]')}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.featured && (
            <div
              data-agent-role="observable"
              data-agent-state="product.featured"
              className="absolute top-3 left-3"
            >
              <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-semibold">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CategoryBadge
            category={product.category}
            size="sm"
            data-agent-role="observable"
            data-agent-state="product.category"
          />
          <span
            data-agent-role="observable"
            data-agent-state="product.price"
            className="font-display font-bold text-lg text-foreground"
          >
            {formatPrice(product.price)}
          </span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          data-agent-id={itemId ? `${itemId}.open` : undefined}
          data-agent-role="navigation"
          data-agent-target="product.detail"
        >
          <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <RatingStars rating={product.rating} size="sm" />
          
          <Button
            variant="soft"
            size="sm"
            asChild
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              data-agent-id={itemId ? `${itemId}.buy` : undefined}
              data-agent-role="primary-action"
              data-agent-action="buy-product"
              data-agent-target="external.affiliate"
            >
              Buy Now
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
};
