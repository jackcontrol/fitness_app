# Sorrel Developer Integration Strategy — Current Index + Premium Metabolic Reset

**Date:** 2026-05-15  
**Current implementation reference:** uploaded `index.html`, titled **“Sorrel — v1.6.22 Week Plan Bridge Fix”**.  
**Purpose:** give a future developer a clean continuation strategy for Sorrel based on the current index, while incorporating the evolved Recipe Inbox, Smart Shopping, Adaptive Training, Weekly Coach Note, and new premium **Metabolic Reset Protocol** strategy.

---

## 1. Executive summary

Sorrel should not be developed as disconnected tab features or stacked patch scripts. The current index already contains the essential foundations: the five-tab mobile shell, original Sorrel aesthetic, Activity Rings, Plan/Home meal cards, Diary logging, water tracking, Train logging, recovery placement, Routine/sunlight, Progress review, Shopping, recipe/swap modals, food search, barcode/photo food tools, custom food, intermittent fasting, progress photos, and analytics.

The next phase should organize these into one coherent system:

```text
Sorrel = one adaptive daily plan.
Tabs = different views into that plan.
```

The user-facing promise remains:

```text
What do I DO next?
What do I EAT next?
What do I LOG next?
```

The new premium strategy adds a safety-gated protocol layer:

```text
Sorrel Metabolic Reset
A 3-week adaptive metabolic-support protocol focused on whole foods, post-meal walks, refined-carb reduction, consistent routine, and grocery execution.
```

This protocol should be integrated as a **Sorrel Pro protocol**, not as the default diet and not as a medical-treatment claim.

---

## 2. Current index compatibility notes

The current uploaded `index.html` identifies itself as:

```text
<title>Sorrel — v1.6.22 Week Plan Bridge Fix</title>
```

But the meta version still says:

```text
<meta name="version" content="v1.6.20-functional-test-harness">
```

The file also references:

```html
<script type="module" src="/src/main.js"></script>
```

and contains comments indicating Chart.js and QuaggaJS are now loaded through npm/Vite rather than only as inline/CDN code.

### Immediate technical cleanup

Before more features, resolve deployment:

```text
Option A — Standalone HTML:
Bundle everything into one deployable index.html and remove /src/main.js dependency.

Option B — Vite/module app:
Treat index.html as the shell and ensure /src/main.js, Vite config, npm dependencies, and dist build are part of deployment.
```

Do not leave the app in-between.

Also fix version labeling:

```html
<title>Sorrel — v1.6.23 Hosted Runtime Closure</title>
<meta name="version" content="v1.6.23-hosted-runtime-closure">
```

---

## 3. Non-negotiable product principles

Every system must support:

```text
1. What do I DO next?
2. What do I EAT next?
3. What do I LOG next?
```

Primary product goal:

```text
Keep the user engaged and consistently/sustainably logging useful metrics.
```

Secondary principles:

```text
- Gentle guidance
- Calm intelligence
- Progressive disclosure
- Low cognitive load
- Apple-like hierarchy
- Amazon-like obvious action clarity
- WHOOP-like adaptive recovery guidance
- Better-than-tracker execution: food, shopping, routine, recovery, and training are connected
```

---

## 4. Non-negotiable visual and UX constraints

Preserve the original Sorrel aesthetic:

```text
- Warm cream/off-white background
- Deep emerald primary color
- Emerald gradient primary buttons
- Soft rounded white cards
- Light borders and shadows
- System font stack
- Lucide-style icon parity
- Calm, premium, mobile-first layout
```

Button semantics:

```text
Neutral / white / secondary = available action
Emerald / green = selected, logged, completed, or confirmed
Amber = warning, celebration, streak, energy accent
Red = danger or unsafe
```

Avoid:

```text
- Broad MutationObserver repaint loops
- Continuous normalization timers
- Duplicate owner scripts stacked at the bottom
- Silent startup mutation of the user’s plan
- Hiding core fields with CSS after rendering
- Raw template/code leakage into visible UI
- Aesthetic drift from the original index
```

---

## 5. Recommended internal architecture

Build Sorrel as four engines and five views.

### Engine 1: Context Engine

Owns:

```text
date
local day key
time of day
profile
daily state
week plan
next meal
logged meals
hydration
sunlight
recovery
routine
training
shopping status
budget status
useful logs left
active protocol
```

Primary output:

```js
todayContext = {
  date,
  localDayKey,
  timeOfDay,
  profile,
  weekPlan,
  nextMeal,
  loggedMeals,
  hydration,
  sunlight,
  recovery,
  routine,
  training,
  groceryStatus,
  budgetStatus,
  dietarySafety,
  activeProtocol,
  usefulLogsLeft
};
```

