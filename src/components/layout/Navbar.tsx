"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../ThemeProvider';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  
  const navLinks = [
    { name: 'КРИМИ', href: '/category/krimi' },
    { name: 'ПОЛИТИКА', href: '/category/politics' },
    { name: 'ОБЩЕСТВО', href: '/category/community' },
    { 
      name: 'РЕГИОНИ', 
      href: '/category/regioni',
      subLinks: [
        { name: 'София', href: '/category/sofiya' },
        { name: 'Пловдив', href: '/category/plovdiv' },
        { name: 'Варна', href: '/category/varna' },
        { name: 'Бургас', href: '/category/burgas' },
        { name: 'Благоевград', href: '/category/blagoevgrad' },
      ]
    },
    { 
      name: 'ИКОНОМИКА', 
      href: '/category/iconomic',
      subLinks: [
        { name: 'Бизнес', href: '/category/biznes' },
        { name: 'Икономика', href: '/category/iconomic' },
      ]
    },
    { 
      name: 'ЗДРАВЕ', 
      href: '/category/health',
      subLinks: [
        { name: 'Здравни новини', href: '/category/health-news' },
        { name: 'Здравословно', href: '/category/healthy' },
      ]
    },
    { name: 'СВЯТ', href: '/category/world' },
    { name: 'СПОРТ', href: '/category/sport' },
  ];
  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold tracking-tighter brand-text">
            NEWS24 <span className="text-brand-red">SOFIA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.href} className="relative group py-6">
                <Link 
                  href={link.href} 
                  className={`transition-colors flex items-center gap-1 ${
                    isActive 
                      ? 'text-brand-red' 
                      : 'text-foreground/80 hover:text-brand-red'
                  }`}
                >
                  {link.name}
                  {link.subLinks && <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />}
                </Link>
                
                {link.subLinks && (
                  <div className="absolute top-full left-0 w-48 bg-background border border-black/10 dark:border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all p-2 z-[100]">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-xs transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}

                {isActive && (
                  <span className="absolute bottom-4 left-0 w-full h-0.5 bg-brand-red rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Търсене..." 
                className="w-48 lg:w-64 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:border-brand-red transition-all"
              />
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 text-foreground/50 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>
          )}
          <ThemeToggle />
        </div>

      </div>

    </nav>
    
    {/* Mobile Menu Overlay - Outside nav to avoid z-index/blur bugs */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 z-[60] flex lg:hidden">
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div 
          className="relative w-4/5 max-w-sm h-full border-r border-black/10 dark:border-white/10 p-6 flex flex-col gap-8 shadow-2xl mobile-menu-inner"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tighter brand-text" onClick={() => setIsMobileMenuOpen(false)}>
              NEWS24 <span className="text-brand-red">SOFIA</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-4 px-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Търсене..." 
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-brand-red transition-colors"
              />
            </form>
          </div>

          <nav className="flex flex-col gap-1 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const hasSub = !!link.subLinks;
              return (
                <div key={link.href} className="flex flex-col">
                  <Link 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-between ${
                      isActive 
                        ? 'bg-brand-red text-white' 
                        : 'text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {hasSub && (
                    <div className="flex flex-wrap gap-2 px-4 py-2">
                      {link.subLinks?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-xs font-medium py-1.5 px-3 rounded-full bg-black/5 dark:bg-white/5 text-foreground/60 hover:text-brand-red hover:bg-brand-red/10 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    )}
  </>
);
}
