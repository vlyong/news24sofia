"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, X, ChevronDown, MonitorPlay } from 'lucide-react';
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

  const cities = [
    { name: 'София', href: '/category/sofiya', color: 'bg-[#120a8f]' },
    { name: 'Пловдив', href: '/category/plovdiv', color: 'bg-[#cc0000]' },
    { name: 'Варна', href: '/category/varna', color: 'bg-[#00a2e8]' },
    { name: 'Бургас', href: '/category/burgas', color: 'bg-[#ffc90e]' },
    { name: 'Русе', href: '/category/ruse', color: 'bg-[#22b14c]' },
    { name: 'Стара Загора', href: '/category/stara-zagora', color: 'bg-[#333333]' },
    { name: 'Плевен', href: '/category/pleven', color: 'bg-[#ff7f27]' },
  ];

  const mainLinks = [
    { 
      name: 'ОБЩЕСТВО', 
      href: '/category/community',
      subLinks: [
        { name: 'Региони', href: '/category/regioni' },
        { name: 'Екология', href: '/category/ecology' },
      ]
    },
    { name: 'NEWS24 TV', href: '/tv', isRed: true },
    { name: 'ПОЛИТИКА', href: '/category/politics' },
    { name: 'КРИМИ', href: '/category/krimi' },
    { name: 'СВЯТ', href: '/category/world' },
    { name: 'БИЗНЕС', href: '/category/biznes' },
    { name: 'ИКОНОМИКА', href: '/category/iconomic' },
    { name: 'СПОРТ', href: '/category/sport' },
    { name: 'ЗДРАВЕ', href: '/category/health' },
    { name: 'ЛЮБОПИТНО', href: '/category/curious' },
    { name: 'КОМЕНТАРИ', href: '/category/comments' },
    { name: 'НАУКА', href: '/category/science' },
    { name: 'LIFESTYLE', href: '/category/lifestyle' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#fcfbf7] dark:bg-black border-b border-[#120a8f]">
        
        {/* TOP ROW: Logo, Cities, Weather */}
        <div className="hidden lg:flex container mx-auto px-4 h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 mr-8">
            <span className="text-[42px] font-black italic tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
              <span className="text-[#120a8f] dark:text-white">NEWS</span>
              <span className="text-[#cc0000]">24</span>
            </span>
          </Link>

          {/* Cities with colored underline */}
          <div className="flex-1 flex justify-center h-full items-end pb-4 pt-10">
            <div className="flex items-center">
              {cities.map((city, i) => (
                <div key={city.name} className="flex flex-col">
                  <Link 
                    href={city.href}
                    className="px-3 text-[17px] font-bold text-[#120a8f] dark:text-white hover:opacity-80 transition-opacity whitespace-nowrap mb-1"
                  >
                    {city.name}
                  </Link>
                  <div className={`h-[5px] w-full ${city.color}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Widget (Static for now based on image) */}
          <div className="flex items-center gap-3 ml-8 flex-shrink-0">
            <div className="w-6 h-8 border-[3px] border-[#ffc90e] rounded-sm"></div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] text-[#120a8f] dark:text-white/80 uppercase font-medium">времето в</span>
              <span className="text-[22px] font-bold text-[#120a8f] dark:text-white tracking-tight">Враца 11°</span>
            </div>
            {/* Theme Toggle in Desktop next to Weather */}
            <div className="ml-4 pl-4 border-l border-gray-300 dark:border-gray-700">
                <ThemeToggle />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Navigation Links */}
        <div className="bg-[#120a8f] dark:bg-[#0a0550] w-full relative">
          <div className="container mx-auto px-4 h-[42px] flex items-center justify-between">
            
            {/* Mobile Top Bar inside Blue Bar */}
            <div className="flex items-center justify-between w-full lg:hidden h-full">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-white hover:bg-white/10 rounded transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="flex items-center">
                <span className="text-xl font-black italic tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                  <span className="text-white">NEWS</span>
                  <span className="text-[#cc0000]">24</span>
                </span>
              </Link>
              
              <div className="flex items-center space-x-1">
                 <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 text-white hover:bg-white/10 rounded transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center h-full font-bold text-[13px] text-white w-full">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                const hasSub = !!link.subLinks;
                
                if (link.isRed) {
                  return (
                    <Link 
                      key={link.name}
                      href={link.href}
                      className="h-full px-4 flex items-center bg-[#cc0000] hover:bg-[#a00000] text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <div key={link.name} className="relative group h-full flex items-center">
                    <Link 
                      href={link.href} 
                      className={`h-full px-3 flex items-center gap-1 transition-colors hover:text-gray-300 ${
                        isActive ? 'text-gray-200' : 'text-white'
                      }`}
                    >
                      {link.name}
                      {hasSub && <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />}
                    </Link>
                    
                    {hasSub && (
                      <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-b-lg shadow-xl opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all py-2 z-[100]">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 text-sm transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Desktop Search Icon */}
              <div className="h-full flex items-center pl-4">
                 <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-white hover:text-gray-300 transition-colors h-full flex items-center px-2"
                 >
                   <Search className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar Dropdown */}
        {isSearchOpen && (
           <div className="absolute top-full left-0 w-full bg-[#120a8f] dark:bg-[#0a0550] border-t border-white/10 p-4 shadow-xl z-50">
             <div className="container mx-auto px-4">
                <form onSubmit={handleSearch} className="relative flex items-center max-w-2xl mx-auto">
                  <input 
                    autoFocus
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Търсене в новините..." 
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-white/50 transition-all font-medium"
                  />
                  <button 
                    type="submit"
                    className="absolute right-4 text-white hover:text-gray-300"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
             </div>
           </div>
        )}

      </nav>
      
      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm h-full bg-white dark:bg-[#0a0a0a] flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10 bg-[#fcfbf7] dark:bg-black">
              <Link href="/" className="text-2xl font-black italic tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }} onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-[#120a8f] dark:text-white">NEWS</span>
                <span className="text-[#cc0000]">24</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Mobile Cities */}
            <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-100 dark:border-white/10">
               {cities.map((city) => (
                  <Link 
                    key={city.name}
                    href={city.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded"
                  >
                    <div className={`w-2 h-2 rounded-full ${city.color}`}></div>
                    {city.name}
                  </Link>
               ))}
               <div className="col-span-2 mt-2 pt-2 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-[#ffc90e] rounded-sm"></div>
                 <span className="text-xs font-medium dark:text-gray-400">времето в</span>
                 <span className="text-sm font-bold text-[#120a8f] dark:text-white">Враца 11°</span>
               </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col p-2">
              {mainLinks.map((link) => {
                const hasSub = !!link.subLinks;
                return (
                  <div key={link.name} className="flex flex-col">
                    <Link 
                      href={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-[15px] font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-between ${
                         link.isRed 
                          ? 'bg-[#cc0000] text-white hover:bg-[#a00000] mb-2' 
                          : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {link.isRed && <MonitorPlay className="w-4 h-4" />}
                        {link.name}
                      </div>
                    </Link>
                    {hasSub && (
                      <div className="flex flex-wrap gap-2 px-4 pb-2">
                        {link.subLinks?.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-medium py-1.5 px-3 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-[#add8e6] dark:hover:bg-[#120a8f] transition-colors"
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
            
            <div className="mt-auto p-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Предпочитания за тема:</span>
                <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
