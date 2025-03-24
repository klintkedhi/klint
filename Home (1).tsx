import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { City, Place, categories } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Utensils, Landmark, Dumbbell, 
  Waves, Hotel, MoreHorizontal, Heart, Star 
} from "lucide-react";

// Map category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  "Ristoranti": <Utensils className="h-7 w-7" />,
  "Musei": <Landmark className="h-7 w-7" />,
  "Palestre": <Dumbbell className="h-7 w-7" />,
  "Piscine": <Waves className="h-7 w-7" />,
  "Hotel": <Hotel className="h-7 w-7" />,
  "Altri": <MoreHorizontal className="h-7 w-7" />
};

const Home = () => {
  // Fetch featured cities
  const { data: featuredCities, isLoading: loadingCities } = useQuery({
    queryKey: ['/api/cities/featured'],
  });

  // Fetch featured places
  const { data: featuredPlaces, isLoading: loadingPlaces } = useQuery({
    queryKey: ['/api/places/featured'],
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* City Highlights Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-secondary mb-6">Città in evidenza</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loadingCities ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="h-40 w-full" />
              </div>
            ))
          ) : (
            // Actual city cards
            featuredCities?.map((city: City) => (
              <Link key={city.id} href={`/city/${city.id}`} className="group">
                <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition relative h-40">
                  <img 
                    src={city.imageUrl} 
                    alt={city.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-white font-medium p-3">{city.name}</h3>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-secondary mb-6">Categorie</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <Link key={category} href={`/?category=${encodeURIComponent(category)}`} className="bg-white border border-slate-200 rounded-lg p-4 text-center hover:border-primary hover:shadow-sm transition group">
              <div className="text-3xl text-primary mb-2 group-hover:scale-110 transition duration-200 flex justify-center">
                {categoryIcons[category] || <MoreHorizontal className="h-7 w-7" />}
              </div>
              <h3 className="text-sm font-medium">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Popular Places Section */}
      <section>
        <h2 className="text-2xl font-semibold text-secondary mb-6">Luoghi popolari</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingPlaces ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual place cards
            featuredPlaces?.map((place: Place) => (
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
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
