import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, Save, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryBadge } from '@/components/products/CategoryBadge';
import { RatingStars } from '@/components/products/RatingStars';
import { useProducts } from '@/context/ProductContext';
import { Product, Category, categories } from '@/data/products';
import { toast } from 'sonner';

type ProductFormData = Omit<Product, 'id' | 'slug' | 'createdAt'>;

const emptyProduct: ProductFormData = {
  name: '',
  category: 'tech',
  tags: [],
  price: 0,
  rating: 4.5,
  shortDescription: '',
  fullReview: '',
  specs: [{ label: '', value: '' }],
  imageUrl: '',
  affiliateLink: '',
  featured: false,
};

const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct);
  const [tagsInput, setTagsInput] = useState('');

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(emptyProduct);
    setTagsInput('');
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setIsCreating(false);
    setFormData({
      name: product.name,
      category: product.category,
      tags: product.tags,
      price: product.price,
      rating: product.rating,
      shortDescription: product.shortDescription,
      fullReview: product.fullReview,
      specs: product.specs,
      imageUrl: product.imageUrl,
      affiliateLink: product.affiliateLink,
      featured: product.featured,
    });
    setTagsInput(product.tags.join(', '));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(emptyProduct);
    setTagsInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const specs = formData.specs.filter((s) => s.label && s.value);

    if (!formData.name || !formData.shortDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productData = { ...formData, tags, specs };

    if (isCreating) {
      addProduct(productData);
      toast.success('Product created successfully');
    } else if (editingId) {
      updateProduct(editingId, productData);
      toast.success('Product updated successfully');
    }

    cancelEdit();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: '', value: '' }],
    }));
  };

  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage your product recommendations
            </p>
          </div>
          {!isCreating && !editingId && (
            <Button
              onClick={startCreate}
              data-agent-id="admin.add-product"
              data-agent-role="primary-action"
              data-agent-action="new-product"
              data-agent-controls="admin.product-form"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>
                {isCreating ? 'Create New Product' : 'Edit Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                data-agent-id="admin.product-form"
                data-agent-role="form-region"
                data-agent-action="submit-product"
                data-agent-state={isCreating ? 'creating' : 'editing'}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Sony WH-1000XM5"
                      data-agent-id="admin.field.name"
                      data-agent-role="input"
                      data-agent-state="product.name"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as Category }))}
                    >
                      <SelectTrigger
                        data-agent-id="admin.field.category"
                        data-agent-role="select"
                        data-agent-state="product.category"
                        data-agent-options={categories.map((c) => `${c.id}|${c.name}`).join(';')}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id}
                            data-agent-id={`admin.field.category.option.${cat.id}`}
                            data-agent-role="option"
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                      data-agent-id="admin.field.price"
                      data-agent-role="input"
                      data-agent-state="product.price"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                      data-agent-id="admin.field.rating"
                      data-agent-role="input"
                      data-agent-state="product.rating"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://..."
                      data-agent-id="admin.field.imageUrl"
                      data-agent-role="input"
                      data-agent-state="product.imageUrl"
                    />
                  </div>

                  {/* Affiliate Link */}
                  <div className="space-y-2">
                    <Label htmlFor="affiliateLink">Affiliate Link</Label>
                    <Input
                      id="affiliateLink"
                      value={formData.affiliateLink}
                      onChange={(e) => setFormData((prev) => ({ ...prev, affiliateLink: e.target.value }))}
                      placeholder="https://..."
                      data-agent-id="admin.field.affiliateLink"
                      data-agent-role="input"
                      data-agent-state="product.affiliateLink"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g., wireless, premium, noise-cancelling"
                    data-agent-id="admin.field.tags"
                    data-agent-role="input"
                    data-agent-state="product.tags"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                    rows={2}
                    data-agent-id="admin.field.shortDescription"
                    data-agent-role="input"
                    data-agent-state="product.shortDescription"
                  />
                </div>

                {/* Full Review */}
                <div className="space-y-2">
                  <Label htmlFor="fullReview">Full Review</Label>
                  <Textarea
                    id="fullReview"
                    value={formData.fullReview}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullReview: e.target.value }))}
                    rows={5}
                    data-agent-id="admin.field.fullReview"
                    data-agent-role="input"
                    data-agent-state="product.fullReview"
                  />
                </div>

                {/* Specs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Specifications</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSpec}
                      data-agent-id="admin.field.add-spec"
                      data-agent-role="action"
                      data-agent-action="add-spec"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Spec
                    </Button>
                  </div>
                  {formData.specs.map((spec, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder="Label"
                        value={spec.label}
                        onChange={(e) => updateSpec(index, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpec(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                    data-agent-id="admin.field.featured"
                    data-agent-role="toggle"
                    data-agent-state="product.featured"
                  />
                  <Label>Featured on homepage</Label>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    data-agent-id="admin.form.submit"
                    data-agent-role="primary-action"
                    data-agent-action={isCreating ? 'create-product' : 'update-product'}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isCreating ? 'Create Product' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    data-agent-id="admin.form.cancel"
                    data-agent-role="action"
                    data-agent-action="cancel-edit"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <div
          data-agent-id="admin.product-list"
          data-agent-role="collection"
          className="space-y-4"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              data-agent-role="product-row"
              data-product-id={product.id}
              className="overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-40 h-32 sm:h-auto shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryBadge category={product.category} size="sm" />
                      {product.featured && (
                        <span className="inline-flex items-center gap-1 text-xs text-accent">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                    <h3
                      data-agent-id={`admin.product.${product.id}`}
                      data-agent-role="observable"
                      data-agent-state="product.name"
                      className="font-display font-semibold text-foreground mb-1"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatPrice(product.price)}</span>
                      <RatingStars rating={product.rating} size="sm" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(product)}
                      data-agent-id={`admin.product.${product.id}.edit`}
                      data-agent-role="action"
                      data-agent-action="edit-product"
                      data-agent-controls="admin.product-form"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.name)}
                      data-agent-id={`admin.product.${product.id}.delete`}
                      data-agent-role="action"
                      data-agent-action="delete-product"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