### Engine 2: Food Safety Engine

Owns:

```text
ingredient ontology
ingredient normalization
diet rules
allergen aliases
strict vegan validation
flexible vegan warning/substitution
vegetarian / pescatarian / halal / keto / dairy-free / gluten-free / nut-free / egg-free / soy-free rules
disliked food checks
ambiguous ingredient handling
unknown ingredient handling
```

Canonical gate:

```js
sorrelValidateFoodForProfile(food, profile, options)
```

It must eventually protect:

```text
weekly plan generation
recipe import
meal swap
meal repeat
budget substitutions
shopping list generation
food search add
custom food add
barcode food add
photo food add
copy yesterday
Log It
```

### Engine 3: Plan Engine

Owns:

```text
week plan
today plan
meal locks
day navigation
swap
repeat
undo repeat
recipe add
recipe import
meal timing
macro targets
training context
protocol rules
```

Canonical mutation path:

```js
sorrelCommitPlanChange(reason, mutationFn)
```

Pipeline:

```text
1. snapshot current plan
2. apply mutation
3. validate diet/protocol safety
4. repair unsafe foods when possible
5. recalculate macros
6. rebuild grocery list
7. recalculate checkout estimate
8. persist state
9. refresh relevant views
10. show honest feedback
```

### Engine 4: Execution Engine

Owns:

```text
grocery list
pantry state
Need / Have / Bought / Sub
budget target
actual checkout estimate
budget optimization result
logging confirmation
progress feedback
weekly coach note
```

---

## 6. Visible views

Keep the five primary tabs:

```text
Plan
Diary
Train
Routine
Progress
```

Shopping can remain accessible as a contextual surface/section, but it should not crowd Home.

### Plan

Role: command center.

Should show:

```text
Activity Rings
What do I DO next?
What do I EAT next?
What do I LOG next?
Today’s meals
Adjust week / View week
Building your baseline
```

Do not show:

```text
duplicate Start With Today card
full shopping controls
dense weekly spreadsheet
multiple duplicated guidance panels
```

### Diary

Role: what did I log?

Owns:

```text
meal slots
food search
quick add
custom food
copy yesterday
water
recent/favorite foods
barcode/photo food add
```

### Train

Role: training and recovery execution.

The current index already has recovery placement, cardio logging, strength logging, quick/each-set modes, rest timer, weekly stats, and exercise summary. Extend this into adaptive coaching; do not rebuild it from scratch.

### Routine

Role: daily rhythm and low-friction health behaviors.

Owns:

```text
daily sunlight
morning routine
evening routine
adjust routine times
custom routine items
intermittent fasting
sleep/wind-down behavior
post-meal walk prompts
```

Routine must feed Home’s DO next.

### Progress

Role: review, trend, and explanation.

Owns:

```text
weight trend
weekly review
progress photos
recovery pattern
adherence
deep analytics
weekly coach note
```

---

## 7. Premium protocol: Sorrel Metabolic Reset

### Product positioning

Add an optional premium protocol:

```text
Sorrel Metabolic Reset
A 3-week adaptive metabolic-support protocol focused on whole foods, post-meal walks, refined-carb reduction, consistent sleep/routine, and grocery execution.
```

### Medical-claim guardrails

Do **not** claim:

```text
cures cortisol
fixes insulin
guaranteed visceral fat loss
scientifically proven for everyone
```

Use safer language:

```text
adaptive metabolic support
waist-reduction support
insulin-sensitivity habits
whole-food reset
post-meal walking protocol
```

Include safety warnings for:

```text
diabetes medication
pregnancy/breastfeeding
kidney disease or potassium risk
history of eating disorder
very high training load
underweight users
adolescents
medical conditions requiring clinician oversight
```

### User-provided protocol translated into Sorrel

Original structure:

```text
Week 1:
- cut processed foods, refined sugar, seed oils, artificial additives
- remove phytoestrogen foods
- supplement magnesium/potassium/zinc/vitamin D/glycine/theanine
- morning walk and walk after every meal
- 50% normal carb intake

Week 2:
- same
- 25% normal carb intake

Week 3+:
- same
- 25% normal carb intake
```

Sorrel should implement this as evidence-tiered:

#### Core behaviors

```text
whole-food meals
remove/refuse ultra-processed foods
avoid refined sugar and refined carbs
post-meal walks
sleep consistency
hydration
sunlight/routine consistency
carb taper based on tolerance
```

#### Optional strict toggles

```text
no seed oils
no soy/flax/sesame phytoestrogen foods
very low carb
no alcohol/beer
supplement reminders
```

### Protocol data model

