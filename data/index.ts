import { Article, Author, NavItem, Photo, Video, Language } from "@/types";

export const SITE_URL = "https://gujaratpost.example.com";

export const AUTHORS: Author[] = [
  {
    id: "a1",
    name: "Rajesh Patel",
    nameGu: "રાજેશ પટેલ",
    nameHi: "राजेश पटेल",
    image: "https://i.pravatar.cc/100?img=11",
    designation: "Senior Editor",
    designationGu: "વરિષ્ઠ સંપાદક",
    designationHi: "वरिष्ठ संपादक",
    bio: "Senior journalist covering Gujarat politics and civic affairs for 15 years.",
    bioGu: "ગુજરાતની રાજનીતિ અને નાગરિક મુદ્દાઓ પર 15 વર્ષથી રિપોર્ટિંગ કરતા વરિષ્ઠ પત્રકાર.",
    bioHi: "गुजरात की राजनीति और नागरिक मुद्दों पर 15 वर्षों से रिपोर्टिंग करने वाले वरिष्ठ पत्रकार.",
  },
  {
    id: "a2",
    name: "Priya Shah",
    nameGu: "પ્રિયા શાહ",
    nameHi: "प्रिया शाह",
    image: "https://i.pravatar.cc/100?img=32",
    designation: "Crime Reporter",
    designationGu: "ક્રાઇમ રિપોર્ટર",
    designationHi: "क्राइम रिपोर्टर",
    bio: "Investigative reporter focused on policing, courts and public safety.",
    bioGu: "પોલીસ, કોર્ટ અને જાહેર સુરક્ષા પર કેન્દ્રિત તપાસ પત્રકાર.",
    bioHi: "पुलिस, अदालत और सार्वजनिक सुरक्षा पर केंद्रित खोजी पत्रकार.",
  },
  {
    id: "a3",
    name: "Amit Desai",
    nameGu: "અમિત દેસાઈ",
    nameHi: "अमित देसाई",
    image: "https://i.pravatar.cc/100?img=12",
    designation: "Business Correspondent",
    designationGu: "બિઝનેસ સંવાદદાતા",
    designationHi: "बिजनेस संवाददाता",
    bio: "Tracks Gujarat industry, startups, markets and infrastructure.",
    bioGu: "ગુજરાતના ઉદ્યોગ, સ્ટાર્ટઅપ, બજાર અને ઈન્ફ્રાસ્ટ્રક્ચર પર નજર રાખે છે.",
    bioHi: "गुजरात के उद्योग, स्टार्टअप, बाजार और इन्फ्रास्ट्रक्चर पर नजर रखते हैं.",
  },
  {
    id: "a4",
    name: "Meera Joshi",
    nameGu: "મીરા જોશી",
    nameHi: "मीरा जोशी",
    image: "https://i.pravatar.cc/100?img=47",
    designation: "Sports Reporter",
    designationGu: "સ્પોર્ટ્સ રિપોર્ટર",
    designationHi: "स्पोर्ट्स रिपोर्टर",
    bio: "Covers cricket, kabaddi and emerging sports talent from Gujarat.",
    bioGu: "ગુજરાતના ક્રિકેટ, કબડ્ડી અને ઊભરતી રમત પ્રતિભાઓને આવરી લે છે.",
    bioHi: "गुजरात के क्रिकेट, कबड्डी और उभरती खेल प्रतिभाओं को कवर करती हैं.",
  },
  {
    id: "a5",
    name: "Suresh Trivedi",
    nameGu: "સુરેશ ત્રિવેદી",
    nameHi: "सुरेश त्रिवेदी",
    image: "https://i.pravatar.cc/100?img=52",
    designation: "Political Editor",
    designationGu: "રાજકીય સંપાદક",
    designationHi: "राजनीतिक संपादक",
    bio: "Political analyst with deep coverage of Gujarat elections and policy.",
    bioGu: "ગુજરાત ચૂંટણી અને નીતિ વિષયક ઊંડાણપૂર્વકનું કવરેજ ધરાવતા રાજકીય વિશ્લેષક.",
    bioHi: "गुजरात चुनाव और नीति पर गहरी पकड़ रखने वाले राजनीतिक विश्लेषक.",
  },
];

