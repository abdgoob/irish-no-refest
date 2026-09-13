/** Phase-1 restaurant copy and destinations. Swap the name here later. */

export const restaurant = {
  name: "The House",
  locationLine: "Austin, Texas",
} as const;

/**
 * Real booking / ordering URLs are not available yet.
 * `null` means the control must use a safe on-page fallback.
 */
export const urls = {
  reserve: null as string | null,
  order: null as string | null,
  menu: null as string | null,
  /** Temporary on-page destinations until real URLs exist. */
  fallbacks: {
    reserve: "#hero",
    order: "#benefits",
    menu: "#benefits",
  },
} as const;

export function actionHref(
  key: "reserve" | "order" | "menu",
): string {
  return urls[key] ?? urls.fallbacks[key];
}

export const hero = {
  eyebrow: "AUSTIN, TEXAS",
  metaLeft: ["GOOD FOOD.", "GOOD DRINK."],
  metaCenter: ["A MODERN", "PUBLIC HOUSE"],
  metaRight: ["GOOD", "COMPANY."],
  primaryCta: "RESERVE A TABLE",
  secondaryCta: "VIEW MENU",
} as const;

export const prologue = {
  label: "PROLOGUE",
  quote:
    "“A PUB IS MORE THAN SOMEWHERE TO EAT. IT IS THE TABLE PEOPLE RETURN TO—THE PINT POURED PROPERLY, THE SHARED PLATE, THE SONG THAT KEEPS THE ROOM A LITTLE LONGER. HERE, HOSPITALITY IS THE HOUSE ITSELF.”",
} as const;

export const about = {
  heading: "THE HOUSE",
  byline: "AUSTIN, TEXAS",
  image: "/assets/restaurant/story/restaurant-story.webp",
  imageAlt: "The pass",
  columns: [
    {
      title: "OUR STORY",
      body: "A CONTEMPORARY IRISH PUBLIC HOUSE IN AUSTIN: FOOD MADE FOR SHARING, DRINKS POURED WITH CARE, AND A ROOM THAT HOLDS MUSIC, MATCHES, AND THE LONG CONVERSATION AFTER.",
    },
    {
      title: "THE TABLE",
      body: "COME FOR THE CLASSICS. STAY FOR THE PINT, THE SONG, THE CROWD. THIS IS A HOUSE BUILT FOR EVENINGS THAT RUN A LITTLE LONGER THAN PLANNED.",
    },
  ],
  closer:
    "GOOD FOOD. GOOD DRINK. GOOD COMPANY. THAT IS THE WHOLE IDEA.",
} as const;

export const experiencesHead = {
  eyebrow: "THE HOUSE",
  title: "COME FOR THE FOOD. STAY FOR THE NIGHT.",
} as const;

export const experiences = [
  {
    title: "IRISH CLASSICS",
    body: "Plates meant for the table, not the photograph.",
    image: "/assets/restaurant/experiences/experience-signature.webp",
  },
  {
    title: "A PROPER PINT",
    body: "Poured with patience, served without hurry.",
    image: "/assets/restaurant/experiences/experience-guinness.webp",
  },
  {
    title: "LIVE MUSIC",
    body: "Nights when the room leans in and stays.",
    image: "/assets/restaurant/experiences/experience-live-music.webp",
  },
  {
    title: "MATCH DAYS",
    body: "A crowd, a screen, and a table that fills itself.",
    image: "/assets/restaurant/experiences/experience-match-day.webp",
  },
  {
    title: "WEEKEND BRUNCH",
    body: "Slow mornings, strong coffee, a proper plate.",
    image: "/assets/restaurant/experiences/experience-brunch.webp",
  },
  {
    title: "COCKTAILS",
    body: "Evening drinks with a quiet kind of ceremony.",
    image: "/assets/restaurant/experiences/experience-cocktails.webp",
  },
  {
    title: "PRIVATE DINING",
    body: "A room of your own, still part of the house.",
    image: "/assets/restaurant/experiences/experience-private-dining.webp",
  },
  {
    title: "AFTER DARK",
    body: "When dinner becomes the night.",
    image: "/assets/restaurant/experiences/experience-night.webp",
  },
] as const;

export const nav = {
  menuLabel: "MENU",
  reserveLabel: "RESERVE",
  /** Short header slot (replaces UA). Full phrase lives in the overlay. */
  orderHeaderLabel: "ORDER",
  orderLabel: "ORDER ONLINE",
  links: [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "Our Story" },
    { href: "#benefits", label: "The House" },
    { href: actionHref("menu"), label: "Menu" },
    { href: actionHref("order"), label: "Order" },
    { href: "#apartments", label: "Apartments" },
    { href: "#finance", label: "Finance" },
    { href: "#blog", label: "News" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ],
} as const;