```js
profile.activeProtocol = {
  id: 'metabolic_reset',
  phase: 1,
  startDate: 'YYYY-MM-DD',
  strictness: 'moderate', // 'moderate' | 'strict'
  carbTaper: true,
  noSeedOils: false,
  noPhytoestrogenFoods: false,
  noAlcohol: true,
  supplementReminders: {
    magnesium: false,
    potassium: false,
    zinc: false,
    vitaminD: false,
    glycine: false,
    theanine: false
  },
  safetyAcknowledged: true
};
```

Ingredient flags:

```js
ingredient.protocolFlags = {
  ultraProcessed: false,
  refinedSugar: false,
  refinedCarb: false,
  seedOil: false,
  soyPhytoestrogen: false,
  flaxPhytoestrogen: false,
  sesamePhytoestrogen: false,
  cruciferous: false,
  driedFruit: false,
  alcohol: false,
  highCarb: false
};
```

Recipe tags:

```js
recipe.protocolTags = {
  wholeFood: true,
  ultraProcessedFree: true,
  refinedSugarFree: true,
  lowCarb: true,
  metabolicResetSafe: true
};
```

Protocol validation:

```js
sorrelValidateFoodForProtocol(food, profile.activeProtocol)
```

Run alongside:

```js
sorrelValidateFoodForProfile(food, profile)
```

### Protocol phases

#### Week 1

```text
whole-food mode
no refined sugar
no packaged snacks
no alcohol
reduce refined/starchy carbs by about 50%
post-meal walk prompts
optional supplement checklist
```

#### Week 2

```text
continue whole-food mode
reduce carbs further only if energy, sleep, training, hunger, and adherence remain acceptable
continue post-meal walk prompts
```

#### Week 3+

```text
continue only if stable
offer transition/maintenance/reintroduction option
avoid indefinite severe restriction by default
```

### Protocol UI

Add to Profile / Settings:

```text
Choose a protocol:
- Standard Balanced
- High Protein Fat Loss
- Vegan Fat Loss
- Budget Lean Bulk
- Metabolic Reset Pro
- Recovery Week
- Travel Week
```

Metabolic Reset card:

```text
This protocol focuses on:
✓ whole foods
✓ post-meal walks
✓ lower refined carbs
✓ consistent sleep and sunlight
✓ optional supplement reminders

Strict filters:
[ ] no soy/flax/sesame foods
[ ] no seed oils
[ ] very low carb
```

Default to **Moderate**, not Strict.

---

## 8. Protocol integration points

### Home / Plan

DO next examples:

```text
Take a 10-minute walk after lunch
Log morning sunlight
Keep dinner lower-carb tonight
Start wind-down at 9:30 PM
```

EAT next examples:

```text
Low-carb whole-food lunch
Protein-forward snack
Protocol-safe dinner
```

LOG next examples:

```text
Log waist measurement
Log post-meal walk
Log energy/hunger
Log water
Log weight
```

### Recipe

Show protocol badges:

```text
Metabolic Reset-safe
Contains refined sugar
Contains soy/phytoestrogen item
High-carb for current phase
Contains seed oil
```

### Shopping

Protocol should filter groceries and substitutions:

```text
whole-food grocery preference
no unsafe substitutions
pantry items used first
budget-aware low-carb substitutions
```

### Routine

Add walking prompts:

```text
Morning walk
10-minute walk after breakfast
10-minute walk after lunch
10-minute walk after dinner
```

### Progress

Track:

```text
waist
weight
energy
hunger
sleep
post-meal walks
protocol adherence
carb target consistency
```

---

## 9. Recipe Inbox strategy

Future feature:

```text
v1.7.0 Recipe Inbox + Adaptive Import
```

Build on existing recipe/search/photo/nutrition-label infrastructure. Do not create a disconnected recipe product.

Core flows:

```text
Paste recipe URL
Paste recipe text
Upload screenshot/photo
Parse ingredients
Parse instructions
Estimate macros
Validate diet/allergens
Validate active protocol
Adapt portions
Add to week plan
Rebuild grocery list
Log cooked recipe
```

Sorrel advantage:

```text
Not just “save recipes.”
Decide whether the recipe fits the user’s body, goals, restrictions, budget, protocol, and week.
```

---

## 10. Smart Shopping strategy

Shopping should be:

```text
a diet-safe, budget-aware execution system for the weekly nutrition plan
```

Separate:

```text
Budget target = user intention
Actual checkout estimate = current list cost
```

Item model:

```js
shoppingItem = {
  id,
  name,
  category,
  packagePrice,
  weeklyUsePrice,
  quantity,
  unit,
  usedByMeals: [],
  status: 'need', // 'need' | 'have' | 'bought' | 'substituted'
  dietSafe: true,
  protocolSafe: true,
  replacementOptions: []
};
```

