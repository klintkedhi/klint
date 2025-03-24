import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Place, City as CityType, categories } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

const City = () => {
  const { id } = useParams();
  const cityId = parseInt(id);

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("any");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  
  // Fetch city data
  const { data: city, isLoading: loadingCity } = useQuery({
    queryKey: [`/api/cities/${cityId}`],
  });

  // Fetch places for this city
  const { data: places, isLoading: loadingPlaces } = useQuery({
    queryKey: [`/api/cities/${cityId}/places`],
  });

  // Fetch all available tags
  const { data: availableTags } = useQuery({
    queryKey: ['/api/tags'],
  });

  // Filter and sort places
  const filteredPlaces = places ? [...places].filter((place: Place) => {
    // Filter by categories
    if (selectedCategories.length > 0 && !selectedCategories.includes(place.category)) {
      return false;
    }
    
    // Filter by rating
    if (selectedRating === "3plus" && place.rating < 30) return false;
    if (selectedRating === "4plus" && place.rating < 40) return false;
    if (selectedRating === "4.5plus" && place.rating < 45) return false;
    
    // Filter by tags
    if (selectedTags.length > 0) {
      const hasTag = selectedTags.some(tag => place.tags?.includes(tag));
      if (!hasTag) return false;
    }
    
    return true;
  }) : [];
  
  // Sort places
  const sortedPlaces = filteredPlaces ? [...filteredPlaces].sort((a: Place, b: Place) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "newest") {
      return b.id - a.id; // Using ID as a proxy for newest
    }
    // Default: popular
    return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
  }) : [];

  // Toggle a category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle a tag filter
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedRating("any");
    setSelectedTags([]);
  };

  if (loadingCity) {
    return (
      <div className="w-full">
        <Skeleton className="h-64 sm:h-80 w-full" />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-2/3 mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <Skeleton className="h-96 lg:w-1/4" />
            <div className="lg:w-3/4">
              <Skeleton className="h-8 w-full mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Città non trovata. Torna alla <Link href="/" className="underline">home page</Link>.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* City Hero Banner */}
      <div className="relative">
        <div className="h-64 sm:h-80 overflow-hidden">
          <img 
            src={city.imageUrl} 
            alt={city.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-6">
          <h1 className="text-white text-3xl sm:text-4xl font-bold">{city.name}</h1>
          <p className="text-white/80 mt-2">{city.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-secondary mb-4">Filtra risultati</h2>
              
              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Categorie</h3>
                {categories.map(category => (
                  <div key={category} className="flex items-center mb-2">
                    <Checkbox 
                      id={`category-${category.toLowerCase()}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                      className="text-primary rounded border-slate-300"
                    />
                    <Label 
                      htmlFor={`category-${category.toLowerCase()}`}
                      className="ml-2 text-sm text-slate-700"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              
              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Valutazione</h3>
                <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
                  <div className="flex items-center mb-2">
                    <RadioGroupItem id="rating-any" value="any" className="text-primary border-slate-300" />
                    <Label htmlFor="rating-any" className="ml-2 text-sm text-slate-700">Qualsiasi</Label>
                  </div>
                  <div className="flex items-center mb-2">
                    <RadioGroupItem id="rating-3plus" value="3plus" className="text-primary border-slate-300" />
                    <Label htmlFor="rating-3plus" className="ml-2 text-sm text-slate-700">3+ stelle</Label>
                  </div>
                  <div className="flex items-center mb-2">
                    <RadioGroupItem id="rating-4plus" value="4plus" className="text-primary border-slate-300" />
                    <Label htmlFor="rating-4plus" className="ml-2 text-sm text-slate-700">4+ stelle</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="rating-4.5plus" value="4.5plus" className="text-primary border-slate-300" />
                    <Label htmlFor="rating-4.5plus" className="ml-2 text-sm text-slate-700">4.5+ stelle</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Tags Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags?.map((tag: string) => (
                    <Button 
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedTags.includes(tag) 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="border-t border-slate-200 mt-6 pt-6">
                <Button 
                  onClick={resetFilters}
                  className="w-full bg-primary hover:bg-secondary text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Reimposta filtri
                </Button>
              </div>
            </div>
          </aside>

          {/* Places List */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary">
                {sortedPlaces?.length || 0} luoghi trovati
              </h2>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-slate-500 mr-2">Ordina per:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-primary focus:border-primary bg-white w-auto">
                    <SelectValue placeholder="Più popolari" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Più popolari</SelectItem>
                    <SelectItem value="rating">Valutazione</SelectItem>
                    <SelectItem value="newest">Più recenti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loadingPlaces ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full" />
                ))}
              </div>
            ) : sortedPlaces?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedPlaces.map((place: Place) => (
                  <div key={place.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="relative h-48">
                      {place.images && place.images.length > 0 && (
                        <img 
                          src={place.images[0]} 
                          alt={place.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                        <Heart className="h-5 w-5 text-slate-400 hover:text-primary cursor-pointer" />
                      </div>
                      <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                        {place.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{place.name}</h3>
                        <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-sm">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                          <span>{(place.rating / 10).toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{place.address}</p>
                      {place.tags && place.tags.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {place.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link href={`/place/${place.id}`} className="inline-block mt-4 text-primary hover:text-secondary font-medium text-sm">
                        Visualizza dettagli →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <p className="text-slate-600">Nessun luogo corrisponde ai filtri selezionati.</p>
                <Button 
                  onClick={resetFilters}
                  variant="outline" 
                  className="mt-4"
                >
                  Reimposta filtri
                </Button>
              </div>
            )}
            
            {/* Pagination - can be implemented for more advanced versions */}
            {sortedPlaces?.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                  <Button variant="outline" className="rounded-l-md border border-slate-300">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Precedente
                  </Button>
                  <Button variant="outline" className="border-t border-b border-l border-slate-300 bg-primary/10 text-primary">
                    1
                  </Button>
                  <Button variant="outline" className="border border-slate-300">
                    2
                  </Button>
                  <Button variant="outline" className="border border-slate-300">
                    3
                  </Button>
                  <Button variant="outline" className="border border-slate-300">
                    ...
                  </Button>
                  <Button variant="outline" className="border border-slate-300">
                    8
                  </Button>
                  <Button variant="outline" className="rounded-r-md border border-slate-300">
                    Successivo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default City;