export const CATEGORY_META = {
  gujarat: { name: "Gujarat", gu: "ગુજરાત", hi: "गुजरात" },
  ahmedabad: { name: "Ahmedabad", gu: "અમદાવાદ", hi: "अहमदाबाद" },
  rajkot: { name: "Rajkot", gu: "રાજકોટ", hi: "राजकोट" },
  surat: { name: "Surat", gu: "સુરત", hi: "सूरत" },
  vadodara: { name: "Vadodara", gu: "વડોદરા", hi: "वडोदरा" },
  crime: { name: "Crime", gu: "ક્રાઇમ", hi: "क्राइम" },
  politics: { name: "Politics", gu: "રાજકારણ", hi: "राजनीति" },
  business: { name: "Business", gu: "બિઝનેસ", hi: "बिजनेस" },
  sports: { name: "Sports", gu: "રમતગમત", hi: "खेल" },
  entertainment: { name: "Entertainment", gu: "મનોરંજન", hi: "मनोरंजन" },
  technology: { name: "Technology", gu: "ટેકનોલોજી", hi: "टेक्नोलॉजी" },
  lifestyle: { name: "Lifestyle", gu: "લાઇફસ્ટાઇલ", hi: "लाइफस्टाइल" },
  education: { name: "Education", gu: "શિક્ષણ", hi: "शिक्षा" },
  world: { name: "World", gu: "વિશ્વ", hi: "विश्व" },
  "election-2027": { name: "Gujarat Election 2027", gu: "ગુજરાત ચૂંટણી 2027", hi: "गुजरात चुनाव 2027" },
  videos: { name: "Videos", gu: "વીડિયો", hi: "वीडियो" },
  shorts: { name: "Shorts", gu: "શોર્ટ્સ", hi: "शॉर्ट्स" },
  podcasts: { name: "Podcasts", gu: "પોડકાસ્ટ", hi: "पॉडकास्ट" },
};

type CategorySlug = keyof typeof CATEGORY_META;

const IMG: Record<string, string[]> = {
  gujarat: [
    "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=800&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  ],
  politics: [
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  ],
  crime: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&q=80",
  ],
  business: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
  ],
  sports: [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
  ],
  entertainment: [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  ],
  world: [
    "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&q=80",
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
  ],
  lifestyle: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
  ],
  education: [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80",
  ],
};

