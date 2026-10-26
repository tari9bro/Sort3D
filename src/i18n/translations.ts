export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
  teacherName: string;
  subtitle: string;
  footerText: string;
  offlineReady: string;
  offlineBanner: string;
  compares: string;
  swaps: string;
  step: string;
  sorted: string;
  codeAndLogic: string;
  executionLogic: string;
  currentOperation: string;
  initialReady: string;
  array: string;
  presets: {
    random: string;
    reversed: string;
    nearly_sorted: string;
    few_unique: string;
    already_sorted: string;
    custom: string;
  };
  complexity: {
    time: string;
    space: string;
    stable: string;
    yes: string;
    no: string;
  };
  controls: {
    play: string;
    pause: string;
    stepForward: string;
    stepBackward: string;
    reset: string;
    speed: string;
    elements: string;
    soundSynth: string;
    cameraViews: string;
    volume: string;
    mute: string;
    unmute: string;
    instrument: string;
    orbit: string;
    front: string;
    top: string;
    side: string;
    hideControls: string;
    showControls: string;
    timelineProgress: string;
  };
  algorithms: Record<string, string>;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    teacherName: 'Teacher Bara Tariq',
    subtitle: 'Interactive 3D Algorithm Visualizer',
    footerText:
      'Created by Mr. Bara Tariq using Google AI to teach students how computers work step-by-step logically using algorithms to solve problems, and to visually show the process happening to make it easy for students to understand algorithms.',
    offlineReady: 'Offline Ready',
    offlineBanner: 'Offline Mode: All 3D sorting and sound synthesis run 100% locally.',
    compares: 'Compares',
    swaps: 'Swaps',
    step: 'Step',
    sorted: 'SORTED',
    codeAndLogic: 'Code & Logic',
    executionLogic: 'Execution Logic',
    currentOperation: 'CURRENT OPERATION',
    initialReady: 'Press Play or Step Forward to begin execution...',
    array: 'Array:',
    presets: {
      random: 'Random',
      reversed: 'Reversed (Worst)',
      nearly_sorted: 'Nearly Sorted',
      few_unique: 'Few Unique',
      already_sorted: 'Already Sorted (Best)',
      custom: 'Custom...',
    },
    complexity: {
      time: 'Time:',
      space: 'Space:',
      stable: 'Stable:',
      yes: 'Yes',
      no: 'No',
    },
    controls: {
      play: 'Play',
      pause: 'Pause',
      stepForward: 'Step Forward',
      stepBackward: 'Step Backward',
      reset: 'Reset Array',
      speed: 'Speed',
      elements: 'Elements',
      soundSynth: 'Sound Synthesizer',
      cameraViews: 'Camera Views',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      instrument: 'Instrument',
      orbit: 'Orbit 3D',
      front: 'Front',
      top: 'Top Down',
      side: 'Side',
      hideControls: 'Hide Controls',
      showControls: 'Show Controls',
      timelineProgress: 'TIMELINE PROGRESS',
    },
    algorithms: {
      bubble: 'Bubble Sort (Featured)',
      quick: 'Quick Sort (Hoare)',
      merge: 'Merge Sort',
      insertion: 'Insertion Sort',
      selection: 'Selection Sort',
      heap: 'Heap Sort',
      cocktail: 'Cocktail Shaker Sort',
    },
  },
  fr: {
    teacherName: 'Professeur Bara Tariq',
    subtitle: 'Visualiseur d’Algorithmes 3D Interactif',
    footerText:
      'Créé par M. Bara Tariq à l’aide de Google AI pour enseigner aux étudiants comment les ordinateurs fonctionnent étape par étape logiquement avec des algorithmes pour résoudre des problèmes, et visualiser les processus en temps réel pour faciliter la compréhension des algorithmes.',
    offlineReady: 'Mode Hors-ligne Prêt',
    offlineBanner: 'Mode Hors-ligne : Le tri 3D et le synthétiseur audio fonctionnent 100% localement.',
    compares: 'Comparaisons',
    swaps: 'Échanges',
    step: 'Étape',
    sorted: 'TRIÉ',
    codeAndLogic: 'Code & Logique',
    executionLogic: 'Logique d’Exécution',
    currentOperation: 'OPÉRATION ACTUELLE',
    initialReady: 'Appuyez sur Lecture ou Avancer pour démarrer...',
    array: 'Tableau :',
    presets: {
      random: 'Aléatoire',
      reversed: 'Inversé (Pire)',
      nearly_sorted: 'Presque trié',
      few_unique: 'Peu d’uniques',
      already_sorted: 'Déjà trié (Meilleur)',
      custom: 'Personnalisé...',
    },
    complexity: {
      time: 'Temps :',
      space: 'Espace :',
      stable: 'Stable :',
      yes: 'Oui',
      no: 'Non',
    },
    controls: {
      play: 'Lecture',
      pause: 'Pause',
      stepForward: 'Étape suivante',
      stepBackward: 'Étape précédente',
      reset: 'Réinitialiser',
      speed: 'Vitesse',
      elements: 'Éléments',
      soundSynth: 'Synthétiseur Audio',
      cameraViews: 'Vues Caméra',
      volume: 'Volume',
      mute: 'Couper le son',
      unmute: 'Activer le son',
      instrument: 'Instrument',
      orbit: 'Orbite 3D',
      front: 'Face',
      top: 'Haut',
      side: 'Profil',
      hideControls: 'Masquer contrôles',
      showControls: 'Afficher contrôles',
      timelineProgress: 'PROGRESSION CHRONOLOGIE',
    },
    algorithms: {
      bubble: 'Tri à bulles (Bubble Sort)',
      quick: 'Tri rapide (Quick Sort)',
      merge: 'Tri fusion (Merge Sort)',
      insertion: 'Tri par insertion',
      selection: 'Tri par sélection',
      heap: 'Tri par tas (Heap Sort)',
      cocktail: 'Tri shaker (Cocktail Sort)',
    },
  },
  ar: {
    teacherName: 'الأستاذ بارة طارق',
    subtitle: 'المحاكي التفاعلي ثلاثي الأبعاد للخوارزميات',
    footerText:
      'تم إنشاء هذا البرنامج بواسطة الأستاذ بارة طارق باستخدام Google AI لتعليم الطلاب كيف تعمل الحواسيب خطوة بخطوة وبشكل منطقي باستخدام الخوارزميات لحل المشكلات، وإظهار العمليات بصرياً لتسهيل فهم الخوارزميات على الطلاب.',
    offlineReady: 'جاهز بدون إنترنت',
    offlineBanner: 'وضع عدم الاتصال: كل المحاكاة ثلاثية الأبعاد والأصوات تعمل محلياً 100%.',
    compares: 'المقارنات',
    swaps: 'التبديلات',
    step: 'الخطوة',
    sorted: 'تم الترتيب',
    codeAndLogic: 'الكود والمنطق',
    executionLogic: 'منطق التنفيذ',
    currentOperation: 'العملية الحالية',
    initialReady: 'اضغط تشغيل أو الخطوة التالية لبدء تنفيذ الخوارزمية...',
    array: 'المصفوفة:',
    presets: {
      random: 'عشوائي',
      reversed: 'معكوس (الأسوأ)',
      nearly_sorted: 'شبه مرتب',
      few_unique: 'قيم قليلة مكررة',
      already_sorted: 'مرتب مسبقاً (الأفضل)',
      custom: 'مخصص...',
    },
    complexity: {
      time: 'الزمن:',
      space: 'المساحة:',
      stable: 'مستقر:',
      yes: 'نعم',
      no: 'لا',
    },
    controls: {
      play: 'تشغيل',
      pause: 'إيقاف مؤقت',
      stepForward: 'الخطوة التالية',
      stepBackward: 'الخطوة السابقة',
      reset: 'إعادة تعيين',
      speed: 'السرعة',
      elements: 'عدد العناصر',
      soundSynth: 'مؤثرات الصوت',
      cameraViews: 'زوايا الكاميرا',
      volume: 'مستوى الصوت',
      mute: 'كتم الصوت',
      unmute: 'تشغيل الصوت',
      instrument: 'نوع الآلة',
      orbit: 'دوران حر 3D',
      front: 'من الأمام',
      top: 'من الأعلى',
      side: 'من الجانب',
      hideControls: 'إخفاء لوحة التحكم',
      showControls: 'إظهار لوحة التحكم',
      timelineProgress: 'شريط التقدم الزمني',
    },
    algorithms: {
      bubble: 'الترتيب الفقاعي (Bubble Sort)',
      quick: 'الترتيب السريع (Quick Sort)',
      merge: 'الترتيب بالدمج (Merge Sort)',
      insertion: 'الترتيب بالإدراج (Insertion Sort)',
      selection: 'الترتيب بالاختيار (Selection Sort)',
      heap: 'الترتيب الكومي (Heap Sort)',
      cocktail: 'ترتيب الكوكتيل (Cocktail Sort)',
    },
  },
};
