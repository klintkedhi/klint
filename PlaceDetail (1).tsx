import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, CardContent, CardHeader, CardFooter, CardTitle 
} from "@/components/ui/card";
import { 
  Textarea 
} from "@/components/ui/textarea";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Chatbot from "@/components/Chatbot";
import { 
  Star, Heart, Share2, Clock, Phone, Euro, CreditCard, MapPin,
  Check, ChevronLeft, ChevronRight, UserRound, Calendar
} from "lucide-react";
import { insertReviewSchema } from "@shared/schema";

const reviewFormSchema = z.object({
  userName: z.string().min(3, { message: "Nome richiesto (min. 3 caratteri)" }),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, { message: "Commento richiesto (min. 10 caratteri)" })
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

// Gallery image component with lazy loading
const GalleryImage = ({ src, alt, className, onClick }: { src: string, alt: string, className?: string, onClick?: () => void }) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || 'h-full'}`} onClick={onClick}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover" 
        loading="lazy" 
      />
    </div>
  );
};

const PlaceDetail = () => {
  const { id } = useParams();
  const placeId = parseInt(id);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State for gallery
  const [activeTab, setActiveTab] = useState("informazioni");
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  
  // Fetch place details
  const { data: place, isLoading: loadingPlace } = useQuery({
    queryKey: [`/api/places/${placeId}`],
  });

  // Fetch city details for the place
  const { data: city } = useQuery({
    queryKey: [`/api/cities/${place?.cityId}`],
    enabled: !!place?.cityId,
  });

  // Fetch reviews for the place
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: [`/api/places/${placeId}/reviews`],
    enabled: !!placeId,
  });

  // Review form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      userName: "",
      rating: 5,
      comment: ""
    }
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const response = await apiRequest("POST", `/api/places/${placeId}/reviews`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/places/${placeId}/reviews`] });
      form.reset({
        userName: "",
        rating: 5,
        comment: ""
      });
      toast({
        title: "Recensione inviata",
        description: "Grazie per aver condiviso la tua opinione!",
      });
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile inviare la recensione. Riprova più tardi.",
        variant: "destructive"
      });
    }
  });

  const onSubmitReview = (data: ReviewFormValues) => {
    submitReviewMutation.mutate(data);
  };

  if (loadingPlace) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="grid grid-cols-4 grid-rows-2 gap-4 h-96 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-60 w-full mb-8" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-72 w-full mb-8" />
          </div>
          <div className="lg:w-1/3">
            <Skeleton className="h-96 w-full sticky top-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Luogo non trovato. Torna alla <Link href="/" className="underline">home page</Link>.
        </div>
      </div>
    );
  }

  // Format display rating
  const displayRating = (place.rating / 10).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Image Gallery */}
      {showAllImages ? (
        <div className="fixed inset-0 bg-black z-50 p-4 overflow-auto">
          <Button 
            variant="ghost" 
            className="absolute top-4 right-4 text-white" 
            onClick={() => setShowAllImages(false)}
          >
            ✕
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto my-12">
            {place.images?.map((image: string, index: number) => (
              <GalleryImage 
                key={index}
                src={image} 
                alt={`${place.name} - Immagine ${index + 1}`}
                className="h-72"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-96 mb-8">
          {/* Main large image */}
          {place.images && place.images.length > 0 && (
            <GalleryImage 
              src={place.images[0]} 
              alt={`${place.name} - Immagine principale`}
              className="col-span-2 row-span-2"
            />
          )}
          
          {/* Smaller images */}
          {place.images && place.images.slice(1, 5).map((image: string, index: number) => {
            // The last image (if we have enough images) shows "view more" overlay
            if (index === 3 && place.images.length > 5) {
              return (
                <div key={index} className="relative rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${place.name} - Immagine ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    onClick={() => setShowAllImages(true)}
                  >
                    <Button variant="ghost" className="text-white hover:text-primary transition">
                      <span className="text-lg">+{place.images.length - 4} foto</span>
                    </Button>
                  </div>
                </div>
              );
            }
            
            return (
              <GalleryImage 
                key={index}
                src={image} 
                alt={`${place.name} - Immagine ${index + 2}`}
                onClick={() => setShowAllImages(true)}
              />
            );
          })}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                  {place.category}
                </span>
                {place.tags?.slice(0, 2).map((tag: string, index: number) => (
                  <span key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                  {place.priceLevel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary">{place.name}</h1>
              <p className="text-slate-500 mt-1">{place.address}</p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Salva</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Condividi</span>
              </Button>
            </div>
          </div>
          
          {/* Rating */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="text-3xl font-bold text-slate-900">{displayRating}</span>
                  <div className="flex text-yellow-400 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${
                          star <= Math.floor(place.rating / 10) 
                            ? 'fill-yellow-400' 
                            : star <= place.rating / 10 
                              ? 'fill-yellow-400 stroke-yellow-400' 
                              : ''
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{place.reviewCount} recensioni</p>
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  <div className="col-span-1 text-sm text-slate-500">Qualità</div>
                  <div className="col-span-4">
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div className="h-full bg-primary rounded" style={{width: `${(place.rating / 50) * 100}%`}}></div>
                    </div>
                  </div>
                  <div className="col-span-1 text-sm text-slate-500">Servizio</div>
                  <div className="col-span-4">
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div className="h-full bg-primary rounded" style={{width: `${(place.rating / 50) * 90}%`}}></div>
                    </div>
                  </div>
                  <div className="col-span-1 text-sm text-slate-500">Ambiente</div>
                  <div className="col-span-4">
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div className="h-full bg-primary rounded" style={{width: `${(place.rating / 50) * 95}%`}}></div>
                    </div>
                  </div>
                  <div className="col-span-1 text-sm text-slate-500">Rapporto</div>
                  <div className="col-span-4">
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div className="h-full bg-primary rounded" style={{width: `${(place.rating / 50) * 85}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs */}
          <Tabs defaultValue="informazioni" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-b w-full rounded-none bg-transparent justify-start">
              <TabsTrigger value="informazioni" className="data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4">
                Informazioni
              </TabsTrigger>
              <TabsTrigger value="recensioni" className="data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4">
                Recensioni ({place.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="informazioni">
              {/* Description */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-secondary">Descrizione</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600">
                  <p className="mb-4">{place.description}</p>
                </CardContent>
              </Card>
              
              {/* Details in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-secondary">Informazioni utili</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Clock className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="font-medium">Orari di apertura</p>
                          <p className="text-sm text-slate-500">{place.openingHours || "Non specificati"}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="font-medium">Contatti</p>
                          <p className="text-sm text-slate-500">{place.contactPhone || "Non specificato"}</p>
                          <p className="text-sm text-slate-500">{place.contactEmail || ""}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Euro className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="font-medium">Prezzi</p>
                          <p className="text-sm text-slate-500">
                            {place.priceLevel === "$" && "Economico"}
                            {place.priceLevel === "$$" && "Prezzo medio"}
                            {place.priceLevel === "$$$" && "Prezzo elevato"}
                            {place.priceLevel === "$$$$" && "Lusso"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CreditCard className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <p className="font-medium">Metodi di pagamento</p>
                          <p className="text-sm text-slate-500">Carte di credito, Contanti</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-secondary">Servizi e caratteristiche</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-3">
                      {place.tags?.map((tag, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Map */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-secondary">Posizione</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-200 rounded-lg relative mb-4">
                    {/* Use an iframe for Google Maps or another map provider if coordinates are available */}
                    {place.latitude && place.longitude ? (
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${place.latitude},${place.longitude}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '0.5rem' }}
                        allowFullScreen
                        loading="lazy"
                        title="Location Map"
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-500">Mappa di {city?.name} con posizione di {place.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600">
                    <MapPin className="inline-block h-5 w-5 text-primary mr-2" />
                    {place.address}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      <span>Indicazioni</span>
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                      <Share2 className="h-5 w-5" />
                      <span>Condividi posizione</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recensioni">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-secondary">Recensioni recenti</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingReviews ? (
                    <div className="space-y-6">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <Skeleton className="w-12 h-12 rounded-full mr-4" />
                            <div className="flex-1">
                              <Skeleton className="h-5 w-1/3 mb-2" />
                              <Skeleton className="h-4 w-1/4 mb-2" />
                              <Skeleton className="h-4 w-full mb-1" />
                              <Skeleton className="h-4 w-5/6" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : reviews?.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <div className="mr-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium text-primary">
                                {review.userName.substring(0, 2).toUpperCase()}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="font-medium">{review.userName}</h3>
                                <span className="text-sm text-slate-500">
                                  {new Date(review.createdAt).toLocaleDateString('it-IT', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                              <div className="flex text-yellow-400 text-sm mb-2">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400' : ''}`} 
                                  />
                                ))}
                              </div>
                              <p className="text-slate-600">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-4">Nessuna recensione disponibile.</p>
                      <p className="text-slate-600">Sii il primo a condividere la tua esperienza!</p>
                    </div>
                  )}
                  
                  {/* Review Form */}
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <h3 className="font-semibold mb-4">Lascia una recensione</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Il tuo nome</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome e cognome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valutazione:</FormLabel>
                              <div className="flex items-center">
                                <div className="flex text-xl text-slate-300">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star}
                                      className={`h-6 w-6 cursor-pointer ${star <= field.value ? 'text-yellow-400 fill-yellow-400' : ''}`}
                                      onClick={() => {
                                        field.onChange(star);
                                        setSelectedRating(star);
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>La tua esperienza</FormLabel>
                              <FormControl>
                                <Textarea 
                                  rows={4} 
                                  placeholder="Condividi la tua esperienza..."
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit"
                          className="w-full md:w-auto"
                          disabled={submitReviewMutation.isPending}
                        >
                          {submitReviewMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Pubblicazione...
                            </>
                          ) : 'Pubblica recensione'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Reservation Card */}
          <Card className="mb-6 sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-secondary">
                {place.category === "Ristoranti" && "Prenota un tavolo"}
                {place.category === "Hotel" && "Prenota un soggiorno"}
                {place.category !== "Ristoranti" && place.category !== "Hotel" && "Contatta"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(place.category === "Ristoranti" || place.category === "Hotel") && (
                <>
                  <div>
                    <Label className="block text-sm font-medium text-slate-700 mb-1">Data</Label>
                    <Input type="date" className="w-full" />
                  </div>
                  
                  {place.category === "Ristoranti" && (
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-1">Orario</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un orario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="19:30">19:30</SelectItem>
                          <SelectItem value="20:00">20:00</SelectItem>
                          <SelectItem value="20:30">20:30</SelectItem>
                          <SelectItem value="21:00">21:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {place.category === "Hotel" && (
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-1">Data di check-out</Label>
                      <Input type="date" className="w-full" />
                    </div>
                  )}
                  
                  <div>
                    <Label className="block text-sm font-medium text-slate-700 mb-1">
                      {place.category === "Ristoranti" ? "Persone" : "Ospiti"}
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 persona</SelectItem>
                        <SelectItem value="2">2 persone</SelectItem>
                        <SelectItem value="3">3 persone</SelectItem>
                        <SelectItem value="4">4 persone</SelectItem>
                        <SelectItem value="5">5 persone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-secondary text-white">
                    Verifica disponibilità
                  </Button>
                </>
              )}
              
              <div className="text-center">
                <span className="text-sm text-slate-500">
                  {(place.category === "Ristoranti" || place.category === "Hotel") 
                    ? "o contatta direttamente"
                    : "Contatta direttamente"}
                </span>
                <div className="flex justify-center gap-4 mt-2">
                  {place.contactPhone && (
                    <a href={`tel:${place.contactPhone}`} className="text-primary hover:text-secondary transition">
                      <Phone className="h-5 w-5" />
                    </a>
                  )}
                  {place.contactEmail && (
                    <a href={`mailto:${place.contactEmail}`} className="text-primary hover:text-secondary transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Place-specific Chatbot */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-white p-4">
              <CardTitle className="font-semibold">Assistente virtuale</CardTitle>
              <p className="text-sm text-white/80">Risponde alle tue domande 24/7</p>
            </CardHeader>
            <Chatbot placeId={placeId} onClose={() => {}} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