const baseStories = [
  ["gujarat", "Ahmedabad receives heavy rain alert as riverfront gates opened", "અમદાવાદમાં ભારે વરસાદનું એલર્ટ, રિવરફ્રન્ટના ગેટ ખોલાયા", "अहमदाबाद में भारी बारिश का अलर्ट, रिवरफ्रंट के गेट खुले"],
  ["business", "Surat diamond units announce new export recovery plan", "સુરતના ડાયમંડ ઉદ્યોગે નિકાસ સુધારણા યોજના જાહેર કરી", "सूरत डायमंड उद्योग ने निर्यात सुधार योजना घोषित की"],
  ["gujarat", "Rajkot international airport gets new domestic routes", "રાજકોટ ઇન્ટરનેશનલ એરપોર્ટને નવા ડોમેસ્ટિક રૂટ મળ્યા", "राजकोट अंतरराष्ट्रीय एयरपोर्ट को नए घरेलू रूट मिले"],
  ["gujarat", "Vadodara heritage corridor work enters final phase", "વડોદરા હેરિટેજ કોરિડોરનું કામ અંતિમ તબક્કામાં", "वडोदरा हेरिटेज कॉरिडोर का काम अंतिम चरण में"],
  ["politics", "Gujarat Election 2027 preparations intensify across districts", "ગુજરાત ચૂંટણી 2027 માટે જિલ્લાઓમાં તૈયારીઓ તેજ", "गुजरात चुनाव 2027 की तैयारियां जिलों में तेज"],
  ["crime", "Cyber cell busts fake investment app network in Ahmedabad", "અમદાવાદમાં ફેક ઇન્વેસ્ટમેન્ટ એપ નેટવર્કનો પર્દાફાશ", "अहमदाबाद में फेक निवेश ऐप नेटवर्क का खुलासा"],
  ["crime", "Surat police seize contraband worth crores in joint raid", "સુરત પોલીસની સંયુક્ત રેડમાં કરોડોની કિંમતનો મુદ્દામાલ જપ્ત", "सूरत पुलिस की संयुक्त छापेमारी में करोड़ों का माल जब्त"],
  ["business", "GIFT City fintech hub attracts five global firms", "GIFT સિટી ફિનટેક હબમાં પાંચ વૈશ્વિક કંપનીઓનું રોકાણ", "GIFT सिटी फिनटेक हब में पांच वैश्विक कंपनियों का निवेश"],
  ["sports", "Gujarat Titans begin pre-season camp in Ahmedabad", "ગુજરાત ટાઇટન્સે અમદાવાદમાં પ્રી-સીઝન કેમ્પ શરૂ કર્યો", "गुजरात टाइटन्स ने अहमदाबाद में प्री-सीजन कैंप शुरू किया"],
  ["entertainment", "Navratri 2027 garba events announce premium safety plan", "નવરાત્રી 2027 ગરબા માટે પ્રીમિયમ સેફ્ટી પ્લાન જાહેર", "नवरात्रि 2027 गरबा के लिए प्रीमियम सुरक्षा योजना घोषित"],
  ["technology", "Ahmedabad startups launch AI tools for Gujarati businesses", "અમદાવાદ સ્ટાર્ટઅપ્સે ગુજરાતી બિઝનેસ માટે AI ટૂલ્સ લોન્ચ કર્યા", "अहमदाबाद स्टार्टअप्स ने गुजराती कारोबार के लिए AI टूल लॉन्च किए"],
  ["world", "India trade talks may benefit Gujarat textile exporters", "ભારતની ટ્રેડ વાટાઘાટોથી ગુજરાત ટેક્સટાઇલ નિકાસકારોને લાભ", "भारत व्यापार वार्ता से गुजरात टेक्सटाइल निर्यातकों को लाभ"],
  ["lifestyle", "Doctors issue heat and hydration advisory for urban Gujarat", "શહેરી ગુજરાત માટે ડૉક્ટર્સની હીટ અને હાઇડ્રેશન એડવાઇઝરી", "शहरी गुजरात के लिए डॉक्टरों की हीट और हाइड्रेशन सलाह"],
  ["education", "Gujarat board announces new digital assessment system", "ગુજરાત બોર્ડે નવી ડિજિટલ મૂલ્યાંકન સિસ્ટમ જાહેર કરી", "गुजरात बोर्ड ने नई डिजिटल मूल्यांकन प्रणाली घोषित की"],
];

const cityStories = [
  ["ahmedabad", "Ahmedabad metro extension trial run completed successfully", "અમદાવાદ મેટ્રો એક્સ્ટેન્શનનો ટ્રાયલ રન સફળ", "अहमदाबाद मेट्रो विस्तार का ट्रायल रन सफल"],
  ["rajkot", "Rajkot civic body approves smart traffic command centre", "રાજકોટમાં સ્માર્ટ ટ્રાફિક કમાન્ડ સેન્ટરને મંજૂરી", "राजकोट में स्मार्ट ट्रैफिक कमांड सेंटर को मंजूरी"],
  ["surat", "Surat textile market records festive season demand spike", "સુરત ટેક્સટાઇલ માર્કેટમાં તહેવારી માંગમાં વધારો", "सूरत टेक्सटाइल बाजार में त्योहारों की मांग बढ़ी"],
  ["vadodara", "Vadodara lakefront redevelopment opens for public review", "વડોદરા લેકફ્રન્ટ રીડેવલપમેન્ટ જાહેર સમીક્ષા માટે ખુલ્યું", "वडोदरा लेकफ्रंट पुनर्विकास जन समीक्षा के लिए खुला"],
];