Item row:

```text
Protein powder
$28.99 package · $2.90 weekly use
Used by: Breakfast shake, Snack
[Need it] [Have it] [Bought] [Sub]
```

Budget card:

```text
Weekly grocery budget
Target: $100
Checkout estimate: $223.11
Over target: $123.11

[Optimize safely] [Adjust target]
```

Optimization result must be honest:

```text
Reduced estimate from $223.11 to $176.40
```

or:

```text
No safe cheaper plan found without violating your vegan/dairy-free profile.
```

---

## 11. Adaptive Training strategy

Do not turn Sorrel into a trainer marketplace. Extend the existing Train tab into **Adaptive Training Lite**.

Future build:

```text
recovery-aware training suggestion
equipment/time selector
guided workout mode
exercise library
weekly coach note
```

Integration:

```text
Recovery low → easier workout + protein/hydration focus
Recovery high → strength option + carb timing support
Workout complete → Diary/Progress updates
```

---

## 12. Weekly Coach Note

Progress should explain why the plan changed:

```text
This week:
- You logged 5/7 days
- Protein was consistent
- Water dropped after Wednesday
- Recovery dipped after two hard sessions
- Grocery estimate was $42 over target

Next week:
- Keep breakfast stable
- Swap two dinners to lower-cost options
- Keep midday sun 4 days
- Reduce one hard session if recovery stays low
```

This becomes a strong premium retention feature.

---

## 13. Monetization strategy

### Free

```text
basic meal planning
basic logging
basic recipes
basic grocery list
limited recipe imports
basic progress
```

### Sorrel Pro

```text
robust dietary ontology
unlimited recipe imports
adaptive recipe conversion
smart shopping optimization
Metabolic Reset Protocol
Recovery-aware plan adjustments
weekly coach note
advanced diagnostics
premium routine/training guidance
```

### Future Sorrel Coach

```text
human coach review
form video review
monthly adaptive plan review
coach comments
```

---

## 14. Next build sequence

### v1.6.23 — Hosted Runtime Closure

Do not add new features. Close partials:

```text
Log It / undo for all meals including snack
Adjust/View week runtime
Shopping totals
Have It lowering checkout estimate
Budget target vs actual estimate
Sunlight local date
Vitamin D toggle
Custom routine placement
```

### v1.6.24 — Unified Plan Mutation Pipeline

```text
sorrelCommitPlanChange()
diet validation
protocol validation
grocery rebuild
budget recalc
UI refresh
```

### v1.6.25 — Smart Shopping Execution Layer

```text
Need / Have / Bought / Sub
used-by meals
package vs weekly-use price
optimize safely
no safe cheaper plan found
```

### v1.6.26 — Protocol Engine Foundation

```text
activeProtocol model
protocol validation
protocol recipe tags
protocol shopping flags
protocol routine prompts
```

### v1.7.0 — Recipe Inbox + Adaptive Import

```text
URL/text/screenshot import
parse ingredients
validate diet/protocol
adapt recipe
add to plan/shopping
```

### v1.7.1 — Adaptive Training Lite

```text
recovery-aware training suggestion
equipment/time selector
log complete/skipped/modified
```

### v1.7.2 — Weekly Coach Note

```text
cross-system summary
next-week recommendations
premium conversion lever
```

---

## 15. Required smoke matrix for every future build

Every build response must include:

```text
Feature / system
Expected behavior
Smoke test performed
Result: PASS / PARTIAL / FAIL / NOT TESTED
Reliability score if PASS: 1–10
Notes / regressions
```

No PASS without runtime behavior or a built-in harness proving state/DOM changes.

Core matrix:

```text
Original aesthetic shell
No raw template leakage
Inline JS syntax
Home DO/EAT/LOG
Activity rings
Today meal logging
Snack logging
Recipe
Swap
Weekly plan
Dietary ontology
Protocol validation
Shopping/budget
Have It / Bought / Need It
Water
Sunlight
Vitamin D
Routine/custom items
Train/recovery
Progress
Quick Setup / Full Assessment
State migration
Diagnostics
Mobile touch targets
No repaint loop
Real-device coverage
```

---

## 16. Developer warning

The user’s main frustration pattern:

```text
Stop fixing one visible issue and breaking three hidden systems.
Stop reporting PARTIAL without closing them.
Keep the original aesthetic.
Make the advanced systems actually work.
Smoke test every build thoroughly.
```

Development style must be:

```text
small
owned
deterministic
source-of-truth driven
no broad repaint loops
no silent startup mutation
no duplicate UI owners
```
