import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Heart, Clock } from "lucide-react";

const Navbar = () => {
  const [location, setLocation] = useLocation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For this version, redirect to home with search query
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-primary text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </div>
              <span className="text-xl font-semibold text-secondary">CityExplorer</span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                type="text"
                className="pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-slate-50"
                placeholder="Cerca città o luoghi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden bg-slate-50 p-2 rounded-full"
              onClick={toggleMobileSearch}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-slate-700" />
            </Button>

            <div className="hidden sm:flex items-center gap-4">
              <Button variant="ghost" className="text-slate-700 hover:text-primary transition">
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-sm">Preferiti</span>
              </Button>
              <Button variant="ghost" className="text-slate-700 hover:text-primary transition">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">Recenti</span>
              </Button>
            </div>

            <Button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Accedi</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Search (Hidden by default) */}
        {showMobileSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-slate-50"
                placeholder="Cerca città o luoghi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