const storyPool = [...baseStories, ...cityStories];

const excerptGu = "ગુજરાત પોસ્ટની ખાસ રિપોર્ટ પ્રમાણે આ નિર્ણયથી સ્થાનિક લોકો, વેપાર અને વહીવટી વ્યવસ્થામાં સીધી અસર પડશે.";
const excerptHi = "गुजरात पोस्ट की विशेष रिपोर्ट के अनुसार इस फैसले से स्थानीय लोगों, कारोबार और प्रशासन पर सीधा असर पड़ेगा.";
const excerptEn = "A Gujarat Post special report explains how the development could affect residents, businesses and public administration.";

const contentGu = [
  "સ્થાનિક અધિકારીઓએ જણાવ્યું કે તાજેતરના નિર્ણય બાદ વિસ્તૃત આયોજન શરૂ કરી દેવામાં આવ્યું છે. લોકો સુધી જરૂરી માહિતી ઝડપથી પહોંચે તે માટે અલગ ટીમો કાર્યરત છે.",
  "વિભાગો વચ્ચે સંકલન વધારવા માટે કંટ્રોલ રૂમ અને ડિજિટલ મોનિટરિંગ વ્યવસ્થા તૈયાર કરવામાં આવી છે. નાગરિકોને સત્તાવાર સૂચનાઓનું પાલન કરવાની અપીલ કરવામાં આવી છે.",
  "વિશેષજ્ઞોના મતે આ પગલું લાંબા ગાળે ગુજરાતના વિકાસ, સુરક્ષા અને નાગરિક સુવિધાઓ માટે મહત્વપૂર્ણ સાબિત થઈ શકે છે.",
];

const contentHi = [
  "स्थानीय अधिकारियों ने बताया कि ताजा फैसले के बाद विस्तृत योजना पर काम शुरू कर दिया गया है. लोगों तक जरूरी जानकारी तेजी से पहुंचाने के लिए अलग टीमें सक्रिय हैं.",
  "विभागों के बीच तालमेल बढ़ाने के लिए कंट्रोल रूम और डिजिटल मॉनिटरिंग व्यवस्था तैयार की गई है. नागरिकों से आधिकारिक निर्देशों का पालन करने की अपील की गई है.",
  "विशेषज्ञों के अनुसार यह कदम लंबे समय में गुजरात के विकास, सुरक्षा और नागरिक सुविधाओं के लिए अहम साबित हो सकता है.",
];

const contentEn = [
  "Officials said detailed planning began soon after the latest decision. Dedicated teams are working to ensure timely public updates and smooth coordination.",
  "A control room and digital monitoring system have been prepared to improve coordination between departments. Citizens have been asked to follow official advisories.",
  "Experts believe the move could prove significant for Gujarat's long-term development, public safety and civic infrastructure.",
];

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const imageFor = (category: string, i: number) => {
  const key = category === "ahmedabad" || category === "rajkot" || category === "surat" || category === "vadodara" ? "gujarat" : category;
  const images = IMG[key] || IMG.gujarat;
  return images[i % images.length];
};

