import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', agentId: 'nav.home', target: 'home.page' },
  { href: '/products', label: 'All Products', agentId: 'nav.products', target: 'products.page' },
  { href: '/category/tech', label: 'Tech', agentId: 'nav.category.tech', target: 'category.tech' },
  { href: '/category/home', label: 'Home', agentId: 'nav.category.home', target: 'category.home' },
  { href: '/category/fitness', label: 'Fitness', agentId: 'nav.category.fitness', target: 'category.fitness' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      data-agent-id="nav.header"
      data-agent-role="navigation"
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            data-agent-id="nav.brand"
            data-agent-role="navigation"
            data-agent-target="home.page"
            className="flex items-center gap-2"
          >
            <span className="font-display text-xl font-bold text-foreground">
              Curated<span className="text-primary">Picks</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-agent-id={link.agentId}
                data-agent-role="navigation"
                data-agent-target={link.target}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname === link.href
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search & Admin */}
          <div className="flex items-center gap-2">
            <form
              onSubmit={handleSearch}
              data-agent-id="search.form"
              data-agent-role="form-region"
              data-agent-action="search-products"
              className="hidden sm:flex items-center"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-agent-id="search.query"
                  data-agent-role="input"
                  data-agent-state="search.query"
                  className="pl-9 w-48 lg:w-64 h-9 bg-muted/50 border-0 focus-visible:ring-1"
                />
              </div>
            </form>

            <Link
              to="/admin"
              data-agent-id="nav.admin"
              data-agent-role="navigation"
              data-agent-target="admin.page"
            >
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-agent-id="nav.menu-toggle"
              data-agent-role="action"
              data-agent-action="toggle-menu"
              data-agent-controls="nav.mobile-menu"
              data-agent-state={isMenuOpen ? 'open' : 'closed'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            data-agent-id="nav.mobile-menu"
            data-agent-role="navigation"
            data-agent-state="open"
            className="md:hidden border-t border-border py-4 animate-fade-in"
          >
            <form
              onSubmit={handleSearch}
              data-agent-id="search.form.mobile"
              data-agent-role="form-region"
              data-agent-action="search-products"
              className="mb-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-agent-id="search.query.mobile"
                  data-agent-role="input"
                  data-agent-state="search.query"
                  className="pl-9 w-full h-10 bg-muted/50 border-0"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  data-agent-id={`${link.agentId}.mobile`}
                  data-agent-role="navigation"
                  data-agent-target={link.target}
                  className={cn(
                    'px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                    location.pathname === link.href
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
