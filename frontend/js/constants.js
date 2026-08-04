/* ==========================================================================
   constants.js — static data + config keys shared by every page.
   No DOM access here, no dependencies on other modules: this file must be
   loadable first and safe to include on any page.
   ========================================================================== */

const RECIPIENTS = [
  { key: "partner",     icon: "💞", name: "Partner" },
  { key: "wife",        icon: "💍", name: "Wife" },
  { key: "husband",     icon: "🤵", name: "Husband" },
  { key: "girlfriend",  icon: "💜", name: "Girlfriend" },
  { key: "boyfriend",   icon: "💙", name: "Boyfriend" },
  { key: "mother",      icon: "🌷", name: "Mother" },
  { key: "father",      icon: "🌳", name: "Father" },
  { key: "sister",      icon: "🎀", name: "Sister" },
  { key: "brother",     icon: "🏀", name: "Brother" },
  { key: "daughter",    icon: "🧒", name: "Daughter" },
  { key: "son",         icon: "🧑", name: "Son" },
  { key: "friend",      icon: "🤝", name: "Friend" },
  { key: "bestfriend",  icon: "✨", name: "Best Friend" },
  { key: "teacher",     icon: "🍎", name: "Teacher" },
  { key: "boss",        icon: "💼", name: "Boss" },
  { key: "colleague",   icon: "🗂️", name: "Colleague" },
  { key: "family",      icon: "🏡", name: "Family" },
  { key: "grandparents",icon: "🧓", name: "Grandparents" },
  { key: "pet",         icon: "🐾", name: "Pet" },
  { key: "custom",      icon: "✏️", name: "Custom" }
];

// Occasions grouped into categories for a friendlier browse experience
// across a 30-item list. The group label is a UI convenience only.
const OCCASION_GROUPS = [
  {
    label: "Celebrations",
    items: [
      { key: "birthday",    icon: "🎂", name: "Birthday" },
      { key: "congrats",    icon: "🎉", name: "Congratulations" },
      { key: "graduation",  icon: "🎓", name: "Graduation" },
      { key: "promotion",   icon: "📈", name: "Promotion" },
      { key: "retirement",  icon: "🌅", name: "Retirement" },
      { key: "newbaby",     icon: "👶", name: "New Baby" },
      { key: "housewarming",icon: "🏠", name: "Housewarming" }
    ]
  },
  {
    label: "Love & relationships",
    items: [
      { key: "anniversary", icon: "💍", name: "Anniversary" },
      { key: "wedding",     icon: "💐", name: "Wedding" },
      { key: "engagement",  icon: "💎", name: "Engagement" },
      { key: "valentines",  icon: "❤️", name: "Valentine's Day" },
      { key: "friendship",  icon: "🤍", name: "Friendship Day" }
    ]
  },
  {
    label: "Holidays & festivals",
    items: [
      { key: "mothersday",  icon: "🌷", name: "Mother's Day" },
      { key: "fathersday",  icon: "🎣", name: "Father's Day" },
      { key: "christmas",   icon: "🎄", name: "Christmas" },
      { key: "newyear",     icon: "🎆", name: "New Year" },
      { key: "diwali",      icon: "🪔", name: "Diwali" },
      { key: "eid",         icon: "🌙", name: "Eid" },
      { key: "holi",        icon: "🎨", name: "Holi" },
      { key: "rakhi",       icon: "🧵", name: "Raksha Bandhan" },
      { key: "thanksgiving",icon: "🍂", name: "Thanksgiving" },
      { key: "halloween",   icon: "🎃", name: "Halloween" }
    ]
  },
  {
    label: "Support & sentiment",
    items: [
      { key: "getwell",     icon: "🌼", name: "Get Well Soon" },
      { key: "sorry",       icon: "💔", name: "Sorry" },
      { key: "thankyou",    icon: "🙏", name: "Thank You" },
      { key: "missyou",     icon: "⭐", name: "Miss You" },
      { key: "goodluck",    icon: "🍀", name: "Good Luck" },
      { key: "farewell",    icon: "✈️", name: "Farewell" },
      { key: "welcome",     icon: "🌟", name: "Welcome" }
    ]
  },
  {
    label: "Something else",
    items: [{ key: "custom", icon: "✏️", name: "Custom" }]
  }
];
const OCCASIONS = OCCASION_GROUPS.flatMap((g) => g.items);