export const ARTICLES: Article[] = Array.from({ length: 50 }, (_, i) => {
  const story = storyPool[i % storyPool.length];
  const categorySlug = story[0] as CategorySlug;
  const meta = CATEGORY_META[categorySlug];
  const day = String(10 - (i % 10)).padStart(2, "0");
  const hour = String(6 + (i % 14)).padStart(2, "0");
  const titleSuffix = i >= storyPool.length ? `: ગ્રાઉન્ડ રિપોર્ટ ${i + 1}` : "";
  const titleSuffixHi = i >= storyPool.length ? `: ग्राउंड रिपोर्ट ${i + 1}` : "";
  const titleSuffixEn = i >= storyPool.length ? `: Ground Report ${i + 1}` : "";

  return {
    id: String(i + 1),
    slug: slugify(`${story[1]} ${i + 1}`),
    title: `${story[1]}${titleSuffixEn}`,
    titleGu: `${story[2]}${titleSuffix}`,
    titleHi: `${story[3]}${titleSuffixHi}`,
    excerpt: excerptEn,
    excerptGu,
    excerptHi,
    content: contentEn.join("\n\n"),
    contentGu: contentGu.join("\n\n"),
    contentHi: contentHi.join("\n\n"),
    image: imageFor(categorySlug, i),
    category: meta.name,
    categoryGu: meta.gu,
    categoryHi: meta.hi,
    tags: [meta.name, "Gujarat", i % 2 === 0 ? "Breaking" : "Update"],
    tagsGu: [meta.gu, "ગુજરાત", i % 2 === 0 ? "બ્રેકિંગ" : "અપડેટ"],
    tagsHi: [meta.hi, "गुजरात", i % 2 === 0 ? "ब्रेकिंग" : "अपडेट"],
    author: AUTHORS[i % AUTHORS.length],
    publishedAt: `2026-06-${day}T${hour}:00:00+05:30`,
    updatedAt: `2026-06-${day}T${hour}:45:00+05:30`,
    readingTime: 3 + (i % 5),
    isTrending: i < 10 || i % 7 === 0,
    isBreaking: i % 9 === 0,
    isFeatured: i < 10,
    views: 8200 + i * 3150,
  };
});

export const VIDEOS: Video[] = [
  ["v1", "Prime Time: Gujarat Election 2027 strategy", "પ્રાઇમ ટાઇમ: ગુજરાત ચૂંટણી 2027 વ્યૂહરચના", "प्राइम टाइम: गुजरात चुनाव 2027 रणनीति", "video", "45:23", 82000],
  ["v2", "Ahmedabad rain live ground report", "અમદાવાદ વરસાદ લાઇવ ગ્રાઉન્ડ રિપોર્ટ", "अहमदाबाद बारिश लाइव ग्राउंड रिपोर्ट", "video", "12:05", 98000],
  ["v3", "GIFT City growth explained", "GIFT સિટીની વૃદ્ધિ સરળ ભાષામાં", "GIFT सिटी की वृद्धि आसान भाषा में", "video", "18:45", 62000],
  ["v4", "Crime bulletin from major Gujarat cities", "ગુજરાતના મુખ્ય શહેરોની ક્રાઇમ બુલેટિન", "गुजरात के प्रमुख शहरों की क्राइम बुलेटिन", "video", "22:10", 54000],
  ["s1", "Rain alert in 60 seconds", "60 સેકન્ડમાં વરસાદ એલર્ટ", "60 सेकंड में बारिश अलर्ट", "short", "0:58", 185000],
  ["s2", "Gujarat Titans training moment", "ગુજરાત ટાઇટન્સ ટ્રેનિંગ મોમેન્ટ", "गुजरात टाइटन्स ट्रेनिंग मोमेंट", "short", "0:45", 210000],
  ["s3", "Navratri safety checklist", "નવરાત્રી સેફ્ટી ચેકલિસ્ટ", "नवरात्रि सेफ्टी चेकलिस्ट", "short", "0:59", 146000],
  ["s4", "Surat market quick update", "સુરત માર્કેટ ક્વિક અપડેટ", "सूरत मार्केट क्विक अपडेट", "short", "0:52", 118000],
  ["p1", "Podcast: Gujarat economy next decade", "પોડકાસ્ટ: ગુજરાત અર્થતંત્રનો આગામી દાયક", "पॉडकास्ट: गुजरात अर्थव्यवस्था का अगला दशक", "podcast", "55:00", 36000],
  ["p2", "Podcast: Politics and youth vote", "પોડકાસ્ટ: રાજકારણ અને યુવા મતદાર", "पॉडकास्ट: राजनीति और युवा मतदाता", "podcast", "48:30", 28000],
  ["i1", "Exclusive interview with civic commissioner", "મ્યુનિસિપલ કમિશનર સાથે ખાસ મુલાકાત", "नगर आयुक्त से खास बातचीत", "interview", "32:15", 59000],
  ["i2", "Startup founder on Gujarati AI tools", "ગુજરાતી AI ટૂલ્સ પર સ્ટાર્ટઅપ ફાઉન્ડર", "गुजराती AI टूल्स पर स्टार्टअप फाउंडर", "interview", "28:00", 41000],
].map(([id, title, titleGu, titleHi, type, duration, views], i) => ({
  id: id as string,
  title: title as string,
  titleGu: titleGu as string,
  titleHi: titleHi as string,
  thumbnail: imageFor(["politics", "gujarat", "business", "crime", "sports", "entertainment"][i % 6], i),
  youtubeId: "dQw4w9WgXcQ",
  duration: duration as string,
  type: type as Video["type"],
  publishedAt: `2026-06-${String(10 - (i % 7)).padStart(2, "0")}T${String(8 + i).padStart(2, "0")}:00:00+05:30`,
  views: views as number,
}));

