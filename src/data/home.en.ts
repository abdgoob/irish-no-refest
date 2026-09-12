import { images, svg } from "./assets";

export const site = {
  phone: "+380 63 510 1101",
  email: "sale@sondaven.com",
  address: "Str. I.Petrasha, 6/3, Yaremche, Ivano-Frankivsk region, 78503",
} as const;

export const locationPois = [
  {
    id: "probiy",
    title: "Waterfall Breakdown",
    distance: "6 min.",
    note: "On foot to Probiy waterfall",
    image: images.location.waterfall,
  },
  {
    id: "gedzo",
    title: "Park of Legends “Gedzo”",
    distance: "5 min.",
    note: "On foot to Gedzio Legend Park",
    image: images.location.waterfall,
  },
  {
    id: "hutsulshchyna",
    title: "Hutsulshchyna (restaurant and architectural monument)",
    distance: "7 min.",
    note: "On foot to Hutsulshchyna (restaurant and architectural monument)",
    image: images.location.waterfall,
  },
  {
    id: "dovbucha",
    title: "Dovbucha Rocks",
    distance: "15 min.",
    note: "On foot to Dovbucha Rocks",
    image: images.location.waterfall,
  },
  {
    id: "miniature",
    title: "Park “Carpathians in miniature”",
    distance: "31 min.",
    note: "On foot to Carpathians in Miniature park",
    image: images.location.waterfall,
  },
  {
    id: "market",
    title: "Hutsul Souvenir Market",
    distance: "5 min.",
    note: "On foot to Hutsul souvenir market",
    image: images.location.waterfall,
  },
] as const;

export const benefits = [
  {
    title: "WELLNESS & SPA",
    body: "conceived as a place to restore body and spirit. The spacious wellness complex offers guests: Indoor pool. A collection of saunas and baths, salt and ice rooms. Relaxation and sleep zones where complete harmony reigns. Cosmetology and massage rooms that provide care. Private SPA unit for adults with a panoramic infinity pool and rooms for recovery rituals.",
    image: images.benefits.spa,
  },
  {
    title: "CUISINE",
    body: "Is yet another language through which we tell our legend. The main restaurant offering an author’s interpretation of Hutsul and European cuisines. A rooftop restaurant and bar with panoramic views of the Carpathians. A café patisserie with freshly baked pastries and desserts. A lobby bar with signature cocktails and a refined atmosphere.",
    image: images.benefits.cuisine,
  },
  {
    title: "WHEN EVEN THE SHEEP GUIDE YOU TO YOGA...",
    body: "Our design hotel offers everything you need to stay active. A fitness center with modern equipment. Dedicated spaces for group workouts. Yoga, and TRX training.",
    image: images.benefits.fitness,
  },
  {
    title: "A SPACE WHERE IDEAS ARE BORN",
    body: "An art space for exhibitions, cultural events, festivals, and art installations. A coworking area and a flexible conference venue for business meetings and events of any format.",
    image: images.benefits.art,
  },
  {
    title: "A place where childhood flourishes among the mountains",
    body: "A kids' club and play areas for children of all ages. A dedicated children’s menu in the restaurant, themed celebrations, and creative workshops. We aim to bring comfort to the little ones and their parents alike.",
    image: images.benefits.kids,
  },
  {
    title: "Honoring culture, creating legens",
    body: "Son Daven is a space where traditions come alive. We will revive Hutsul customs in a contemporary form: Caroling with the goat and the star. Celebrating the mystical Kupala Night by the bonfire. And bringing back to life the ancient traditions of the Ukrainian Carpathians.",
    image: images.benefits.culture,
  },
  {
    title: "Kids' cultural camp",
    body: "Our little guests will discover the world through history and legends, In this way, we'll nurture a deep connection to nature and culture from childhood. Learn about local plants and animals. Practice wool weaving. Clay painting. Cheese making.",
    image: images.benefits.camp,
  },
  {
    title: "Dar Daven concept store",
    body: "Collaborations with Ukrainian artists and brands will offer our guests collectible pieces, fashion artifacts, and meaningful keepsakes created exclusively for Son Daven. Among these collaborations is a joint project with KOTO, a contemporary Ukrainian collectible art brand. Created especially for us, a limited-edition series of Hutsul warm essentials by Hutsul Authentica will bring tradition to life in a new form.",
    image: images.benefits.store,
  },
] as const;

export type ApartmentId =
  | "studio"
  | "deluxe"
  | "superior"
  | "suite"
  | "family"
  | "penthouse";

export const apartments: Record<
  ApartmentId,
  {
    label: string;
    price: string;
    guests: string;
    area: string;
    description: string;
    features: string[];
    image: string;
    layoutSvg: string;
  }