const STYLES = [
  { key: "elegant",  icon: "🕊️", name: "Elegant",  desc: "Thin gold frame, refined" },
  { key: "cute",     icon: "🐣", name: "Cute",     desc: "Soft, bubbly, playful" },
  { key: "romantic", icon: "❤️", name: "Romantic", desc: "Warm and heartfelt" },
  { key: "floral",   icon: "🌸", name: "Floral",   desc: "Blooming corners" },
  { key: "modern",   icon: "🔷", name: "Modern",   desc: "Bold color block" },
  { key: "minimal",  icon: "◻️", name: "Minimal",  desc: "Clean and quiet" },
  { key: "luxury",   icon: "🖤", name: "Luxury",   desc: "Ink and gold foil" },
  { key: "cartoon",  icon: "⭐", name: "Cartoon",  desc: "Bold and fun" },
  { key: "galaxy",   icon: "🌌", name: "Galaxy",   desc: "Starry night sky" },
  { key: "neon",     icon: "💡", name: "Neon",     desc: "Glowing night mode" },
  { key: "vintage",  icon: "📜", name: "Vintage",  desc: "Sepia and hairlines" },
  { key: "nature",   icon: "🌿", name: "Nature",   desc: "Leafy and organic" }
];

// Styles that carry their own fixed background — the color-theme step is
// disabled (not removed) when one of these is selected.
const FIXED_PALETTE_STYLES = ["luxury", "galaxy", "neon", "vintage", "nature"];

const THEMES = [
  { key: "blush",    name: "Blush",    swatch: "linear-gradient(135deg,#ffd0dc,#ff9fb4)" },
  { key: "sunset",   name: "Sunset",   swatch: "linear-gradient(135deg,#ffd9a8,#ff9b52)" },
  { key: "ocean",    name: "Ocean",    swatch: "linear-gradient(135deg,#c7e9f3,#5fb6d6)" },
  { key: "forest",   name: "Forest",   swatch: "linear-gradient(135deg,#d3e6c9,#7fae6c)" },
  { key: "lavender", name: "Lavender", swatch: "linear-gradient(135deg,#e2d3f3,#a97be0)" },
  { key: "gold",     name: "Gold",     swatch: "linear-gradient(135deg,#f3dfa4,#c79a3c)" },
  { key: "classic",  name: "Classic Red", swatch: "linear-gradient(135deg,#f8c9ce,#c6395a)" },
  { key: "mono",     name: "Monochrome", swatch: "linear-gradient(135deg,#e3e3df,#8c8c86)" }
];

const THEME_COLORS = {
  blush:    { stops: ["#fff5f6", "#ffe1e8", "#ffd0dc"], text: "#2c2338" },
  sunset:   { stops: ["#fff3e2", "#ffd9a8", "#ffb37a"], text: "#2c2338" },
  ocean:    { stops: ["#eaf7fb", "#c7e9f3", "#a7d8ec"], text: "#2c2338" },
  forest:   { stops: ["#f2f7ef", "#d3e6c9", "#b7d8a9"], text: "#2c2338" },
  lavender: { stops: ["#f6f1fb", "#e2d3f3", "#cdb2ec"], text: "#2c2338" },
  gold:     { stops: ["#fdf7e6", "#f3dfa4", "#e6c877"], text: "#2c2338" },
  classic:  { stops: ["#fff0f0", "#f8c9ce", "#e8929d"], text: "#2c2338" },
  mono:     { stops: ["#f7f7f5", "#e3e3df", "#cfcfc9"], text: "#26262a" }
};

// Fixed-palette styles resolve to their own stops regardless of the chosen
// color theme (mirrors the CSS !important overrides in themes.css).
const FIXED_STYLE_COLORS = {
  luxury:  { stops: ["#241f3a", "#33294d", "#1b1729"], text: "#e6c877", body: "rgba(250,246,238,0.9)" },
  galaxy:  { stops: ["#3a2d64", "#241a44", "#150f29"], text: "#e6c877", body: "rgba(234,230,255,0.85)" },
  neon:    { stops: ["#12111a", "#16141f", "#0d0c13"], text: "#e26c86", body: "rgba(246,246,255,0.85)" },
  vintage: { stops: ["#f2e3c6", "#e6cf9e", "#d8b876"], text: "#4a3620", body: "#4a3620" },
  nature:  { stops: ["#eef5e6", "#cfe3bb", "#a9cc8f"], text: "#3d5a2b", body: "#2f4023" }
};