export const PHOTOS: Photo[] = [
  { id: "ph1", src: imageFor("gujarat", 0), alt: "Ahmedabad rain", caption: "Ahmedabad monsoon scenes", captionGu: "અમદાવાદમાં ચોમાસાના દૃશ્યો", captionHi: "अहमदाबाद में मानसून के दृश्य" },
  { id: "ph2", src: imageFor("sports", 0), alt: "Cricket match", caption: "Gujarat cricket practice", captionGu: "ગુજરાત ક્રિકેટ પ્રેક્ટિસ", captionHi: "गुजरात क्रिकेट अभ्यास" },
  { id: "ph3", src: imageFor("politics", 1), alt: "Political rally", caption: "Election rally crowd", captionGu: "ચૂંટણી સભામાં જનમેદની", captionHi: "चुनावी सभा में भीड़" },
  { id: "ph4", src: imageFor("entertainment", 1), alt: "Garba night", caption: "Navratri garba night", captionGu: "નવરાત્રી ગરબા નાઇટ", captionHi: "नवरात्रि गरबा नाइट" },
  { id: "ph5", src: imageFor("business", 1), alt: "Business district", caption: "GIFT City skyline", captionGu: "GIFT સિટી સ્કાઇલાઇન", captionHi: "GIFT सिटी स्काइलाइन" },
  { id: "ph6", src: imageFor("education", 2), alt: "Students", caption: "Digital classroom in Gujarat", captionGu: "ગુજરાતનો ડિજિટલ ક્લાસરૂમ", captionHi: "गुजरात की डिजिटल कक्षा" },
];

export const BREAKING_TICKER = [
  "BREAKING: અમદાવાદમાં ભારે વરસાદનું એલર્ટ",
  "ગુજરાત ચૂંટણી 2027 અપડેટ: મુખ્ય પક્ષોની બેઠક",
  "ક્રાઇમ બ્રેકિંગ: સાયબર સેલનો મોટો પર્દાફાશ",
  "સુરત ડાયમંડ ઉદ્યોગ માટે રાહત પેકેજની ચર્ચા",
  "રાજકોટ એરપોર્ટ પર નવા રૂટની જાહેરાત",
  "GIFT સિટીમાં ફિનટેક કંપનીઓનું રોકાણ",
];

