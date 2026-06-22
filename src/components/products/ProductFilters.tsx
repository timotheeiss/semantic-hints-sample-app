import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductFilters as ProductFiltersType } from '@/context/ProductContext';
import { categories, allTags, Category } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  maxPrice: number;
}

export const ProductFilters = ({ filters, onFiltersChange, maxPrice }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || maxPrice,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localSearch !== filters.searchQuery) {
        onFiltersChange({ ...filters, searchQuery: localSearch });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [localSearch]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const applyPriceFilter = () => {
    onFiltersChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    setLocalSearch('');
    setPriceRange([0, maxPrice]);
    onFiltersChange({
      category: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    (filters.category && filters.category !== 'all') ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating ||
    (filters.tags && filters.tags.length > 0);

  return (
    <div
      data-agent-id="products.filters"
      data-agent-role="filter-region"
      className="space-y-4"
    >
      {/* Main filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            data-agent-id="filters.search"
            data-agent-role="input"
            data-agent-action="filter-by-search"
            data-agent-state="filters.searchQuery"
            data-agent-controls="products.grid"
            className="pl-9"
          />
        </div>

        {/* Category */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, category: value as Category | 'all' })
          }
        >
          <SelectTrigger
            data-agent-id="filters.category"
            data-agent-role="select"
            data-agent-action="filter-by-category"
            data-agent-state="filters.category"
            data-agent-controls="products.grid"
            className="w-full sm:w-40"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="all"
              data-agent-id="filters.category.option.all"
              data-agent-role="option"
            >
              All Categories
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem
                key={cat.id}
                value={cat.id}
                data-agent-id={`filters.category.option.${cat.id}`}
                data-agent-role="option"
              >
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy || 'newest'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              sortBy: value as ProductFiltersType['sortBy'],
            })
          }
        >
          <SelectTrigger
            data-agent-id="filters.sort"
            data-agent-role="select"
            data-agent-action="sort-products"
            data-agent-state="filters.sortBy"
            data-agent-controls="products.grid"
            className="w-full sm:w-40"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" data-agent-id="filters.sort.option.newest" data-agent-role="option">Newest</SelectItem>
            <SelectItem value="rating" data-agent-id="filters.sort.option.rating" data-agent-role="option">Top Rated</SelectItem>
            <SelectItem value="price-asc" data-agent-id="filters.sort.option.price-asc" data-agent-role="option">Price: Low to High</SelectItem>
            <SelectItem value="price-desc" data-agent-id="filters.sort.option.price-desc" data-agent-role="option">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Toggle advanced filters */}
        <Button
          variant={isOpen ? 'secondary' : 'outline'}
          onClick={() => setIsOpen(!isOpen)}
          data-agent-id="filters.toggle-advanced"
          data-agent-role="action"
          data-agent-action="toggle-advanced-filters"
          data-agent-controls="filters.advanced"
          data-agent-state={isOpen ? 'open' : 'closed'}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Advanced filters */}
      {isOpen && (
        <div
          data-agent-id="filters.advanced"
          data-agent-role="filter-region"
          data-agent-state="open"
          className="bg-card border border-border rounded-lg p-4 space-y-4 animate-fade-in"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range</Label>
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                onValueCommit={applyPriceFilter}
                min={0}
                max={maxPrice}
                step={10}
                data-agent-id="filters.price-range"
                data-agent-role="slider"
                data-agent-action="filter-by-price"
                data-agent-state="filters.priceRange"
                data-agent-controls="products.grid"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Minimum Rating</Label>
              <Select
                value={filters.minRating?.toString() || 'any'}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    minRating: value === 'any' ? undefined : Number(value),
                  })
                }
              >
                <SelectTrigger
                  data-agent-id="filters.min-rating"
                  data-agent-role="select"
                  data-agent-action="filter-by-rating"
                  data-agent-state="filters.minRating"
                  data-agent-controls="products.grid"
                >
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any" data-agent-id="filters.min-rating.option.any" data-agent-role="option">Any rating</SelectItem>
                  <SelectItem value="4" data-agent-id="filters.min-rating.option.4" data-agent-role="option">4+ stars</SelectItem>
                  <SelectItem value="4.5" data-agent-id="filters.min-rating.option.4.5" data-agent-role="option">4.5+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div
              data-agent-id="filters.tags"
              data-agent-role="filter-region"
              className="flex flex-wrap gap-2"
            >
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags?.includes(tag) ? 'default' : 'outline'}
                  data-agent-id={`filters.tag.${tag}`}
                  data-agent-role="toggle"
                  data-agent-action="toggle-tag"
                  data-agent-state={filters.tags?.includes(tag) ? 'selected' : 'unselected'}
                  data-agent-controls="products.grid"
                  className={cn(
                    'cursor-pointer transition-colors',
                    filters.tags?.includes(tag) ? '' : 'hover:bg-muted'
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                data-agent-id="filters.clear"
                data-agent-role="action"
                data-agent-action="clear-filters"
                data-agent-controls="products.grid"
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