> = {
  studio: {
    label: "STUDIO",
    price: "0 UAH per m²",
    guests: "2+1 guests",
    area: "From 50 m²",
    description:
      "A stylish studio apartment with a spacious panoramic living area and integrated kitchen zone.",
    features: [
      "Panoramic living area",
      "Open-plan kitchen",
      "View of the forest, mountains, and Probiy waterfall",
      "Summer terrace",
      "Equipped cooking space",
    ],
    image: images.apartments.studio,
    layoutSvg: svg.apartmentLayout.type1,
  },
  deluxe: {
    label: "DELUXE",
    price: "170 350 грн/м²",
    guests: "2+2 guests",
    area: "From 66 m²",
    description:
      "A superior comfort apartment with a separate bedroom, a spacious panoramic living area, and an integrated kitchen zone.",
    features: [
      "Separate bedroom",
      "Panoramic living area",
      "Terrace",
      "Views of the forest and mountains",
      "Designer interior",
    ],
    image: images.apartments.deluxe,
    layoutSvg: svg.apartmentLayout.type2,
  },
  superior: {
    label: "SUPERIOR",
    price: "170 350 грн/м²",
    guests: "2+2 guests",
    area: "From 93 m²",
    description:
      "A generously-sized apartment with a bedroom, a spacious panoramic living area, and an integrated kitchen zone.",
    features: [
      "Bedroom",
      "Panoramic living area",
      "Views of the forest and mountains",
      "Terrace",
      "Designer interior",
    ],
    image: images.apartments.superior,
    layoutSvg: svg.apartmentLayout.type3,
  },
  suite: {
    label: "SUITE",
    price: "170 350 грн/м²",
    guests: "4+2 guests",
    area: "From 76 m²",
    description:
      "A premium apartment with two bedrooms, a spacious panoramic living area, and an integrated kitchen zone.",
    features: [
      "2 bedrooms",
      "Panoramic living area",
      "Views of the mountains and Probiy waterfall",
      "Panorama of the Carpathians",
      "Large terrace",
      "Designer interior",
    ],
    image: images.apartments.superior,
    layoutSvg: svg.apartmentLayout.type3,
  },
  family: {
    label: "FAMILY",
    price: "170 350 грн/м²",
    guests: "4 guests",
    area: "From 76 m²",
    description:
      "A family-sized apartment with two bedrooms, a spacious panoramic living area, and an integrated kitchen zone.",
    features: [
      "2 separate bedrooms",
      "Views of Yaremche's nature and the mountains",
      "Summer terrace",
      "Designer interior",
    ],
    image: images.apartments.deluxe,
    layoutSvg: svg.apartmentLayout.type2,
  },
  penthouse: {
    label: "PENTHOUSE",
    price: "170 350 грн/м²",
    guests: "4+2 guests",
    area: "From 76 m²",
    description:
      "A premium upper-level apartment with two bedrooms, a spacious panoramic living area, and an integrated kitchen zone.",
    features: [
      "Panoramic living area",
      "Best panoramic views of the mountains and waterfall",
      "Extended terrace",
      "Panorama of the Carpathians",
    ],
    image: images.apartments.studio,
    layoutSvg: svg.apartmentLayout.type1,
  },
};

export const faqItems = [
  {
    q: "IF THE HOTEL IS NOT FULL, WHO GUARANTEES THE INCOME?",
    a: "Revenue depends on real workload, but our financial model is built on conservative indicators (237 days/year). In addition, there is an operating company that is responsible for marketing and booking.",
  },
  {
    q: "CAN I LIVE IN MY APARTMENT?",
    a: "Yes, up to 30 days a year for free. The rest of the time the apartment works as a hotel room and brings income.",
  },
  {
    q: "WHAT IF I WANT TO SELL AN APARTMENT?",
    a: "You can sell it at any time. Yaremche's market capitalization is growing by 18% every year, so resale can be profitable already at the construction stage.",
  },
  {
    q: "WHY ARE INVESTORS PAID DIVIDENDS PER SQUARE METER?",
    a: "This is a fair system: the larger the area of the apartment, the higher the income. For example, 37.23 m² — ≈ 13 030 $/year.",
  },
  {
    q: "ARE THERE ANY GUARANTEES THAT THE CONSTRUCTION WILL BE COMPLETED?",
    a: "The construction is carried out in stages: section 1 — IV quarter 2027, section 2 — I sq. in 2028. There is an approved schedule, licenses, open documents and a partner construction company with experience in the implementation of large objects.",
  },
  {
    q: "WHY NOT JUST BUY AN APARTMENT IN YAREMCHE AND RENT IT YOURSELF?",
    a: "Because it's a different segment. The aparthotel provides: professional service, booking through international systems, marketing and stable occupancy. Self-rental rarely exceeds 20— 30% of the load.",
  },
  {
    q: "WHO RUNS THE HOTEL?",
    a: "Management is carried out by a professional management company with experience in the hotel business. This is the key difference from “apartment for rent”.",
  },
  {
    q: "HOW ARE DIVIDENDS PAID?",
    a: "Annually, in proportion to your apartment area. The first payments are from the first quarter of 2029.",
  },
  {
    q: "IS IT POSSIBLE TO BUY AN APARTMENT IN INSTALLMENTS?",
    a: "So, there are different payment schemes: 100%, 50/50, phased financing.",
  },
] as const;

export const blogPosts = [
  {
    title:
      "Яремче не Буковель. Куди інвестувати в Карпатах у 2026 році",
    excerpt:
      "Чому саме тут формується новий центр прибуткової нерухомості?",
    image: images.blog.news1,
  },
  {
    title: "«The economics are better than in residential real estate»",
    excerpt:
      "Ivano-Frankivsk’s largest developer blago builds its first aparthotel and they’re not alone. What attracts developers to the hotel market?",
    image: images.blog.news1,
  },
  {
    title: "Хід будівництва Son Daven у серпні 2026",
    excerpt:
      "Each investor becomes a co-owner of a premium design hotel that redefines the concept of leisure, elevating it to a level of sensations, aesthetics, and meaning.",
    image: images.blog.news1,
  },
] as const;