export const NAV_ITEMS: NavItem[] = [
  ["Home", "હોમ", "होम", "/"],
  ["Gujarat", "ગુજરાત", "गुजरात", "/category/gujarat"],
  ["Ahmedabad", "અમદાવાદ", "अहमदाबाद", "/category/ahmedabad"],
  ["Rajkot", "રાજકોટ", "राजकोट", "/category/rajkot"],
  ["Surat", "સુરત", "सूरत", "/category/surat"],
  ["Vadodara", "વડોદરા", "वडोदरा", "/category/vadodara"],
  ["Crime", "ક્રાઇમ", "क्राइम", "/category/crime"],
  ["Politics", "રાજકારણ", "राजनीति", "/category/politics"],
  ["Business", "બિઝનેસ", "बिजनेस", "/category/business"],
  ["Sports", "રમતગમત", "खेल", "/category/sports"],
  ["Entertainment", "મનોરંજન", "मनोरंजन", "/category/entertainment"],
  ["Technology", "ટેકનોલોજી", "टेक्नोलॉजी", "/category/technology"],
  ["Lifestyle", "લાઇફસ્ટાઇલ", "लाइफस्टाइल", "/category/lifestyle"],
  ["Education", "શિક્ષણ", "शिक्षा", "/category/education"],
  ["World", "વિશ્વ", "विश्व", "/category/world"],
  ["Gujarat Election 2027", "ગુજરાત ચૂંટણી 2027", "गुजरात चुनाव 2027", "/category/election-2027"],
  ["Videos", "વીડિયો", "वीडियो", "/videos"],
  ["Watch Never Ends", "વોચ ક્યારેય અટકતું નથી", "देखना कभी खत्म नहीं होता", "/watch"],
  ["Shorts", "શોર્ટ્સ", "शॉर्ट्स", "/shorts"],
  ["Podcasts", "પોડકાસ્ટ", "पॉडकास्ट", "/videos?tab=podcast"],
  ["E-paper", "ઈ-પેપર", "ई-पेपर", "/epaper"],
].map(([label, labelGu, labelHi, href]) => ({ label, labelGu, labelHi, href }));

export const getLocalized = (language: Language, values: { en: string; gu: string; hi: string }) => {
  if (language === "en") return values.en;
  if (language === "hi") return values.hi;
  return values.gu;
};

export const getArticleTitle = (article: Article, language: Language) =>
  getLocalized(language, { en: article.title, gu: article.titleGu, hi: article.titleHi });

export const getArticleExcerpt = (article: Article, language: Language) =>
  getLocalized(language, { en: article.excerpt, gu: article.excerptGu, hi: article.excerptHi });

export const getArticleContent = (article: Article, language: Language) =>
  getLocalized(language, { en: article.content, gu: article.contentGu, hi: article.contentHi });

export const getCategoryLabel = (article: Article, language: Language) =>
  getLocalized(language, { en: article.category, gu: article.categoryGu, hi: article.categoryHi });

export const getArticlesByCategory = (cat: string) => {
  const normalized = cat.toLowerCase();
  const meta = Object.values(CATEGORY_META).find((item) => item.name.toLowerCase() === normalized);
  if (meta?.name === "Gujarat") {
    return ARTICLES.filter((article) => ["Gujarat", "Ahmedabad", "Rajkot", "Surat", "Vadodara"].includes(article.category));
  }
  return ARTICLES.filter((article) => article.category.toLowerCase() === normalized);
};

export const getTrendingArticles = () => ARTICLES.filter((article) => article.isTrending).slice(0, 10);
export const getFeaturedArticles = () => ARTICLES.filter((article) => article.isFeatured).slice(0, 10);
export const getRelatedArticles = (article: Article) =>
  ARTICLES.filter((item) => item.category === article.category && item.id !== article.id).slice(0, 4);

export const searchArticles = (query: string) => {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return ARTICLES.filter((article) => {
    const searchable = [article.title, article.titleGu, article.titleHi, article.excerpt, article.excerptGu, article.excerptHi, article.content, article.contentGu, article.contentHi, article.category, article.categoryGu, article.categoryHi, ...article.tags, ...article.tagsGu, ...article.tagsHi, article.author.name, article.author.nameGu, article.author.nameHi].join(' ').toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  }).sort((a, b) => Number(b.isBreaking) - Number(a.isBreaking) || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
};

export const formatTime = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

export const formatViews = (value: number): string => {
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
};
