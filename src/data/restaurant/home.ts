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
    /** Menu browser still lives on the apartments section ID. */
    menu: "#apartments",
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
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ],
} as const;

export const faq = {
  title: "ANSWERS TO KEY QUESTIONS",
  subtitle: "Before you visit",
  items: [
    {
      q: "DO YOU TAKE RESERVATIONS?",
      a: "Yes. We hold tables for dinner and busy match nights. Walk-ins are welcome when we have room—call ahead on weekends if you want a guaranteed spot.",
    },
    {
      q: "WHAT ARE YOUR HOURS?",
      a: "The kitchen runs lunch through late evening; the bar often stays open after last food order. Hours shift slightly by day—check our site or socials for the current week.",
    },
    {
      q: "DO YOU ACCOMMODATE DIETARY NEEDS AND ALLERGIES?",
      a: "Tell your server when you sit down. We can guide you on gluten, vegetarian, and common allergens, though our kitchen handles fish, shellfish, dairy, and nuts.",
    },
    {
      q: "IS THERE LIVE MUSIC?",
      a: "Regular acoustic and trad sessions on select nights. There is no cover; just order from the bar or kitchen like any other evening.",
    },
    {
      q: "DO YOU OFFER PRIVATE DINING OR EVENTS?",
      a: "We have a semi-private room for birthdays, team dinners, and small celebrations. Email us with your date and head count and we will send options and a set menu.",
    },
    {
      q: "ARE CHILDREN WELCOME?",
      a: "Families are welcome at lunch and early dinner. Later evenings lean toward the bar crowd; use your judgment for very young children after 8 p.m.",
    },
    {
      q: "DO YOU HAVE PARKING?",
      a: "Street parking and nearby lots around the neighborhood. Rideshare drop-off at the front door is usually the easiest on busy nights.",
    },
    {
      q: "CAN I ORDER FOOD TO GO?",
      a: "Takeaway is available for most menu items when the kitchen is open. Online ordering will be linked here when the client platform is live.",
    },
    {
      q: "IS THERE A DRESS CODE?",
      a: "Come as you are—Austin casual. We only ask that guests stay comfortable and respectful of a shared dining room.",
    },
  ],
} as const;

/** TEMPORARY DEMO COPY — REPLACE WITH CLIENT CONTENT */
export const menuHead = {
  eyebrow: "+++ THE MENU +++",
  title: "MADE FOR THE TABLE.",
  note: "An editorial look at the house — not a live client menu.",
  typesLabel: "THE TABLE",
  examplesLabel: "A few of the plates.",
  cta: "VIEW FULL MENU",
} as const;

export type MenuCategoryId =
  | "starters"
  | "classics"
  | "mains"
  | "burgers"
  | "desserts"
  | "drinks";

export const menuTabOrder: MenuCategoryId[] = [
  "starters",
  "classics",
  "mains",
  "burgers",
  "desserts",
  "drinks",
];

/** TEMPORARY DEMO COPY — REPLACE WITH CLIENT CONTENT */
export const menuCategories: Record<
  MenuCategoryId,
  {
    label: string;
    statement: string;
    line: string;
    body: string;
    image: string;
    /** Placeholder names for layout balance only. Not a real menu. */
    examples: readonly string[];
    demo: true;
  }
> = {
  starters: {
    demo: true,
    label: "STARTERS",
    statement: "For the middle of the table.",
    line: "Bread, small plates, things to share.",
    body: "A few dishes to open the evening — meant to be reached for, not plated for one.",
    image: "/assets/restaurant/menu/menu-starters.webp",
    examples: ["Soda bread", "Cultured butter", "Smoked salmon"],
  },
  classics: {
    demo: true,
    label: "IRISH CLASSICS",
    statement: "The dishes worth coming back for.",
    line: "Comforting. Generous. Familiar.",
    body: "The house plates — rich, unfussy, and built for a proper sitting.",
    image: "/assets/restaurant/menu/menu-irish-classics.webp",
    examples: ["Cottage pie", "Dark gravy", "Greens"],
  },
  mains: {
    demo: true,
    label: "MAINS",
    statement: "Made properly. Served generously.",
    line: "Roasts, fish, the larger plates.",
    body: "Food that arrives as if someone in the kitchen still believes in a full plate.",
    image: "/assets/restaurant/menu/menu-mains.webp",
    examples: ["Roast chicken", "Seasonal greens", "Herb jus"],
  },
  burgers: {
    demo: true,
    label: "BURGERS",
    statement: "Public-house comfort, done with care.",
    line: "A bun, a proper patty, hand-cut chips.",
    body: "Not a stunt. Just a burger that belongs in this room.",
    image: "/assets/restaurant/menu/menu-burgers.webp",
    examples: ["House burger", "Hand-cut chips"],
  },
  desserts: {
    demo: true,
    label: "DESSERTS",
    statement: "Save a little room.",
    line: "Warm, dark, and worth the wait.",
    body: "Something sweet after the plates are cleared — still of the house, not a pastry case.",
    image: "/assets/restaurant/menu/menu-desserts.webp",
    examples: ["Sticky toffee", "Warm sauce", "Cream"],
  },
  drinks: {
    demo: true,
    label: "DRINKS",
    statement: "A proper pint and something stronger.",
    line: "Stout. Whiskey. A late cocktail.",
    body: "Poured with patience, then left alone to do their work.",
    image: "/assets/restaurant/menu/menu-drinks.webp",
    examples: ["Stout", "Whiskey", "Cocktails"],
  },
};

/** TEMPORARY DEMO COPY — REPLACE WITH CLIENT CONTENT */
export const foodDrinks = {
  ariaLabel: "Food and drinks",
  food: {
    tab: "FOOD",
    copy: "PLATES FOR THE WHOLE TABLE. Food that arrives generous, familiar, and worth reaching across for.",
    image: "/assets/restaurant/states/restaurant-food-state.webp",
  },
  drinks: {
    tab: "DRINKS",
    heading: "POURED",
    note: "PROPERLY. A pint with patience. Cocktails after dark. Something stronger when the table stays late.",
    image: "/assets/restaurant/states/restaurant-drinks-state.webp",
  },
  cta: "RESERVE",
} as const;

/** TEMPORARY DEMO COPY — REPLACE WITH CLIENT CONTENT */
export const houseCraft = {
  eyebrow: "THE KITCHEN",
  title: "COOK WITH CARE. SERVE WITH GENEROSITY.",
  body: "A modern public house still depends on simple things done properly: a kitchen that respects the ingredients, a bar that respects the pour, and a room that makes people want to stay.",
  image: "/assets/restaurant/atmosphere/restaurant-heritage-bg.webp",
  lockupLines: ["THE HOUSE", "AUSTIN"],
} as const;