// Message starters, keyed by occasion; occasions not listed fall back to
// SUGGESTIONS.custom.
const SUGGESTIONS = {
  birthday: [
    "Wishing you a year as wonderful as you are.",
    "Hope your day is full of your favorite things.",
    "Another year of you — the world's better for it."
  ],
  anniversary: [
    "Here's to us, and everything still ahead.",
    "Grateful for every ordinary day with you.",
    "Still my favorite person, all these years on."
  ],
  wedding: [
    "Wishing you a lifetime of easy mornings together.",
    "Here's to a love that only gets better.",
    "So happy to celebrate the two of you."
  ],
  engagement: [
    "So thrilled this is official now — congratulations.",
    "Here's to the beginning of forever.",
    "Couldn't be happier for the two of you."
  ],
  valentines: [
    "You're still my favorite reason to slow down.",
    "Every day feels a little easier with you in it.",
    "Just wanted you to know you're loved, today and always."
  ],
  friendship: [
    "Glad the years haven't changed us much.",
    "Thanks for being the constant in a lot of change.",
    "Here's to more inside jokes and late-night calls."
  ],
  thankyou: [
    "I noticed, and it meant more than you know.",
    "Thank you for showing up when it counted.",
    "Small thing to write, big thing to feel — thank you."
  ],
  congrats: [
    "You worked for this. Enjoy every bit of it.",
    "So proud doesn't begin to cover it.",
    "Cheers to you and what comes next."
  ],
  getwell: [
    "Sending comfort and easy, restful days.",
    "Take your time — we'll be here when you're back.",
    "Thinking of you, hoping each day feels lighter."
  ],
  sorry: [
    "I got it wrong, and I'm sorry for the part I played.",
    "Wanted to say it plainly: I'm sorry.",
    "This doesn't undo it, but I mean it — I'm sorry."
  ],
  missyou: [
    "It's quieter around here without you.",
    "Thinking of you more than usual today.",
    "Can't wait for the next time our paths cross."
  ],
  goodluck: [
    "You've prepared for this. Go show them.",
    "Rooting for you today and however it goes.",
    "Wishing you steady nerves and a little luck."
  ],
  farewell: [
    "It won't be the same without you around.",
    "Here's to the next chapter — go make it a good one.",
    "Thank you for everything before the goodbye."
  ],
  welcome: [
    "So glad you're here — settle in.",
    "Welcome aboard, we've been looking forward to this.",
    "Here's to a great start."
  ],
  graduation: [
    "One chapter closes so a better one can open.",
    "All that work, and it shows. Congratulations.",
    "Excited to see what you build next."
  ],
  promotion: [
    "Earned, not given. Congratulations on the new role.",
    "They noticed what we already knew about you.",
    "Here's to the next challenge — you're ready."
  ],
  retirement: [
    "Here's to slower mornings and long-earned rest.",
    "Thank you for the years of showing up.",
    "The next chapter looks good on you already."
  ],
  newbaby: [
    "Welcome to the world, little one.",
    "So much love headed your way, all three of you.",
    "Enjoy every impossibly tiny detail."
  ],
  housewarming: [
    "Wishing you long years of good mornings here.",
    "May this place hold you well.",
    "Here's to new walls and old friends visiting often."
  ],
  mothersday: [
    "Thank you for a thousand quiet, unglamorous kindnesses.",
    "Everything good in me traces back to you.",
    "Hope today gives you back a fraction of what you give."
  ],
  fathersday: [
    "Thanks for the steady hand, even from a distance.",
    "You made hard things look simple. I noticed.",
    "Grateful for you today and every day."
  ],
  christmas: [
    "Wishing you a warm and unhurried Christmas.",
    "Hope this season brings you exactly what you need.",
    "Sending you all the comfort of the holidays."
  ],
  newyear: [
    "Here's to whatever this next year brings.",
    "Wishing you a lighter, kinder year ahead.",
    "Onward — I'm glad to know you in it."
  ],
  diwali: [
    "Wishing you a Diwali as bright as your spirit.",
    "May this festival of lights bring you peace.",
    "Here's to good fortune and better company."
  ],
  eid: [
    "Eid Mubarak — wishing you peace and good company.",
    "Hoping this Eid brings you joy and calm.",
    "Sending warmth to you and your family this Eid."
  ],
  holi: [
    "Wishing you a Holi full of color and laughter.",
    "Here's to a bright, joyful Holi.",
    "Hope the day is loud, colorful, and fun."
  ],
  rakhi: [
    "Grateful to have you as my sibling, today and always.",
    "Distance never really changes this bond.",
    "Wishing you all the good this Raksha Bandhan."
  ],
  thanksgiving: [
    "Genuinely grateful to have you in my life.",
    "Thankful for you this year, and every year.",
    "Hope your table is full and your heart fuller."
  ],
  halloween: [
    "Hope your night is spooky in the fun way only.",
    "Wishing you a Halloween full of good candy.",
    "Have a wonderfully weird Halloween."
  ],
  custom: [
    "Wanted you to know I'm thinking of you.",
    "This felt like the right day to say it.",
    "No occasion needed — just wanted to reach out."
  ]
};

// Featured occasions shown as quick-start chips on the landing page.
const FEATURED_OCCASION_KEYS = ["birthday", "anniversary", "wedding", "thankyou", "congrats", "newbaby"];

// localStorage / sessionStorage keys, centralized so every module agrees.
const STORAGE_KEY = "celebrifyCardDraft";
const COLOR_MODE_KEY = "celebrifyColorMode";
const UNLOCK_FLAG_KEY = "celebrifyUnlocked";

// Wizard shape
const STEP_LABELS = ["Recipient", "Occasion", "Style", "Color", "Upload", "Personalize"];
const TOTAL_STEPS = STEP_LABELS.length;
const MAX_PHOTOS = 4;

// Where the payment backend lives. Change this to your deployed backend's
// URL once you deploy it (see backend/README or docs/API.md).
window.CELEBRIFY_CONFIG = window.CELEBRIFY_CONFIG || { API_BASE_URL: "https://celebrify-backend.onrender.com" };
