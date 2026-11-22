import { Exercise } from "../types/exercise";

export const DEFAULT_EXERCISES: Omit<Exercise, "isCustom">[] = [
  // ==================== CHEST ====================
  {
    id: "assisted_dips",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder"],
    name: { en: "Assisted Dips", pl: "Pompki na poręczach z asystą" },
    description: {
      en: "Lean torso slightly forward on the dip machine, lower until elbows reach 90 degrees, and press back up.",
      pl: "Pochyl tułów lekko do przodu na maszynie z przeciwwagą, opuść ciało do kąta 90 stopni w łokciach i wypchnij w górę.",
    },
  },
  {
    id: "bar_dip",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder"],
    name: { en: "Bar Dip", pl: "Pompki na poręczach (Dipy)" },
    description: {
      en: "Grip parallel bars, lean forward to target the lower chest, descend under control, and drive up.",
      pl: "Chwyć równoległe poręcze, pochyl się w przód dla zaangażowania dołu klatki, opuść ciało i dynamicznie wypchnij.",
    },
  },
  {
    id: "bench_press",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder"],
    name: { en: "Bench Press", pl: "Wyciskanie sztangi na ławce płaskiej" },
    description: {
      en: "Lie flat with retracted scapulae, lower the barbell to mid-chest, and press upward to full lockout.",
      pl: "Połóż się płasko ze ściągniętymi łopatkami, opuść sztangę do środka klatki piersiowej i wyciśnij w górę.",
    },
  },
  {
    id: "cable_chest_press",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder"],
    name: { en: "Cable Chest Press", pl: "Wyciskanie na wyciągu" },
    description: {
      en: "Set cables at chest height, step forward into a staggered stance, and press handles forward.",
      pl: "Ustaw bloczki na wysokości klatki, zrób wykrok i wypychaj uchwyty przed siebie, utrzymując stałe napięcie.",
    },
  },
  {
    id: "decline_bench_press",
    category: "chest",
    secondaryCategories: ["triceps"],
    name: {
      en: "Decline Bench Press",
      pl: "Wyciskanie sztangi na ławce ujemnej",
    },
    description: {
      en: "Secure legs on a decline bench, lower the bar toward the lower chest, and press back up.",
      pl: "Zablokuj nogi na ławce ze skosem ujemnym, opuść sztangę w stronę dolnej części klatki i wyciśnij.",
    },
  },
  {
    id: "dumbbell_chest_fly",
    category: "chest",
    name: {
      en: "Dumbbell Chest Fly",
      pl: "Rozpiętki z hantlami na ławce płaskiej",
    },
    description: {
      en: "With a slight bend in the elbows, lower dumbbells out to the sides until a deep chest stretch, then squeeze together.",
      pl: "Z lekko ugiętymi łokciami opuść hantle na boki do głębokiego rozciągnięcia klatki, a następnie złącz je nad sobą.",
    },
  },
  {
    id: "dumbbell_chest_press",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder"],
    name: {
      en: "Dumbbell Chest Press",
      pl: "Wyciskanie hantli na ławce płaskiej",
    },
    description: {
      en: "Press dumbbells from chest level upward in a slight arc, bringing them close at the top without clanging.",
      pl: "Wyciśnij hantle znad klatki piersiowej lekkim łukiem w górę, zbliżając je do siebie w szczytowej fazie.",
    },
  },
  {
    id: "dumbbell_floor_press",
    category: "chest",
    secondaryCategories: ["triceps"],
    name: {
      en: "Dumbbell Floor Press",
      pl: "Wyciskanie hantli leżąc na podłodze",
    },
    description: {
      en: "Lie flat on the floor, lower dumbbells until triceps lightly touch the ground, pause, and press up.",
      pl: "Połóż się na podłodze, opuść hantle do momentu lekkiego dotknięcia podłoża przez tricepsy, zatrzymaj i wyciśnij.",
    },
  },
  {
    id: "dumbbell_pullover",
    category: "chest",
    secondaryCategories: ["back"],
    name: { en: "Dumbbell Pullover", pl: "Przenoszenie hantla za głowę" },
    description: {
      en: "Hold one dumbbell over the chest with nearly straight arms, lower it behind your head, and pull back over.",
      pl: "Trzymaj hantel oburącz nad klatką na niemal prostych ramionach, przenieś go za głowę i wróć do pozycji wyjściowej.",
    },
  },
  {
    id: "floor_press",
    category: "chest",
    secondaryCategories: ["triceps"],
    name: { en: "Floor Press", pl: "Wyciskanie sztangi leżąc na podłodze" },
    description: {
      en: "Lie on the floor under a barbell, lower until upper arms rest briefly on the floor, then drive upward.",
      pl: "Połóż się na podłodze pod sztangą, opuść ją do kontaktu ramion z podłożem, po czym dynamicznie wyciśnij.",
    },
  },
  {
    id: "incline_bench_press",
    category: "chest",
    secondaryCategories: ["shoulder", "triceps"],
    name: {
      en: "Incline Bench Press",
      pl: "Wyciskanie sztangi na ławce dodatniej",
    },
    description: {
      en: "Set bench to 30–45 degrees, lower barbell to upper chest, and press upward to target the clavicular head.",
      pl: "Ustaw ławkę pod kątem 30–45 stopni, opuść sztangę do górnej części klatki i wyciśnij w górę.",
    },
  },
  {
    id: "incline_dumbbell_press",
    category: "chest",
    secondaryCategories: ["shoulder", "triceps"],
    name: {
      en: "Incline Dumbbell Press",
      pl: "Wyciskanie hantli na ławce dodatniej",
    },
    description: {
      en: "On an incline bench, press dumbbells from shoulder height straight up while keeping wrists neutral.",
      pl: "Na ławce skośnej wyciskaj hantle z wysokości barków pionowo w górę, utrzymując stabilne nadgarstki.",
    },
  },
  {
    id: "machine_chest_fly",
    category: "chest",
    name: { en: "Machine Chest Fly", pl: "Rozpiętki na maszynie" },
    description: {
      en: "Sit upright against the pad, bring the handles together in front of your chest, and return slowly.",
      pl: "Usiądź prosto opierając plecy, złącz ramiona maszyny przed klatką piersiową i powoli wróć do rozciągnięcia.",
    },
  },
  {
    id: "machine_chest_press",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder"],
    name: { en: "Machine Chest Press", pl: "Wyciskanie na maszynie siedząc" },
    description: {
      en: "Adjust seat so handles align with mid-chest, press forward smoothly without locking elbows harshly.",
      pl: "Ustaw siedzisko tak, aby uchwyty były na wysokości środka klatki, i wypychaj ciężar płynnym ruchem.",
    },
  },
  {
    id: "pec_deck",
    category: "chest",
    name: { en: "Pec Deck", pl: "Rozpiętki na maszynie typu Pec Deck" },
    description: {
      en: "Place forearms or hands on the pads, squeeze the pecs to bring elbows together, and control the eccentric.",
      pl: "Oprzyj przedramiona lub dłonie na poduszkach maszyny, mocno zepnij klatkę łącząc łokcie i wolno opuszczaj.",
    },
  },
  {
    id: "push_up",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder", "ab"],
    name: { en: "Push-Up", pl: "Pompki klasyczne" },
    description: {
      en: "Maintain a rigid plank from head to heels, lower chest just above the floor, and push back up.",
      pl: "Utrzymuj ciało w jednej linii jak w desce, opuść klatkę tuż nad podłogę i wypchnij ciało w górę.",
    },
  },
  {
    id: "seated_cable_chest_fly",
    category: "chest",
    name: { en: "Seated Cable Chest Fly", pl: "Rozpiętki na wyciągu siedząc" },
    description: {
      en: "Sit on an upright bench between cables, sweep handles together in front of your sternum, and control back.",
      pl: "Usiądź na ławce między bramami wyciągu, ściągnij uchwyty łukiem przed klatkę i kontrolowanie wróć.",
    },
  },
  {
    id: "smith_machine_bench_press",
    category: "chest",
    secondaryCategories: ["triceps", "shoulder"],
    name: {
      en: "Smith Machine Bench Press",
      pl: "Wyciskanie na suwnicy Smitha (płasko)",
    },
    description: {
      en: "Align a flat bench under the Smith bar, unrack, lower to mid-chest along the fixed track, and press.",
      pl: "Ustaw ławkę płaską pod suwnicą Smitha, zdejmij sztangę z haków, opuść do środka klatki i wyciśnij.",
    },
  },
  {
    id: "smith_machine_incline_bench_press",
    category: "chest",
    secondaryCategories: ["shoulder", "triceps"],
    name: {
      en: "Smith Machine Incline Bench Press",
      pl: "Wyciskanie na suwnicy Smitha (skos dodatni)",
    },
    description: {
      en: "Set an incline bench under the Smith machine so the bar touches the upper chest, then press steadily.",
      pl: "Ustaw ławkę skośną pod suwnicą tak, by gryf schodził do górnej części klatki, i wyciskaj po stałym torze.",
    },
  },
  {
    id: "standing_cable_chest_fly",
    category: "chest",
    name: { en: "Standing Cable Chest Fly", pl: "Rozpiętki na bramie stojąc" },
    description: {
      en: "Stand centered between high or mid pulleys, step forward, and bring hands together in a hugging arc.",
      pl: "Stań pośrodku bramy wyciągu, zrób krok do przodu i łącz dłonie przed sobą ruchem przypominającym obejmowanie.",
    },
  },

  // ==================== SHOULDER ====================
  {
    id: "arnold_press",
    category: "shoulder",
    secondaryCategories: ["triceps"],
    name: { en: "Arnold Press", pl: "Wyciskanie Arnolda" },
    description: {
      en: "Start with dumbbells in front of shoulders palms facing you, rotate palms forward as you press overhead.",
      pl: "Zacznij z hantlami przed barkami (dłonie do siebie), w trakcie wyciskania nad głowę obróć nadgarstki na zewnątrz.",
    },
  },
  {
    id: "barbell_front_raise",
    category: "shoulder",
    name: { en: "Barbell Front Raise", pl: "Unoszenie sztangi przodem" },
    description: {
      en: "Hold a barbell at thigh level with an overhand grip and raise it forward to shoulder height without swinging.",
      pl: "Chwyć sztangę nachwytem na wysokości ud i unoś ją przed siebie do linii barków bez bujania tułowiem.",
    },
  },
  {
    id: "cable_front_raise",
    category: "shoulder",
    name: {
      en: "Cable Front Raise",
      pl: "Unoszenie ramienia przodem na wyciągu",
    },
    description: {
      en: "Stand facing away from a low pulley and raise the handle forward to eye level with constant tension.",
      pl: "Stań tyłem do dolnego wyciągu i unoś uchwyt przed siebie do wysokości wzroku pod stałym napięciem.",
    },
  },
  {
    id: "cable_lateral_raise",
    category: "shoulder",
    name: { en: "Cable Lateral Raise", pl: "Wznosy bokiem na wyciągu dolnym" },
    description: {
      en: "Stand sideways to a low cable and raise your arm out to the side until parallel with the floor.",
      pl: "Stań bokiem do dolnego wyciągu i unoś ramię w bok do poziomu, prowadząc ruch łokciem.",
    },
  },
  {
    id: "cable_rear_delt_row",
    category: "shoulder",
    secondaryCategories: ["back"],
    name: {
      en: "Cable Rear Delt Row",
      pl: "Przyciąganie linki do tylnego aktonu barków",
    },
    description: {
      en: "Pull a rope or bar attachment toward upper chest/neck with elbows flared wide to isolate rear delts.",
      pl: "Przyciągaj uchwyt wyciągu w stronę szyi z szeroko rozstawionymi łokciami, angażując tylny akton barków.",
    },
  },
  {
    id: "dumbbell_front_raise",
    category: "shoulder",
    name: { en: "Dumbbell Front Raise", pl: "Unoszenie hantli przodem" },
    description: {
      en: "Raise dumbbells alternately or together in front of your body up to shoulder height with controlled tempo.",
      pl: "Unoś hantle naprzemiennie lub jednocześnie przed siebie do wysokości barków z pełną kontrolą opuszczania.",
    },
  },
  {
    id: "dumbbell_lateral_raise",
    category: "shoulder",
    name: { en: "Dumbbell Lateral Raise", pl: "Wznosy hantli bokiem" },
    description: {
      en: "Hinge slightly forward, lead with your elbows to raise dumbbells out to the sides to shoulder level.",
      pl: "Lekko pochyl tułów, prowadź ruch łokciami i unoś hantle na boki do linii barków.",
    },
  },
  {
    id: "dumbbell_shoulder_press",
    category: "shoulder",
    secondaryCategories: ["triceps"],
    name: {
      en: "Dumbbell Shoulder Press",
      pl: "Wyciskanie hantli nad głowę stojąc",
    },
    description: {
      en: "Brace your core while standing and press dumbbells from ear level straight overhead.",
      pl: "Napnij brzuch w pozycji stojącej i wyciśnij hantle z wysokości uszu pionowo nad głowę.",
    },
  },
  {
    id: "face_pull",
    category: "shoulder",
    secondaryCategories: ["back"],
    name: { en: "Face Pull", pl: "Face Pull (przyciąganie liny do twarzy)" },
    description: {
      en: "Set rope at upper-chest/face height, pull toward your forehead while externally rotating shoulders.",
      pl: "Ustaw linę wyciągu na wysokości twarzy i przyciągaj ją do czoła z jednoczesną rotacją zewnętrzną barków.",
    },
  },
  {
    id: "machine_lateral_raise",
    category: "shoulder",
    name: { en: "Machine Lateral Raise", pl: "Wznosy bokiem na maszynie" },
    description: {
      en: "Place elbows against the pads and raise arms outward to shoulder height, pausing briefly at the top.",
      pl: "Oprzyj łokcie o poduszki maszyny i unoś ramiona na boki do poziomu barków z krótką pauzą w górze.",
    },
  },
  {
    id: "machine_shoulder_press",
    category: "shoulder",
    secondaryCategories: ["triceps"],
    name: {
      en: "Machine Shoulder Press",
      pl: "Wyciskanie na barki na maszynie",
    },
    description: {
      en: "Sit firmly against the backrest, grip handles at shoulder height, and press smoothly overhead.",
      pl: "Oprzyj plecy o oparcie maszyny, chwyć uchwyty na wysokości barków i wyciskaj ciężar w górę.",
    },
  },
  {
    id: "overhead_press",
    category: "shoulder",
    secondaryCategories: ["triceps", "ab"],
    name: { en: "Overhead Press", pl: "Wyciskanie żołnierskie (OHP)" },
    description: {
      en: "Stand with barbell resting on front delts, brace glutes and abs, and press straight overhead.",
      pl: "Stań ze sztangą na przednich aktonach barków, napnij brzuch oraz pośladki i wyciśnij sztangę nad głowę.",
    },
  },
  {
    id: "reverse_cable_flyes",
    category: "shoulder",
    secondaryCategories: ["back"],
    name: {
      en: "Reverse Cable Flyes",
      pl: "Odwrotne rozpiętki na wyciągu (tył barków)",
    },
    description: {
      en: "Cross-grip high cables without attachments and sweep arms backward and outward to target rear delts.",
      pl: "Chwyć na krzyż linki górnego wyciągu i odwódź ramiona w tył oraz na boki, izolując tylne aktony barków.",
    },
  },
  {
    id: "seated_dumbbell_shoulder_press",
    category: "shoulder",
    secondaryCategories: ["triceps"],
    name: {
      en: "Seated Dumbbell Shoulder Press",
      pl: "Wyciskanie hantli nad głowę siedząc",
    },
    description: {
      en: "Sit on a high-back bench, press dumbbells overhead from shoulder level, and lower under control.",
      pl: "Usiądź na ławce z pionowym oparciem, wyciskaj hantle nad głowę z wysokości barków i powoli opuszczaj.",
    },
  },
  {
    id: "seated_barbell_overhead_press",
    category: "shoulder",
    secondaryCategories: ["triceps"],
    name: {
      en: "Seated Barbell Overhead Press",
      pl: "Wyciskanie sztangi nad głowę siedząc",
    },
    description: {
      en: "Seated with back support, lower the barbell to chin/upper-chest level and press straight up.",
      pl: "W pozycji siedzącej z podparciem pleców opuszczaj sztangę do poziomu brody i wyciskaj pionowo w górę.",
    },
  },
  {
    id: "seated_smith_machine_shoulder_press",
    category: "shoulder",
    secondaryCategories: ["triceps"],
    name: {
      en: "Seated Smith Machine Shoulder Press",
      pl: "Wyciskanie na barki na suwnicy Smitha",
    },
    description: {
      en: "Sit upright under the Smith bar, unrack, lower to chin height, and drive back up along the rails.",
      pl: "Usiądź prosto pod suwnicą Smitha, opuszczaj gryf do wysokości brody i wyciskaj po prowadnicach.",
    },
  },

  // ==================== BICEP ====================
  {
    id: "barbell_curl",
    category: "bicep",
    name: { en: "Barbell Curl", pl: "Uginanie przedramion ze sztangą stojąc" },
    description: {
      en: "Keep elbows pinned to your sides and curl a straight barbell up toward shoulders without leaning back.",
      pl: "Trzymaj łokcie blisko tułowia i uginaj przedramiona ze sztangą prostą bez odchylania pleców.",
    },
  },
  {
    id: "barbell_preacher_curl",
    category: "bicep",
    name: {
      en: "Barbell Preacher Curl",
      pl: "Uginanie ze sztangą na modlitewniku",
    },
    description: {
      en: "Rest upper arms flat on the preacher pad, lower the barbell nearly to full extension, and curl up.",
      pl: "Oprzyj ramiona płasko na modlitewniku, opuść sztangę niemal do pełnego wyprostu i ugnij przedramiona.",
    },
  },
  {
    id: "bayesian_curl",
    category: "bicep",
    name: {
      en: "Bayesian Curl",
      pl: "Uginanie na wyciągu w wykroku (Bayesian Curl)",
    },
    description: {
      en: "Face away from a low cable so your arm trails behind your torso, then curl forward for peak stretch.",
      pl: "Stań tyłem do dolnego wyciągu tak, aby ramię było cofnięte za linię tułowia, i uginaj przedramię.",
    },
  },
  {
    id: "cable_crossover_bicep_curl",
    category: "bicep",
    name: {
      en: "Cable Crossover Bicep Curl",
      pl: "Uginanie ramion na bramie z wyciągów górnych",
    },
    description: {
      en: "Stand between two high pulleys, hold handles with arms out to the sides, and curl hands toward your head.",
      pl: "Stań pośrodku bramy wyciągu, chwyć rączki wyciągów górnych i uginaj przedramiona w stronę głowy.",
    },
  },
  {
    id: "cable_curl_with_bar",
    category: "bicep",
    name: {
      en: "Cable Curl With Bar",
      pl: "Uginanie przedramion na wyciągu dolnym (drążek)",
    },
    description: {
      en: "Attach a straight or EZ bar to a low pulley and curl upward while keeping elbows fixed at your sides.",
      pl: "Podepnij prosty lub łamany drążek do dolnego wyciągu i uginaj przedramiona przy nieruchomych łokciach.",
    },
  },
  {
    id: "cable_curl_with_rope",
    category: "bicep",
    name: {
      en: "Cable Curl With Rope",
      pl: "Uginanie młotkowe z liną na wyciągu",
    },
    description: {
      en: "Hold a rope attachment with neutral palms and curl upward, slightly separating the ends at the top.",
      pl: "Chwyć linę wyciągu dolnego chwytem neutralnym i uginaj przedramiona, lekko rozchylając końce w górze.",
    },
  },
  {
    id: "concentration_curl",
    category: "bicep",
    name: {
      en: "Concentration Curl",
      pl: "Uginanie przedramienia w podporze o udo",
    },
    description: {
      en: "Sit on a bench, brace your working elbow against your inner thigh, and curl the dumbbell strictly.",
      pl: "Usiądź na ławce, oprzyj łokieć o wewnętrzną stronę uda i wykonuj ściśle kontrolowane uginanie z hantlem.",
    },
  },
  {
    id: "dumbbell_curl",
    category: "bicep",
    name: { en: "Dumbbell Curl", pl: "Uginanie przedramion z hantlami" },
    description: {
      en: "Curl dumbbells alternating or together, supinating your wrists as you lift toward your shoulders.",
      pl: "Uginaj przedramiona z hantlami naprzemiennie lub jednocześnie, rotując nadgarstki w trakcie ruchu.",
    },
  },
  {
    id: "dumbbell_preacher_curl",
    category: "bicep",
    name: {
      en: "Dumbbell Preacher Curl",
      pl: "Uginanie z hantlem na modlitewniku",
    },
    description: {
      en: "Train one arm at a time on the preacher bench to eliminate momentum and isolate the biceps.",
      pl: "Ćwicz jedną ręką na modlitewniku, aby wyeliminować bujanie i maksymalnie wyizolować biceps.",
    },
  },
  {
    id: "ez_curl",
    category: "bicep",
    name: { en: "EZ Curl", pl: "Uginanie przedramion ze sztangą łamaną" },
    description: {
      en: "Grip the angled portions of an EZ bar to reduce wrist strain and curl through a full range of motion.",
      pl: "Chwyć gryf łamany na skośnych odcinkach dla odciążenia nadgarstków i wykonuj pełne uginania.",
    },
  },
  {
    id: "hammer_curl",
    category: "bicep",
    name: { en: "Hammer Curl", pl: "Uginanie młotkowe z hantlami" },
    description: {
      en: "Hold dumbbells with palms facing each other throughout the lift to target the brachialis and forearms.",
      pl: "Trzymaj hantle chwytem neutralnym (kciuki w górę) przez cały ruch, angażując mięsień ramienny i przedramiona.",
    },
  },
  {
    id: "incline_dumbbell_curl",
    category: "bicep",
    name: {
      en: "Incline Dumbbell Curl",
      pl: "Uginanie z hantlami na ławce skośnej",
    },
    description: {
      en: "Sit back on a 45–60 degree incline bench letting arms hang behind your torso, then curl upward.",
      pl: "Oprzyj się na ławce ustawionej pod kątem 45–60 stopni, opuść ramiona swobodnie za tułów i uginaj.",
    },
  },
  {
    id: "machine_bicep_curl",
    category: "bicep",
    name: { en: "Machine Bicep Curl", pl: "Uginanie na biceps na maszynie" },
    description: {
      en: "Align elbows with the machine pivot axis, curl handles smoothly, and resist the weight on the way down.",
      pl: "Ustaw łokcie w osi obrotu maszyny, uginaj ramiona płynnym ruchem i wolno kontroluj powrót.",
    },
  },
  {
    id: "spider_curl",
    category: "bicep",
    name: {
      en: "Spider Curl",
      pl: "Uginanie na ławce skośnej przodem (Spider Curl)",
    },
    description: {
      en: "Lie chest-down on an incline bench with arms hanging vertically and curl the weight without swinging.",
      pl: "Połóż się klatką piersiową na oparciu ławki skośnej, opuść ramiona pionowo w dół i uginaj bez bujania.",
    },
  },

  // ==================== TRICEPS ====================
  {
    id: "barbell_lying_triceps_extension",
    category: "triceps",
    name: {
      en: "Barbell Lying Triceps Extension",
      pl: "Wyciskanie francuskie sztangą leżąc",
    },
    description: {
      en: "Lie on a flat bench, bend at the elbows to lower the barbell toward your forehead, and extend back up.",
      pl: "Leżąc na ławce płaskiej, ugnij łokcie opuszczając sztangę w stronę czoła, a następnie wyprostuj ramiona.",
    },
  },
  {
    id: "bench_dip",
    category: "triceps",
    secondaryCategories: ["chest", "shoulder"],
    name: { en: "Bench Dip", pl: "Pompki w podporze tyłem na ławce" },
    description: {
      en: "Place hands on the edge of a bench behind you, lower hips until elbows hit 90 degrees, and press up.",
      pl: "Oprzyj dłonie na krawędzi ławki za plecami, opuść biodra do kąta 90 stopni w łokciach i wypchnij ciało.",
    },
  },
  {
    id: "close_grip_push_up",
    category: "triceps",
    secondaryCategories: ["chest"],
    name: { en: "Close-Grip Push-Up", pl: "Pompki wąskie" },
    description: {
      en: "Place hands narrower than shoulder-width, keep elbows tucked close to ribs, and press through triceps.",
      pl: "Ustaw dłonie węziej niż szerokość barków, prowadź łokcie blisko żeber i wypychaj ciało pracą tricepsów.",
    },
  },
  {
    id: "dumbbell_lying_triceps_extension",
    category: "triceps",
    name: {
      en: "Dumbbell Lying Triceps Extension",
      pl: "Wyciskanie francuskie hantlami leżąc",
    },
    description: {
      en: "Hold dumbbells with neutral palms on a flat bench, lower beside your temples, and extend elbows.",
      pl: "Trzymaj hantle chwytem neutralnym na ławce płaskiej, opuść je obok skroni i wyprostuj przedramiona.",
    },
  },
  {
    id: "dumbbell_standing_triceps_extension",
    category: "triceps",
    name: {
      en: "Dumbbell Standing Triceps Extension",
      pl: "Wyprosty ramion z hantlem nad głową",
    },
    description: {
      en: "Hold one dumbbell overhead with both hands, lower behind your head by bending elbows, and extend up.",
      pl: "Trzymaj hantel oburącz nad głową, opuść go za kark zginając łokcie i wyprostuj ramiona w górę.",
    },
  },
  {
    id: "ez_bar_lying_triceps_extension",
    category: "triceps",
    name: {
      en: "EZ Bar Lying Triceps Extension",
      pl: "Wyciskanie francuskie sztangą łamaną leżąc",
    },
    description: {
      en: "Use an EZ curl bar on a flat bench to lower toward your hairline/forehead comfortably and press up.",
      pl: "Użyj gryfu łamanego na ławce płaskiej, opuszczając ciężar w okolicę czoła dla komfortu nadgarstków.",
    },
  },
  {
    id: "smith_machine_skull_crushers",
    category: "triceps",
    name: {
      en: "Smith Machine Skull Crushers",
      pl: "Wyciskanie francuskie na suwnicy Smitha",
    },
    description: {
      en: "Set a flat bench under the Smith bar, keep upper arms angled slightly back, and extend elbows cleanly.",
      pl: "Ustaw ławkę płaską pod suwnicą Smitha, cofnij lekko ramiona i prostuj łokcie po stałym torze.",
    },
  },
  {
    id: "tricep_pushdown_with_bar",
    category: "triceps",
    name: {
      en: "Tricep Pushdown With Bar",
      pl: "Prostowanie ramion na wyciągu górnym (drążek)",
    },
    description: {
      en: "Keep elbows locked at your ribs and press the straight or V-bar down until arms are fully extended.",
      pl: "Trzymaj łokcie przyklejone do tułowia i prostuj przedramiona z drążkiem wyciągu górnego do pełnego wyprostu.",
    },
  },
  {
    id: "tricep_pushdown_with_rope",
    category: "triceps",
    name: {
      en: "Tricep Pushdown With Rope",
      pl: "Prostowanie ramion z liną na wyciągu górnym",
    },
    description: {
      en: "Press the rope down and spread the ends apart at the bottom for maximal lateral head contraction.",
      pl: "Prostuj przedramiona z liną i rozchylaj jej końce na zewnątrz w dolnej fazie dla mocnego spięcia tricepsa.",
    },
  },

  // ==================== LEG ====================
  {
    id: "barbell_lunge",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Barbell Lunge", pl: "Wykroki ze sztangą na plecach" },
    description: {
      en: "With a barbell across your upper back, step forward into a lunge until both knees form 90-degree angles.",
      pl: "Ze sztangą na górnej części pleców wykonaj wykrok w przód, zginając oba kolana do kąta około 90 stopni.",
    },
  },
  {
    id: "box_jump",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Box Jump", pl: "Wskoki na skrzynię (Box Jump)" },
    description: {
      en: "Swing arms and explode upward onto a plyo box, landing softly with knees bent, then step down.",
      pl: "Wykonaj zamach ramionami i dynamicznie wskocz na skrzynię, lądując miękko na ugiętych nogach.",
    },
  },
  {
    id: "box_squat",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Box Squat", pl: "Przysiad ze sztangą do skrzyni" },
    description: {
      en: "Sit back onto a box with vertical shins, pause briefly without relaxing tension, and drive back up.",
      pl: "Cofnij biodra siadając na skrzyni przy niemal pionowych piszczelach, zatrzymaj ruch i dynamicznie wstań.",
    },
  },
  {
    id: "bulgarian_split_squat",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Bulgarian Split Squat", pl: "Przysiad bułgarski" },
    description: {
      en: "Elevate your rear foot on a bench behind you and lower your hips straight down until the front thigh is parallel.",
      pl: "Oprzyj tylną stopę na ławce za sobą i opuszczaj biodra pionowo w dół, aż przednie udo będzie równoległe do podłoża.",
    },
  },
  {
    id: "dumbbell_lunge",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Dumbbell Lunge", pl: "Wykroki z hantlami" },
    description: {
      en: "Hold dumbbells at your sides, step forward or backward, drop the back knee toward the floor, and push back.",
      pl: "Trzymaj hantle wzdłuż tułowia, zrób krok w przód lub w tył, opuść tylne kolano ku podłodze i wróć.",
    },
  },
  {
    id: "dumbbell_squat",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Dumbbell Squat", pl: "Przysiady z hantlami" },
    description: {
      en: "Hold dumbbells at arm's length by your sides, keep chest proud, and squat to full depth.",
      pl: "Trzymaj hantle w opuszczonych rękach po bokach ciała, utrzymaj wyprostowane plecy i wykonaj głęboki przysiad.",
    },
  },
  {
    id: "front_squat",
    category: "leg",
    secondaryCategories: ["glute", "ab"],
    name: {
      en: "Front Squat",
      pl: "Przysiad przedni ze sztangą (Front Squat)",
    },
    description: {
      en: "Rest the barbell across front delts with high elbows, keep torso upright, and squat deeply.",
      pl: "Oprzyj sztangę na przednich aktonach barków z wysoko uniesionymi łokciami i wykonaj przysiad z pionowym tułowiem.",
    },
  },
  {
    id: "goblet_squat",
    category: "leg",
    secondaryCategories: ["glute", "ab"],
    name: { en: "Goblet Squat", pl: "Przysiad kielichowy (Goblet Squat)" },
    description: {
      en: "Cup one dumbbell vertically against your chest, push knees out, and sink between your heels.",
      pl: "Trzymaj hantel pionowo przy klatce piersiowej, rozpychaj kolana na zewnątrz i zejdź nisko w przysiad.",
    },
  },
  {
    id: "hack_squat_machine",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Hack Squat Machine", pl: "Przysiady na suwnicy Hack" },
    description: {
      en: "Press back firmly into the pad, place feet shoulder-width on the platform, and descend to full knee flexion.",
      pl: "Oprzyj plecy płasko o oparcie maszyny, ustaw stopy na platformie i zejdź do głębokiego ugięcia kolan.",
    },
  },
  {
    id: "leg_extension",
    category: "leg",
    name: { en: "Leg Extension", pl: "Wyprosty nóg siedząc na maszynie" },
    description: {
      en: "Adjust the ankle pad above your shoes, extend knees fully to squeeze the quads, and lower slowly.",
      pl: "Ustaw wałek maszyny tuż nad kostkami, wyprostuj kolana mocno spinając czworogłowe uda i wolno opuszczaj.",
    },
  },
  {
    id: "leg_press",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Leg Press", pl: "Wypychanie nóg na suwnicy (Leg Press)" },
    description: {
      en: "Lower the sled until knees approach your chest without lifting your lower back off the pad, then press up.",
      pl: "Opuszczaj platformę do głębokiego ugięcia kolan bez odrywania odcinka lędźwiowego od oparcia i wypchnij.",
    },
  },
  {
    id: "lying_leg_curl",
    category: "leg",
    name: { en: "Lying Leg Curl", pl: "Uginanie nóg leżąc na maszynie" },
    description: {
      en: "Lie face down, keep hips pressed into the bench, and curl the roller pad toward your glutes.",
      pl: "Połóż się przodem na maszynie, dociśnij biodra do ławki i uginaj podudzia przyciągając wałek do pośladków.",
    },
  },
  {
    id: "pendulum_squat",
    category: "leg",
    secondaryCategories: ["glute"],
    name: {
      en: "Pendulum Squat",
      pl: "Przysiad na maszynie wahadłowej (Pendulum Squat)",
    },
    description: {
      en: "Brace shoulders under the pads and descend through the arc path for deep quad and glute loading.",
      pl: "Zablokuj barki pod poduszkami maszyny i wykonaj głęboki przysiad po łukowatym torze ruchu.",
    },
  },
  {
    id: "romanian_deadlift",
    category: "leg",
    secondaryCategories: ["glute", "back"],
    name: { en: "Romanian Deadlift", pl: "Rumuński martwy ciąg (RDL)" },
    description: {
      en: "With slightly bent knees and a flat back, hinge hips backward lowering the bar to mid-shin, then thrust forward.",
      pl: "Na lekko ugiętych kolanach i prostych plecach wypychaj biodra w tył opuszczając sztangę do połowy piszczeli.",
    },
  },
  {
    id: "squat",
    category: "leg",
    secondaryCategories: ["glute", "ab"],
    name: { en: "Squat", pl: "Przysiad klasyczny ze sztangą (Back Squat)" },
    description: {
      en: "Place barbell across upper traps, brace core, break at hips and knees simultaneously, and squat below parallel.",
      pl: "Ułóż sztangę na górnej części pleców, napnij brzuch i zejdź w przysiad poniżej linii równoległej do podłoża.",
    },
  },
  {
    id: "step_up",
    category: "leg",
    secondaryCategories: ["glute"],
    name: { en: "Step Up", pl: "Wejścia na podwyższenie / skrzynię" },
    description: {
      en: "Place one full foot onto a sturdy box, drive through that heel to stand tall without pushing off the rear toes.",
      pl: "Postaw całą stopę na skrzyni i wejdź w górę siłą nogi wykrocznej, ograniczając odbicie z nogi zakrocznej.",
    },
  },

  // ==================== BACK ====================
  {
    id: "assisted_pull_up",
    category: "back",
    secondaryCategories: ["bicep"],
    name: { en: "Assisted Pull-Up", pl: "Podciąganie na drążku z asystą" },
    description: {
      en: "Kneel or stand on the assist platform, grip wide overhand, and pull your chest toward the bar.",
      pl: "Oprzyj kolana lub stopy na platformie maszyny, chwyć drążek szerokim nachwytem i podciągnij klatkę do drążka.",
    },
  },
  {
    id: "barbell_row",
    category: "back",
    secondaryCategories: ["bicep", "shoulder"],
    name: { en: "Barbell Row", pl: "Wiosłowanie sztangą w opadzie tułowia" },
    description: {
      en: "Hinge torso to roughly 45 degrees with a flat back and pull the barbell toward your lower ribs/navel.",
      pl: "Pochyl tułów do kąta ok. 45 stopni z prostymi plecami i przyciągaj sztangę w stronę dolnych żeber lub pępka.",
    },
  },
  {
    id: "chin_up",
    category: "back",
    secondaryCategories: ["bicep"],
    name: { en: "Chin-Up", pl: "Podciąganie podchwytem (Chin-Up)" },
    description: {
      en: "Use a shoulder-width underhand grip, pull chin over the bar while driving elbows down, and lower fully.",
      pl: "Chwyć drążek podchwytem na szerokość barków, podciągnij brodę ponad drążek i opuść ciało do pełnego zwisu.",
    },
  },
  {
    id: "deadlift",
    category: "back",
    secondaryCategories: ["leg", "glute"],
    name: { en: "Deadlift", pl: "Martwy ciąg klasyczny" },
    description: {
      en: "Stand with mid-foot under the bar, flatten your back, push the floor away, and lock out hips at the top.",
      pl: "Ustaw środek stopy pod sztangą, wyprostuj plecy, odepchnij się nogami od podłogi i wyprostuj biodra.",
    },
  },
  {
    id: "dumbbell_row",
    category: "back",
    secondaryCategories: ["bicep"],
    name: { en: "Dumbbell Row", pl: "Wiosłowanie hantlem w podporze" },
    description: {
      en: "Support one hand and knee on a bench and row a dumbbell toward your hip while keeping your torso square.",
      pl: "Oprzyj jedną dłoń i kolano o ławkę, a drugą ręką przyciągaj hantel w stronę biodra bez skręcania tułowia.",
    },
  },
  {
    id: "dumbbell_shrug",
    category: "back",
    name: { en: "Dumbbell Shrug", pl: "Szrugsy z hantlami (wznosy barków)" },
    description: {
      en: "Hold heavy dumbbells at your sides and elevate your shoulders straight toward your ears without rolling.",
      pl: "Trzymaj hantle wzdłuż tułowia i unoś barki pionowo w stronę uszu bez krążenia ramionami.",
    },
  },
  {
    id: "machine_lat_pulldown",
    category: "back",
    secondaryCategories: ["bicep"],
    name: {
      en: "Machine Lat Pulldown",
      pl: "Ściąganie drążka wyciągu górnego do klatki",
    },
    description: {
      en: "Secure thighs under the pad, grip wide, depress your scapulae, and pull the bar to your upper chest.",
      pl: "Zablokuj uda pod wałkiem, chwyć drążek szeroko, opuść łopatki i ściągnij gryf do górnej części klatki.",
    },
  },
  {
    id: "pendlay_row",
    category: "back",
    secondaryCategories: ["bicep", "shoulder"],
    name: { en: "Pendlay Row", pl: "Wiosłowanie Pendlay (z martwego punktu)" },
    description: {
      en: "Keep torso parallel to the floor, explosively row the barbell from the ground to your torso, and reset each rep.",
      pl: "Utrzymuj tułów równolegle do podłogi, dynamicznie przyciągaj sztangę z podłoża do klatki i odkładaj po każdym powtórzeniu.",
    },
  },
  {
    id: "pull_up",
    category: "back",
    secondaryCategories: ["bicep"],
    name: { en: "Pull-Up", pl: "Podciąganie na drążku nachwytem" },
    description: {
      en: "Start from a dead hang with an overhand grip wider than shoulders, pull chest toward bar, and control down.",
      pl: "Zacznij z pełnego zwisu nachwytem szerzej niż barki, podciągnij klatkę w stronę drążka i wolno opuść.",
    },
  },
  {
    id: "rack_pull",
    category: "back",
    secondaryCategories: ["glute"],
    name: { en: "Rack Pull", pl: "Martwy ciąg z podwyższenia (Rack Pull)" },
    description: {
      en: "Pull the barbell from safety pins set around knee height to overload the upper back and lockout.",
      pl: "Wykonuj martwy ciąg ze sztangą ustawioną na wysokości kolan, aby mocno obciążyć górny grzbiet i czworoboczne.",
    },
  },
  {
    id: "rope_pulldown",
    category: "back",
    name: {
      en: "Rope Pulldown",
      pl: "Narciarz (ściąganie liny wyciągu górnego prostymi ramionami)",
    },
    description: {
      en: "Hinge slightly at the hips with straight arms and sweep the rope down from overhead to your thighs.",
      pl: "Pochyl lekko tułów i na niemal prostych ramionach ściągaj linę wyciągu górnego łukiem aż do ud.",
    },
  },
  {
    id: "seated_machine_row",
    category: "back",
    secondaryCategories: ["bicep"],
    name: { en: "Seated Machine Row", pl: "Wiosłowanie na maszynie siedząc" },
    description: {
      en: "Sit tall against the chest pad and pull the handles back, squeezing shoulder blades together at peak contraction.",
      pl: "Oprzyj klatkę o poduszkę maszyny i przyciągaj uchwyty do siebie, mocno ściągając łopatki w końcowej fazie.",
    },
  },
  {
    id: "t_bar_row",
    category: "back",
    secondaryCategories: ["bicep"],
    name: { en: "T-Bar Row", pl: "Wiosłowanie półsztangą (T-Bar Row)" },
    description: {
      en: "Straddle the bar or use a chest-supported T-bar machine, keep spine neutral, and row toward your sternum.",
      pl: "Ustaw się nad półsztangą lub oprzyj na maszynie T-Bar, zachowaj neutralny kręgosłup i przyciągaj ciężar do mostka.",
    },
  },

  // ==================== GLUTE ====================
  {
    id: "cable_glute_kickback",
    category: "glute",
    secondaryCategories: ["leg"],
    name: {
      en: "Cable Glute Kickback",
      pl: "Odwodzenie nogi w tył na wyciągu dolnym",
    },
    description: {
      en: "Attach an ankle cuff to a low pulley, lean slightly forward, and kick your leg straight back squeezing the glute.",
      pl: "Zapnij opaskę na kostkę przy dolnym wyciągu, pochyl się lekko i wypychaj nogę w tył spinając pośladek.",
    },
  },
  {
    id: "dumbbell_romanian_deadlift",
    category: "glute",
    secondaryCategories: ["leg"],
    name: {
      en: "Dumbbell Romanian Deadlift",
      pl: "Rumuński martwy ciąg z hantlami",
    },
    description: {
      en: "Hold dumbbells in front of thighs, push hips straight back until hamstrings tighten, and drive hips forward.",
      pl: "Trzymaj hantle przed udami, wypychaj biodra maksymalnie w tył do rozciągnięcia dwugłowych i wróć.",
    },
  },
  {
    id: "glute_bridge",
    category: "glute",
    secondaryCategories: ["leg"],
    name: {
      en: "Glute Bridge",
      pl: "Unoszenie bioder leżąc na podłodze (Glute Bridge)",
    },
    description: {
      en: "Lie on your back with knees bent, drive through heels to lift hips until torso and thighs align.",
      pl: "Połóż się na plecach z ugiętymi kolanami, wypchnij biodra w górę z pięt do pełnego wyprostu i zepnij pośladki.",
    },
  },
  {
    id: "hip_thrust",
    category: "glute",
    secondaryCategories: ["leg"],
    name: { en: "Hip Thrust", pl: "Hip Thrust ze sztangą" },
    description: {
      en: "Rest upper back on a bench with a padded barbell over your hips, drive hips upward and pause at the top.",
      pl: "Oprzyj łopatki o ławkę ze sztangą na biodrach, wypchnij biodra w górę do poziomu i zatrzymaj na sekundę.",
    },
  },
  {
    id: "hip_thrust_machine",
    category: "glute",
    secondaryCategories: ["leg"],
    name: { en: "Hip Thrust Machine", pl: "Hip Thrust na maszynie" },
    description: {
      en: "Buckle the belt pad securely over your hips, press through your heels, and lock out glutes at the top.",
      pl: "Zapnij pas maszyny na biodrach, zaprzyj stopy na platformie i wypychaj biodra w górę do pełnego spięcia.",
    },
  },

  // ==================== AB ====================
  {
    id: "cable_crunch",
    category: "ab",
    name: {
      en: "Cable Crunch",
      pl: "Allahy (skłony tułowia na wyciągu górnym)",
    },
    description: {
      en: "Kneel facing a high pulley with a rope behind your head and crunch your ribs down toward your pelvis.",
      pl: "Uklęknij przed górnym wyciągiem z liną przy głowie i zwijaj tułów, przyciągając żebra w stronę miednicy.",
    },
  },
  {
    id: "hanging_leg_raise",
    category: "ab",
    name: { en: "Hanging Leg Raise", pl: "Unoszenie nóg w zwisie na drążku" },
    description: {
      en: "Hang from a pull-up bar and raise straight or bent legs while curling your pelvis upward without swinging.",
      pl: "Zwiś na drążku i unoś proste lub ugięte nogi, podwijając miednicę w górę bez rozbujania ciała.",
    },
  },
  {
    id: "machine_crunch",
    category: "ab",
    name: { en: "Machine Crunch", pl: "Brzuszki na maszynie siedząc" },
    description: {
      en: "Grip the handles on an ab crunch machine and flex your spine forward against resistance with slow control.",
      pl: "Chwyć uchwyty maszyny na brzuch i wykonuj kontrolowane zgięcia tułowia w przód przeciwko obciążeniu.",
    },
  },
  {
    id: "plank",
    category: "ab",
    name: { en: "Plank", pl: "Deska (Plank)" },
    description: {
      en: "Hold a rigid straight line on forearms and toes, bracing abs and glutes tightly throughout the set.",
      pl: "Utrzymuj ciało w prostej linii na przedramionach i palcach stóp, mocno spinając brzuch oraz pośladki.",
    },
  },
  {
    id: "sit_up",
    category: "ab",
    name: { en: "Sit-Up", pl: "Klasyczne brzuszki (Sit-Up)" },
    description: {
      en: "Lie on your back with knees bent, curl your torso all the way up toward your thighs, and lower smoothly.",
      pl: "Połóż się na plecach z ugiętymi kolanami, unieś tułów w kierunku ud i powoli wróć na matę.",
    },
  },
];
