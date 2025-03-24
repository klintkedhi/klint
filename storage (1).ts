import { 
  User, InsertUser, 
  City, InsertCity, 
  Place, InsertPlace, 
  Review, InsertReview, 
  users, cities, places, reviews, 
  categories, tags 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // City operations
  getCities(): Promise<City[]>;
  getFeaturedCities(): Promise<City[]>;
  getCity(id: number): Promise<City | undefined>;
  getCityByName(name: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  // Place operations
  getPlaces(): Promise<Place[]>;
  getPlacesByCity(cityId: number): Promise<Place[]>;
  getPlace(id: number): Promise<Place | undefined>;
  getFeaturedPlaces(): Promise<Place[]>;
  createPlace(place: InsertPlace): Promise<Place>;
  
  // Review operations
  getReviews(placeId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Categories and tags
  getCategories(): Promise<string[]>;
  getTags(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cities: Map<number, City>;
  private places: Map<number, Place>;
  private reviews: Map<number, Review>;
  private userCurrentId: number;
  private cityCurrentId: number;
  private placeCurrentId: number;
  private reviewCurrentId: number;

  constructor() {
    this.users = new Map();
    this.cities = new Map();
    this.places = new Map();
    this.reviews = new Map();
    this.userCurrentId = 1;
    this.cityCurrentId = 1;
    this.placeCurrentId = 1;
    this.reviewCurrentId = 1;

    // Seed initial data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // City operations
  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async getFeaturedCities(): Promise<City[]> {
    return Array.from(this.cities.values()).filter(city => city.isFeatured);
  }

  async getCity(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async getCityByName(name: string): Promise<City | undefined> {
    return Array.from(this.cities.values()).find(
      city => city.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createCity(insertCity: InsertCity): Promise<City> {
    const id = this.cityCurrentId++;
    const city: City = { ...insertCity, id };
    this.cities.set(id, city);
    return city;
  }

  // Place operations
  async getPlaces(): Promise<Place[]> {
    return Array.from(this.places.values());
  }

  async getPlacesByCity(cityId: number): Promise<Place[]> {
    return Array.from(this.places.values()).filter(
      place => place.cityId === cityId
    );
  }

  async getPlace(id: number): Promise<Place | undefined> {
    return this.places.get(id);
  }

  async getFeaturedPlaces(): Promise<Place[]> {
    return Array.from(this.places.values()).filter(place => place.isFeatured);
  }

  async createPlace(insertPlace: InsertPlace): Promise<Place> {
    const id = this.placeCurrentId++;
    const place: Place = { ...insertPlace, id };
    this.places.set(id, place);
    return place;
  }

  // Review operations
  async getReviews(placeId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.placeId === placeId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    return review;
  }

  // Get categories and tags
  async getCategories(): Promise<string[]> {
    return categories;
  }

  async getTags(): Promise<string[]> {
    return tags;
  }

  // Seed data
  private seedData() {
    // Seed cities
    const romaCityData: InsertCity = {
      name: "Roma",
      country: "Italia",
      description: "La città eterna con monumenti storici, arte e cultura millenaria.",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      isFeatured: true,
    };
    this.createCity(romaCityData);

    const milanoCityData: InsertCity = {
      name: "Milano",
      country: "Italia",
      description: "Capitale della moda e del design con un ricco patrimonio culturale.",
      imageUrl: "https://images.unsplash.com/photo-1512199541845-bffa11600ecf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      isFeatured: true,
    };
    this.createCity(milanoCityData);

    const veneziaCityData: InsertCity = {
      name: "Venezia",
      country: "Italia",
      description: "La città dei canali, famosa per la sua bellezza ed architettura unica.",
      imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      isFeatured: true,
    };
    this.createCity(veneziaCityData);

    const firenzeCityData: InsertCity = {
      name: "Firenze",
      country: "Italia",
      description: "Culla del Rinascimento, con musei, arte e architettura straordinari.",
      imageUrl: "https://images.unsplash.com/photo-1595815771614-ade501d22bf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      isFeatured: true,
    };
    this.createCity(firenzeCityData);

    const napoliCityData: InsertCity = {
      name: "Napoli",
      country: "Italia",
      description: "Città dal carattere vivace, famosa per la pizza e il ricco patrimonio storico.",
      imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      isFeatured: true,
    };
    this.createCity(napoliCityData);

    // Seed places
    const laPergolaData: InsertPlace = {
      name: "Ristorante La Pergola",
      description: "La Pergola è un ristorante stellato situato all'ultimo piano dell'Hotel Rome Cavalieri, con una vista mozzafiato sulla Città Eterna. Sotto la guida dell'Executive Chef Heinz Beck, il ristorante ha ottenuto tre stelle Michelin ed è considerato uno dei migliori d'Italia.",
      address: "Via Alberto Cadlolo, 101, 00136 Roma RM",
      cityId: 1, // Roma
      category: "Ristoranti",
      rating: 48, // 4.8/5
      reviewCount: 458,
      priceLevel: "$$$",
      contactPhone: "+39 06 3509 2152",
      contactEmail: "info@ristorantelapergola.it",
      openingHours: "Mar-Sab: 19:30-23:00, Domenica e Lunedì: Chiuso",
      tags: ["Fine Dining", "Vista Panoramica"],
      images: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      ],
      isFeatured: true,
      latitude: "41.9187",
      longitude: "12.4479",
    };
    this.createPlace(laPergolaData);

    const uffiziData: InsertPlace = {
      name: "Galleria degli Uffizi",
      description: "La Galleria degli Uffizi è uno dei musei più importanti del mondo, che ospita una collezione di opere inestimabili, in particolare del periodo del Rinascimento italiano.",
      address: "Piazzale degli Uffizi, 6, 50122 Firenze FI",
      cityId: 4, // Firenze
      category: "Musei",
      rating: 47, // 4.7/5
      reviewCount: 325,
      priceLevel: "$$",
      contactPhone: "+39 055 294883",
      contactEmail: "info@uffizi.it",
      openingHours: "Mar-Dom: 08:15-18:50, Lunedì: Chiuso",
      tags: ["Arte", "Rinascimento"],
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
      ],
      isFeatured: true,
      latitude: "43.7677",
      longitude: "11.2553",
    };
    this.createPlace(uffiziData);

    const hotelCiprianiData: InsertPlace = {
      name: "Belmond Hotel Cipriani",
      description: "Il Belmond Hotel Cipriani è uno degli hotel più lussuosi di Venezia, situato sull'isola della Giudecca con una vista mozzafiato sulla laguna e su Piazza San Marco.",
      address: "Giudecca 10, 30133 Venezia VE",
      cityId: 3, // Venezia
      category: "Hotel",
      rating: 49, // 4.9/5
      reviewCount: 187,
      priceLevel: "$$$$",
      contactPhone: "+39 041 240801",
      contactEmail: "info.cip@belmond.com",
      openingHours: "Aperto 24/7",
      tags: ["Lusso", "Vista Laguna"],
      images: [
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
      ],
      isFeatured: true,
      latitude: "45.4254",
      longitude: "12.3462",
    };
    this.createPlace(hotelCiprianiData);

    // Seed reviews
    this.createReview({
      placeId: 1,
      userName: "Marco Rossi",
      rating: 5,
      comment: "Un'esperienza culinaria straordinaria! Ogni piatto è una vera opera d'arte, con sapori incredibilmente bilanciati. Il servizio è impeccabile e la vista su Roma al tramonto è semplicemente magica. Certamente non economico, ma vale ogni euro per un'occasione speciale."
    });

    this.createReview({
      placeId: 1,
      userName: "Laura Bianchi",
      rating: 4,
      comment: "Il cibo è squisito e la presentazione è impressionante. Ho tolto una stella solo per il tempo di attesa tra le portate, un po' troppo lungo. Il sommelier è molto competente e ci ha consigliato un vino perfetto. L'ambiente è elegante senza essere troppo formale."
    });
  }
}

export const storage = new MemStorage();
