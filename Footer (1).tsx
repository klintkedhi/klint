import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-10 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="text-primary text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </div>
              <span className="text-xl font-semibold text-secondary">CityExplorer</span>
            </Link>
            <p className="text-slate-500 mb-6">
              Scopri i migliori luoghi in ogni città d'Italia. Ristoranti, bar, musei, palestre, piscine, hotel e molto altro.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Esplorare</h5>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-500 hover:text-primary transition">Città</Link></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Categorie</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Luoghi popolari</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Nuove aperture</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Info utili</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Chi siamo</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Contatti</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">FAQ</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Legale</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Termini di servizio</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Privacy policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Cookie policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition">Gestisci preferenze</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} CityExplorer. Tutti i diritti riservati.</p>
          <div className="flex space-x-4">
            <select className="text-sm border border-slate-200 rounded p-1">
              <option>Italiano</option>
              <option>English</option>
            </select>
            <select className="text-sm border border-slate-200 rounded p-1">
              <option>EUR (€)</option>
              <option>USD ($)</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
