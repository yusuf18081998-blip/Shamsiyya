import { Student, Lesson, AttendanceRecord } from '../types';

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_LESSONS: Lesson[] = [
  // Manhaj A0
  {
    id: 'les-a0-1',
    module: 'manhaj_a0',
    number: 1,
    title: 'Arab Alifbosi va Maxrajlar asoslari',
    arabicTitle: 'حُرُوفُ الهِجَاءِ وَمَخَارِجُهَا',
    duration: '45 daqiqa',
    description: 'Arab tilidagi 28 ta tovush, ularning tomoq, til va labdan chiqish o‘rinlari (maxrajlar).',
    contentText: `Arab alifbosida jami 28 ta harf mavjud bo‘lib, barchasi undosh tovushlarni ifodalaydi. Unli tovushlar esa maxsus belgilar — harakatlar (tashkil) vositasida beriladi.
Maxrajlar 5 ta asosiy a'zoga bo‘linadi:
1. Javf (og‘iz va tomoq bo‘shlig‘i)
2. Halq (tomoq a'zolari: quyi, o‘rta, yuqori)
3. Lison (til: til uchi, til o‘rtasi, til tubi, til yoni)
4. Shafatayn (ikki lab)
5. Xoyshum (burun bo‘shlig‘i - g‘unna uchun)`,
    arabicExamples: [
      { arabic: 'أَ - بَ - تَ - ثَ', transcription: 'Alif, Baa, Taa, Saa', translation: 'Dastlabki to‘rtta harf' },
      { arabic: 'جَ - حَ - خَ', transcription: 'Jiym, Haa, Xoo', translation: 'O‘xshash shaklli harflar guruhi' },
      { arabic: 'دَ - ذَ - رَ - زَ', transcription: 'Daal, Zaal, Roo, Zaa', translation: 'O‘zidan keyingi harfga ulanmaydigan harflar' },
    ],
    resources: [
      { name: 'Manhaj_A0_Mavzu1_Maxrajlar.pdf', type: 'pdf', size: '2.4 MB' },
      { name: 'Audio_Harflar_Talaffuzi.mp3', type: 'audio', size: '5.1 MB' },
      { name: 'Lug‘at_A0_Dars1.docx', type: 'vocab', size: '420 KB' },
    ],
    quiz: [
      {
        id: 'q-a0-1',
        question: 'Arab tilida jami nechta mustaqil harf mavjud?',
        arabicSnippet: 'كَمْ عَدَدُ حُرُوفِ الهِجَاءِ؟',
        options: ['26 ta', '28 ta', '30 ta', '32 ta'],
        correctIndex: 1,
        explanation: 'Arab tilida 28 ta harf mavjud bo‘lib, barchasi o‘ngdan chapga yoziladi.',
        points: 10,
      },
      {
        id: 'q-a0-2',
        question: 'Quyidagi harflardan qaysi biri o‘zidan keyingi harfga ulanmaydi?',
        arabicSnippet: 'الْحُرُوفُ الَّتِي لَا تَتَّصِلُ بِمَا بَعْدَهَا',
        options: ['ب (Baa)', 'ت (Taa)', 'د (Daal)', 'م (Miym)'],
        correctIndex: 2,
        explanation: 'د (Daal), ذ (Zaal), ر (Roo), ز (Zaa), و (Vaav), ا (Alif) harflari o‘zidan keyingi harfga ulanmaydi.',
        points: 10,
      },
    ],
  },
  {
    id: 'les-a0-2',
    module: 'manhaj_a0',
    number: 2,
    title: 'Harakatlar: Fatha, Kasra, Zamma va Sukun',
    arabicTitle: 'الحَرَكَاتُ: الفَتْحَةُ وَالكَسْرَةُ وَالضَّمَّةُ وَالسُّكُونُ',
    duration: '50 daqiqa',
    description: 'Arab tilidagi qisqa unlilar: a, i, u tovushlarini hosil qilish hamda to‘xtash belgisi (sukun).',
    contentText: `Arab yozuvida harflarning usti yoki ostiga qo‘yiladigan kichik belgilar harakatlar deb ataladi:
- Fatha ( َ ): Harf ustiga qo‘yiladi, "a" yoki yo‘g‘on harflarda "o" deb o‘qiladi.
- Kasra ( ِ ): Harf ostiga qo‘yiladi, "i" deb o‘qiladi.
- Zamma ( ُ ): Harf ustiga qo‘yiladi, kichik "vov" shaklida bo‘lib, "u" deb o‘qiladi.
- Sukun ( ْ ): Harakat yo‘qligini, harfning to‘xtashini bildiradi.`,
    arabicExamples: [
      { arabic: 'كَتَبَ', transcription: 'Kataba', translation: 'U yozdi (Fatha bilan)' },
      { arabic: 'عَلِمَ', transcription: '‘Alima', translation: 'U bildi (Fatha va Kasra)' },
      { arabic: 'كُتِبَ', transcription: 'Kutiba', translation: 'Yozildi (Zamma va Kasra)' },
    ],
    resources: [
      { name: 'Manhaj_A0_Mavzu2_Harakatlar.pdf', type: 'pdf', size: '1.8 MB' },
      { name: 'Mashqlar_Harakatlar.pdf', type: 'pdf', size: '950 KB' },
    ],
    quiz: [
      {
        id: 'q-a0-3',
        question: 'Harf ostiga qo‘yiladigan va "i" tovushini beruvchi belgi nima deb ataladi?',
        arabicSnippet: 'الحَرَكَةُ الَّتِي تُوضَعُ تَحْتَ الحَرْفِ',
        options: ['Fatha', 'Kasra', 'Zamma', 'Tanvin'],
        correctIndex: 1,
        explanation: 'Kasra harf ostida chiziqcha shaklida bo‘ladi va "i" tovushini ifodalaydi.',
        points: 10,
      },
    ],
  },

  // Manhaj A1
  {
    id: 'les-a1-1',
    module: 'manhaj_a1',
    number: 1,
    title: 'At-Tahiyyatu vat-Ta‘aaruf (Salomlashish va Tanishuv)',
    arabicTitle: 'التَّحِيَّةُ وَالتَّعَارُفُ',
    duration: '60 daqiqa',
    description: 'Kundalik so‘zlashuvda salomlashish, o‘zini tanishtirish va hol-ahvol so‘rash iboralari.',
    contentText: `Arab madaniyatida samimiy salomlashish va tanishuv muloqotning eng go‘zal boshlanishidir.
Asosiy iboralar:
- As-salaamu 'alaykum! - Va 'alaykumus-salaam!
- Ahlan va sahlan! (Xush kelibsiz!)
- Masmuki? (Ismingiz nima? - ayol kishiga) -> Ismii Zaynab. (Mening ismim Zaynab).
- Kayfa haaluki? (Ahvolingiz qanday? - ayol kishiga) -> Bixoyrin, valhamdu lillah. (Yaxshi, Allohga shukr).
- Min ayna anti? (Siz qayerdansiz? - ayol kishiga) -> Ana min O'zbekistan. (Men O‘zbekistondaman).`,
    arabicExamples: [
      { arabic: 'السَّلَامُ عَلَيْكُمْ - وَعَلَيْكُمُ السَّلَامُ', transcription: 'As-salaamu ‘alaykum - Va ‘alaykumus-salaam', translation: 'Tinchlik-omonlik bo‘lsin!' },
      { arabic: 'مَا اسْمُكِ؟ اِسْمِي رَيْحَانَةُ', transcription: 'Masmuki? Ismii Rayhana', translation: 'Ismingiz nima? Mening ismim Rayhona.' },
      { arabic: 'كَيْفَ حَالُكِ؟ بِخَيْرٍ وَالحَمْدُ لِلَّهِ', transcription: 'Kayfa haaluki? Bixoyrin valhamdu lillah', translation: 'Ahvolingiz qanday? Yaxshi, shukr.' },
    ],
    resources: [
      { name: 'Manhaj_A1_Dars1_Muloqot.pdf', type: 'pdf', size: '3.1 MB' },
      { name: 'Audio_Dialog_AtTahiyya.mp3', type: 'audio', size: '6.8 MB' },
      { name: 'So‘zlik_Lug‘at_A1_1.pdf', type: 'vocab', size: '520 KB' },
    ],
    quiz: [
      {
        id: 'q-a1-1',
        question: 'Ayol kishiga "Ahvolingiz qanday?" deb murojaat qilish qaysi javobda to‘g‘ri berilgan?',
        arabicSnippet: 'كَيْفَ تَسْأَلِينَ عَنِ الحَالِ لِلْمُؤَنَّثِ؟',
        options: ['Kayfa haaluka?', 'Kayfa haaluki?', 'Masmuka?', 'Man anta?'],
        correctIndex: 1,
        explanation: 'Ayol kishiga murojaatda "ka" o‘rniga "ki" ishlatiladi: Kayfa haaluki?',
        points: 10,
      },
      {
        id: 'q-a1-2',
        question: '"Ahlan va sahlan" iborasiga qanday javob qaytariladi?',
        arabicSnippet: 'الرَّدُّ عَلَى «أَهْلًا وَسَهْلًا»',
        options: ['Ahlan biki', 'Shukran', 'Ma‘as-salaama', 'Na‘am'],
        correctIndex: 0,
        explanation: 'Ayol kishiga "Ahlan biki", erkak kishiga "Ahlan bika" deb javob beriladi.',
        points: 10,
      },
    ],
  },
  {
    id: 'les-a1-2',
    module: 'manhaj_a1',
    number: 2,
    title: 'Al-Usrah va Al-Aqorib (Oila va Qarindoshlar)',
    arabicTitle: 'الأُسْرَةُ وَالأَقَارِبُ',
    duration: '55 daqiqa',
    description: 'Oila a‘zolari, kasblar va o‘z oilasi haqida qisqa hikoya tuzish.',
    contentText: `Oila a‘zolarini ifodalovchi asosiy so‘zlar:
- Ab (أَبٌ) / Vaalid (وَالِدٌ) — Ota
- Umm (أُمٌّ) / Vaalida (وَالِدَةٌ) — Ona
- Ax (أَخٌ) — Aka / Uka
- Uxt (أُخْتٌ) — Opa / Singil
- Jadd (جَدٌّ) — Bobo
- Jadda (جَدَّةٌ) — Buvi
- Ibn (اِبْنٌ) — O‘g‘il
- Bint (بِنْتٌ) — Qiz`,
    arabicExamples: [
      { arabic: 'هَذِهِ أُسْرَتِي الكَرِيمَةُ', transcription: 'Hazihi usratiy al-kariima', translation: 'Bu mening saodatli oilam' },
      { arabic: 'أُمِّي مُعَلِّمَةٌ وَأَبِي طَبِيبٌ', transcription: 'Ummiy mu‘allimatun va abiy tobiib', translation: 'Onam o‘qituvchi, otam shifokor' },
    ],
    resources: [
      { name: 'Manhaj_A1_Dars2_Oila.pdf', type: 'pdf', size: '2.7 MB' },
      { name: 'Lug‘at_Oila_A1.pdf', type: 'vocab', size: '610 KB' },
    ],
    quiz: [
      {
        id: 'q-a1-3',
        question: 'Arab tilida "Opa/Singil" so‘zi qaysi?',
        arabicSnippet: 'مَا مَعْنَى كَلِمَةِ «أُخْتٌ»؟',
        options: ['Uxtun (أُخْتٌ)', 'Bintun (بِنْتٌ)', 'Ummun (أُمٌّ)', 'Xolatun (خَالَةٌ)'],
        correctIndex: 0,
        explanation: 'Uxtun (أُخْتٌ) — opa yoki singil ma‘nosini bildiradi.',
        points: 10,
      },
    ],
  },

  // Grammatika
  {
    id: 'les-gr-1',
    module: 'grammar',
    number: 1,
    title: 'Kalomning Qismlari: Ism, Fe‘l va Harf',
    arabicTitle: 'أَقْسَامُ الكَلَامِ: الاِسْمُ وَالفِعْلُ وَالحَرْفُ',
    duration: '60 daqiqa',
    description: 'Arab tili grammatikasining tamal toshi: so‘z turlari va ularning aniq belgilari.',
    contentText: `Arab tilida barcha so‘zlar uchta asosiy turkumga ajraladi:
1. Ism (الاِسْمُ): O‘z mohiyatida mustaqil ma‘noga ega bo‘lib, zamon bilan bog‘lanmagan so‘z. Belgilari: Alif-lom (ال) qabul qilishi, tanvin olishi, jarr holatiga tushishi.
2. Fe‘l (الفِعْلُ): Muayyan zamon (o‘tgan, hozirgi-kelasi yoki buyruq) bilan bog‘liq ish-harakatni ifodalovchi so‘z.
3. Harf (الحَرْفُ): Boshqa so‘z bilan birikmaguncha o‘zicha to‘liq ma‘no anglatmaydigan yordamchi so‘z (masalan: fi, 'ala, min, ila).`,
    arabicExamples: [
      { arabic: 'كِتَابٌ - مَدْرَسَةٌ - شَمْسِيَّةُ', transcription: 'Kitaabun, Madrasatun, Shamsiyya', translation: 'Ismlarga misollar (otlar)' },
      { arabic: 'قَرَأَ - يَقْرَأُ - اِقْرَأْ', transcription: 'Qoro’a, Yaqro’u, Iqro’', translation: 'Fe‘l zamonlari: o‘qidi, o‘qimoqda, o‘qi!' },
      { arabic: 'فِي - عَلَى - إِلَى', transcription: 'Fii, ‘Ala, Ila', translation: 'Jarr harflari: ichida, ustida, tomon' },
    ],
    resources: [
      { name: 'Grammatika_Dars1_KalomQismlari.pdf', type: 'pdf', size: '2.9 MB' },
      { name: 'Jadval_KalomQismlari.pdf', type: 'pdf', size: '820 KB' },
    ],
    quiz: [
      {
        id: 'q-gr-1',
        question: 'Quyidagilardan qaysi biri Ismning asosiy belgisidir?',
        arabicSnippet: 'عَلَامَاتُ الاِسْمِ فِي اللُّغَةِ العَرَبِيَّةِ',
        options: ['Zamon bilan cheklanishi', 'Alif-lom (ال) va Tanvin qabul qilishi', 'Faqat buyruq shaklida kelishi', 'O‘zicha hech qanday ma‘no bildirmasligi'],
        correctIndex: 1,
        explanation: 'Ism alif-lom (ال), tanvin va jarr harflarini qabul qila oladi hamda zamonga bog‘liq emas.',
        points: 10,
      },
      {
        id: 'q-gr-2',
        question: '«فِي المَدْرَسَةِ» (Maktabda) birikmasida «فِي» so‘zi qaysi turkumga kiradi?',
        arabicSnippet: 'مَا نَوْعُ كَلِمَةِ «فِي»؟',
        options: ['Ism', 'Fe‘l', 'Harf (Jarr)', 'Sifat'],
        correctIndex: 2,
        explanation: '«فِي» — jarr harfi hisoblanadi.',
        points: 10,
      },
    ],
  },
  {
    id: 'les-gr-2',
    module: 'grammar',
    number: 2,
    title: 'Muzakkar va Muannas (Erkak va Ayol jinsi)',
    arabicTitle: 'المُذَكَّرُ وَالمُؤَنَّثُ فِي اللُّغَةِ العَرَبِيَّةِ',
    duration: '50 daqiqa',
    description: 'Arab tilida jins kategoriyasi, to marbuta (ة) va muannaslik belgilari.',
    contentText: `Arab tilida barcha ismlar yo muzakkar (erkak jinsi) yoki muannas (ayol jinsi) bo‘ladi.
Muannaslikning asosiy belgilari:
1. To marbuta (ة): masalan, طَالِبَةٌ (talaba qiz), مَدْرَسَةٌ (maktab).
2. Alif maqsura (ى): masalan, كُبْرَى (kubro), بُشْرَى (bushro).
3. Juft tana a‘zolari (ko‘z, quloq, qo‘l, oyoq): masalan, عَيْنٌ (ko‘z), يَدٌ (qo‘l).
4. Semantik (tabiiy) muannas: masalan, أُمٌّ (ona), عَرُوسٌ (kelin).`,
    arabicExamples: [
      { arabic: 'مُعَلِّمٌ (Muzakkar) -> مُعَلِّمَةٌ (Muannas)', transcription: 'Mu‘allimun -> Mu‘allimatun', translation: 'Muallim -> Muallima' },
      { arabic: 'هَذَا كِتَابٌ (Muzakkar) / هَذِهِ حَقِيبَةٌ (Muannas)', transcription: 'Haza kitaabun / Hazihi haqiibatun', translation: 'Bu kitob / Bu sumka' },
    ],
    resources: [
      { name: 'Grammatika_Dars2_Jinslar.pdf', type: 'pdf', size: '2.1 MB' },
    ],
    quiz: [
      {
        id: 'q-gr-3',
        question: 'Quyidagi so‘zlardan qaysi biri muannas (ayol) jinsiga mansub?',
        arabicSnippet: 'أَيُّ الكَلِمَاتِ الآتِيَةِ مُؤَنَّثَةٌ؟',
        options: ['قَلَمٌ (Qalam)', 'بَابٌ (Eshik)', 'مَدْرَسَةٌ (Maktab)', 'كِتَابٌ (Kitob)'],
        correctIndex: 2,
        explanation: 'Madrasatun (مَدْرَسَةٌ) so‘zi oxirida to marbuta (ة) bo‘lgani uchun muannasdir.',
        points: 10,
      },
    ],
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
