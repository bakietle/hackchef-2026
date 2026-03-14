export const WEEK_MODES = [
  { key:'glow',   name:'Glow-Up',      emoji:'✨', desc:'balanced, feel good vibes',  color:'#F5C842', light:'#FFF8DC', badge:'glow' },
  { key:'beast',  name:'Beast Mode',   emoji:'💪', desc:'protein focus, build muscle', color:'#FF6B5B', light:'#FFE8E5', badge:'beast' },
  { key:'green',  name:'Green Queen',  emoji:'🌿', desc:'veggie-forward, plant power', color:'#7ED8A4', light:'#E0F5EC', badge:'green' },
  { key:'snack',  name:'Snack Attack', emoji:'🍿', desc:'fun, colorful, foodie indulgent', color:'#C8F135', light:'#F0FAC0', badge:'snack' },
  { key:'fancy',  name:'Fancy Chef',   emoji:'🎩', desc:'elevated, impress ur tastebuds', color:'#B8A0F8', light:'#EDE0FF', badge:'fancy' },
]

export const RECIPES = [
  { id:'r1',  name:'Garlic Fried Rice',     flag:'🍚', cuisine:'Chinese-Aussie',  mode:'glow',  time:10, cost:3, fuel:82, cal:420, pro:'14g', carb:'65g', fat:'10g', sugar:'2g', tags:['carb','quick'],
    steps:['Heat 2 tbsp oil in wok on high','Add 3 minced garlic cloves, fry 30s','Tip cold rice, stir-fry 4 mins','Push rice aside, scramble 2 eggs','Fold egg through rice','Season soy + sesame oil + pepper'],
    miss:['garlic ($1)'], saved:false },
  { id:'r2',  name:'Vietnamese Pho',         flag:'🍜', cuisine:'Vietnamese',      mode:'glow',  time:25, cost:7, fuel:88, cal:380, pro:'28g', carb:'42g', fat:'8g',  sugar:'4g', tags:['protein','hearty'],
    steps:['Simmer chicken with ginger + star anise 20 min','Shred chicken','Cook rice noodles, drain','Add fish sauce + sugar to broth','Bowl: noodles + chicken + hot broth','Top: sprouts + herbs + lime'],
    miss:['rice noodles ($2)','star anise ($1.50)'], saved:false },
  { id:'r3',  name:'Shakshuka',              flag:'🍳', cuisine:'Middle Eastern',  mode:'beast', time:20, cost:6, fuel:91, cal:320, pro:'22g', carb:'28g', fat:'14g', sugar:'6g', tags:['protein','veggie'],
    steps:['Fry onion + garlic until soft','Add cumin + paprika, stir 1 min','Add crushed tomatoes, simmer 10 min','Make 4 wells in sauce','Crack egg into each well','Cover, cook 5-7 min yolks runny'],
    miss:['feta ($3)','bread ($2.50)'], saved:false },
  { id:'r4',  name:'Pasta Aglio e Olio',     flag:'🍝', cuisine:'Italian',         mode:'snack', time:12, cost:4, fuel:74, cal:490, pro:'12g', carb:'70g', fat:'18g', sugar:'3g', tags:['carb','quick'],
    steps:['Boil spaghetti in salted water','Heat ¼ cup olive oil, fry sliced garlic','Add chilli flakes 30s','Drain pasta saving 1 cup water','Add pasta to oil with water splash','Toss off heat, parsley + parmesan'],
    miss:['parmesan ($2)'], saved:false },
  { id:'r5',  name:'Chicken Burrito Bowl',   flag:'🌯', cuisine:'Mexican',         mode:'beast', time:20, cost:6, fuel:85, cal:480, pro:'32g', carb:'55g', fat:'11g', sugar:'3g', tags:['protein','meal-prep'],
    steps:['Season chicken cumin + paprika + garlic','Pan fry 6 min each side','Rest 5 min then slice','Cook rice with lime + coriander','Heat black beans with cumin','Bowl: rice + chicken + beans + salsa'],
    miss:['black beans ($1.50)'], saved:false },
  { id:'r6',  name:'Butter Chicken',         flag:'🍛', cuisine:'Indian',          mode:'fancy', time:30, cost:8, fuel:87, cal:520, pro:'32g', carb:'48g', fat:'16g', sugar:'8g', tags:['protein','rich'],
    steps:['Marinate chicken yogurt + turmeric 10 min','Char chicken on high heat','Sauté onion + garlic + ginger + tomato paste','Add butter + cream + garam masala','Return chicken, simmer 15 min','Serve over basmati'],
    miss:['garam masala ($2.50)','cream ($2)'], saved:false },
  { id:'r7',  name:'Korean Bibimbap',        flag:'🍱', cuisine:'Korean',          mode:'green', time:20, cost:7, fuel:90, cal:480, pro:'30g', carb:'60g', fat:'11g', sugar:'5g', tags:['veggie','balanced'],
    steps:['Cook short-grain rice','Sauté spinach with garlic + sesame oil','Blanch sprouts, toss sesame + salt','Julienne carrot, stir-fry 2 min','Fry egg sunny-side, yolk runny','Bowl: rice + veg + egg + gochujang'],
    miss:['gochujang ($3.50)','spinach ($2)'], saved:false },
  { id:'r8',  name:'Halloumi Wrap',          flag:'🫓', cuisine:'Mediterranean',  mode:'green', time:10, cost:6, fuel:77, cal:390, pro:'20g', carb:'45g', fat:'16g', sugar:'4g', tags:['veggie','quick'],
    steps:['Slice halloumi 1cm thick','Pan fry HIGH no oil, 2 min per side','Warm flatbread 30s','Spread hummus on bread','Layer halloumi + peppers + rocket','Roll, slice diagonal'],
    miss:['halloumi ($4)','hummus ($2)'], saved:false },
  { id:'r9',  name:'Miso Ramen',             flag:'🍥', cuisine:'Japanese',        mode:'snack', time:15, cost:6, fuel:79, cal:420, pro:'18g', carb:'58g', fat:'10g', sugar:'4g', tags:['umami','comforting'],
    steps:['Boil ramen noodles 3 min, drain','Mix miso + soy + sesame oil in bowl','Pour 300ml hot water, stir','Add noodles','Top: soft egg + corn + nori + spring onion','Drizzle chilli oil'],
    miss:['miso paste ($3)','nori ($2)'], saved:false },
  { id:'r10', name:'Acai Smoothie Bowl',     flag:'🫐', cuisine:'Healthy',         mode:'glow',  time:8,  cost:5, fuel:80, cal:340, pro:'8g',  carb:'62g', fat:'9g',  sugar:'22g', tags:['veggie','breakfast'],
    steps:['Blend frozen acai + banana + almond milk until thick','Pour into bowl','Top: granola + berries + coconut flakes + honey','Add sliced banana on side','Drizzle peanut butter','Eat immediately before it melts'],
    miss:['acai pack ($4)'], saved:false },
  { id:'r11', name:'Avocado Toast Deluxe',   flag:'🥑', cuisine:'Cafe Style',      mode:'glow',  time:10, cost:5, fuel:76, cal:320, pro:'10g', carb:'38g', fat:'18g', sugar:'2g', tags:['veggie','breakfast'],
    steps:['Toast thick sourdough until golden','Smash avocado with lemon + salt + chilli flakes','Spread generously on toast','Soft poach egg 3.5 min in simmering water','Place egg on avo','Top: everything bagel seasoning + microherbs'],
    miss:['sourdough ($3)'], saved:false },
  { id:'r12', name:'Tacos Al Pastor',        flag:'🌮', cuisine:'Mexican',         mode:'snack', time:20, cost:6, fuel:83, cal:460, pro:'26g', carb:'55g', fat:'12g', sugar:'5g', tags:['protein','fun'],
    steps:['Slice pork thin, marinate chipotle + pineapple 10 min','Fry very high until charred','Warm corn tortillas dry pan','Dice pineapple + onion + coriander','Mix salsa with lime + salt','2 tortillas + pork + salsa + hot sauce'],
    miss:['corn tortillas ($3)','chipotle paste ($2.50)'], saved:false },
]

