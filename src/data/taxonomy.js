// Ingredient taxonomy for dietary classification.
// Extracted from index.html (v1.6.29 patch, ~line 38985).
// Used by src/features/diet.js classifyForVegan().
//
// Plant-confirmed terms MUST be scanned first (longest phrases first) before any
// animal-category scan so multi-word plant terms ("almond milk") mask single-word
// animal matches ("milk"). See classifyIngredients() in diet.js.

export const TAXONOMY = {
  DEFINITE_ANIMAL: {
    meat: ['beef','steak','ground beef','pork','bacon','ham','sausage','salami','pepperoni','prosciutto','lamb','mutton','veal','turkey','chicken','poultry','duck','goose','rabbit','venison','bison'],
    seafood: ['fish','salmon','tuna','cod','tilapia','halibut','trout','mackerel','herring','anchovy','anchovies','sardine','sardines','shrimp','prawn','prawns','crab','lobster','oyster','oysters','clam','clams','mussel','mussels','scallop','scallops','squid','octopus','calamari','caviar','roe'],
    dairy: ['milk','cream','butter','ghee','cheese','cheddar','mozzarella','parmesan','feta','ricotta','brie','camembert','gouda','yogurt','yoghurt','kefir','sour cream','buttermilk','whey','whey protein','casein','caseinate','lactose','curd','custard','condensed milk','evaporated milk','milk powder','skim milk','whole milk'],
    eggs: ['egg','eggs','egg white','egg whites','egg yolk','egg yolks','albumen','ovalbumin','mayonnaise','mayo','meringue'],
    honey: ['honey','royal jelly','bee pollen','propolis','beeswax'],
    gelatin: ['gelatin','gelatine','collagen'],
    animal_fat: ['lard','tallow','suet','schmaltz','duck fat','bacon grease','beef tallow'],
    other_animal: ['bone broth','bone marrow','organ meat','liver','kidney','tripe','foie gras'],
  },

  LIKELY_ANIMAL: {
    carmine_cochineal: ['carmine','cochineal','e120','carminic acid','crimson lake'],
    shellac: ['shellac','e904','confectioner glaze','confectioners glaze','pharmaceutical glaze'],
    isinglass: ['isinglass'],
    lanolin: ['lanolin'],
    l_cysteine: ['l cysteine','l-cysteine'],
    hidden_animal_sauces: ['worcestershire','worcestershire sauce','fish sauce','oyster sauce','caesar dressing','xo sauce','belacan'],
  },

  SOURCE_DEPENDENT: {
    glycerin: ['glycerin','glycerine','glycerol','e422'],
    lecithin: ['lecithin','soy lecithin','sunflower lecithin','e322'],
    mono_diglycerides: ['mono and diglycerides','monoglycerides','diglycerides','e471'],
    natural_flavors: ['natural flavor','natural flavors','natural flavour','natural flavours','natural flavoring','natural flavouring'],
    sugar: ['sugar','cane sugar','refined sugar','white sugar'],
    vitamin_d3: ['vitamin d3','cholecalciferol'],
    enzymes: ['enzymes','rennet','microbial rennet','lipase','protease','pepsin'],
    lactic_acid: ['lactic acid','e270'],
    stearic_acid: ['stearic acid','stearate','magnesium stearate'],
    palmitic_acid: ['palmitic acid'],
    omega_3: ['omega 3','omega-3','dha','epa'],
  },

  // Scan these FIRST — longest phrases first — to prevent "almond milk" from triggering "milk"
  PLANT_CONFIRMED: {
    plant_milks: ['almond milk','soy milk','oat milk','rice milk','coconut milk','cashew milk','hemp milk','flax milk','pea milk','macadamia milk','walnut milk'],
    plant_proteins: ['tofu','tempeh','seitan','textured vegetable protein','tvp','edamame','chickpea','chickpeas','lentil','lentils','black beans','kidney beans','pinto beans','navy beans','white beans','cannellini','garbanzo','soy protein','pea protein','hemp protein','rice protein'],
    plant_cheeses: ['vegan cheese','cashew cheese','nutritional yeast','nooch'],
    plant_butters: ['peanut butter','almond butter','cashew butter','sunflower butter','tahini','coconut butter','vegan butter','plant butter'],
    plant_yogurts: ['coconut yogurt','almond yogurt','soy yogurt','cashew yogurt','oat yogurt'],
    grains: ['rice','brown rice','quinoa','oats','oatmeal','barley','millet','bulgur','farro','buckwheat','amaranth','wheat','pasta','bread','rye','spelt','sorghum'],
    veggies: ['spinach','kale','broccoli','cauliflower','brussels sprouts','cabbage','lettuce','romaine','arugula','tomato','tomatoes','cucumber','zucchini','eggplant','carrot','carrots','onion','onions','garlic','pepper','peppers','bell pepper','jalapeno','potato','potatoes','sweet potato','mushroom','mushrooms','asparagus','celery','leek','green beans','snap peas','corn','peas','avocado','olives','salsa','guacamole','hummus'],
    fruits: ['apple','apples','banana','bananas','orange','oranges','lemon','lime','grape','grapes','strawberry','strawberries','blueberry','blueberries','raspberry','raspberries','blackberry','blackberries','berry','berries','peach','pear','mango','pineapple','watermelon','melon','cherry','cherries','cranberry','cranberries','dates','raisins','coconut'],
    oils: ['olive oil','canola oil','avocado oil','coconut oil','sesame oil','sunflower oil','safflower oil','vegetable oil','vegan margarine'],
    nuts_seeds: ['almond','almonds','walnut','walnuts','cashew','cashews','pecan','pecans','peanut','peanuts','pistachio','pistachios','hazelnut','hazelnuts','pine nuts','brazil nuts','macadamia','macadamias','sunflower seeds','pumpkin seeds','chia seeds','flax seeds','flaxseed','hemp seeds','sesame seeds','sesame'],
    seasonings: ['vegetable broth','vegetable stock','veggie broth','veggie stock','miso','soy sauce','tamari','coconut aminos','salt','black pepper','white pepper','paprika','cumin','turmeric','cinnamon','ginger','oregano','basil','thyme','rosemary','parsley','cilantro','mint','dill','sage','bay leaf','vinegar','balsamic vinegar','apple cider vinegar','rice vinegar','mustard','mustard seed','lime juice','lemon juice'],
  },

  // Treated as source_dependent until Barnivore API integration (see SORREL_MASTER_REFERENCE.md §12)
  ALCOHOL_BARNIVORE: {
    wine: ['wine','red wine','white wine','rose wine','sparkling wine','champagne'],
    beer: ['beer','ale','lager','stout','ipa'],
    spirits: ['whiskey','whisky','bourbon','vodka','gin','rum','tequila','brandy','cognac'],
  },
};