export const SHOP_ITEMS = [
  { id:'s1',  n:'Garlic (1 bulb)',        p:1.00, done:false, tag:'veggie' },
  { id:'s2',  n:'Rice noodles (500g)',    p:2.00, done:false, tag:'carb' },
  { id:'s3',  n:'Star anise',             p:1.50, done:false, tag:'spice' },
  { id:'s4',  n:'Feta cheese (200g)',     p:3.00, done:false, tag:'protein' },
  { id:'s5',  n:'Parmesan (100g)',        p:2.00, done:false, tag:'protein' },
  { id:'s6',  n:'Lemongrass (4 stalks)', p:1.50, done:false, tag:'herb' },
  { id:'s7',  n:'Gochujang paste',       p:3.50, done:false, tag:'sauce' },
  { id:'s8',  n:'Garam masala',          p:2.50, done:false, tag:'spice' },
  { id:'s9',  n:'Fresh cream (300ml)',   p:2.00, done:false, tag:'dairy' },
  { id:'s10', n:'Miso paste (200g)',     p:3.00, done:false, tag:'sauce' },
  { id:'s11', n:'Frozen acai (4 packs)', p:4.00, done:false, tag:'fruit' },
  { id:'s12', n:'Sourdough bread',       p:3.00, done:false, tag:'carb' },
]

export const DAYS       = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
export const DATES      = ['Mar 14','Mar 15','Mar 16','Mar 17','Mar 18','Mar 19','Mar 20']
export const SHORT_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export const SLOTS = [
  { id:'breakfast', label:'Breakfast', time:'7–10 AM',  emoji:'☀️' },
  { id:'lunch',     label:'Lunch',     time:'12–2 PM',  emoji:'🌤️' },
  { id:'snack',     label:'Snack',     time:'3–5 PM',   emoji:'🍎' },
  { id:'dinner',    label:'Dinner',    time:'6–8 PM',   emoji:'🌙' },
  { id:'latenight', label:'Late Night',time:'9–11 PM',  emoji:'⭐' },
]

export const BADGES = [
  { id:'protein_hero', name:'Protein Hero',   desc:'Hit 20g+ protein 3 days', emoji:'💪', earned:false },
  { id:'veggie_queen', name:'Veggie Queen',   desc:'5 veggie meals this week', emoji:'🥗', earned:false },
  { id:'meal_planner', name:'Meal Planner',   desc:'Plan all 7 days',          emoji:'📅', earned:false },
  { id:'early_bird',   name:'Early Bird',     desc:'Breakfast every day',      emoji:'🌅', earned:false },
]

export const NOTIF_MSGS = [
  "are u eating instant noodles AGAIN?? mama is NOT okay",
  "dinner time bestie~ go cook something real",
  "ur lunch slot is empty... the fridge won't cook itself",
  "no cap eating cereal every meal is NOT it",
  "the veggies are literally crying in ur fridge rn",
  "gentle reminder~ don't let mama down this week!",
  "11pm and no dinner logged?? mama is concerned fr",
  "bestie ur protein today was ZERO. beast mode requires effort",
]
