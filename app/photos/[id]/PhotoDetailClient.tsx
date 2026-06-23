'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Clock, Eye, MessageCircle, Phone, Globe, Mail, ChevronRight as ChevronRightIcon 
} from 'lucide-react';
import { PHOTOS, ARTICLES, getLocalized } from '@/data';
import { useApp } from '@/components/AppProvider';
import NewsCard from '@/components/ui/NewsCard';

const shareUrl = (platform: string, url: string, text: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  if (platform === 'twitter') return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  if (platform === 'whatsapp') return `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  return '#';
};

const MOCK_DESCRIPTIONS: Record<string, { en: string; gu: string; hi: string; category: { en: string; gu: string; hi: string } }> = {
  ph1: {
    category: { en: "Gujarat", gu: "ગુજરાત", hi: "गुजरात" },
    en: "Ahmedabad witnessed heavy continuous rain causing traffic snarls and waterlogging in low-lying areas. The Sabarmati Riverfront development authority has monitored the water level closely and opened key gates to maintain safety guidelines. Civic teams are working continuously to clear roads and ensure public safety across major zones.\n\nLocal authorities have issued emergency contact numbers for residents and activated multiple rescue centers. Citizens are advised to plan their commute according to rain alerts and avoid underpasses during heavy spells.",
    gu: "અમદાવાદમાં અવિરત ભારે વરસાદને પગલે નીચાણવાળા વિસ્તારોમાં પાણી ભરાયા છે અને ટ્રાફિક જામની સમસ્યા સર્જાઈ છે. સાબરમતી રિવરફ્રન્ટ ડેવલપમેન્ટ ઓથોરિટી દ્વારા પાણીના સ્તર પર ચાંપતી નજર રાખવામાં આવી રહી છે અને સુરક્ષા માર્ગદર્શિકા જાળવવા માટે મુખ્ય દરવાજા ખોલવામાં આવ્યા છે. મ્યુનિસિપલ ટીમો રસ્તાઓ સાફ કરવા માટે સતત કામ કરી રહી છે.\n\nસ્થાનિક તંત્ર દ્વારા નાગરિકો માટે ઈમરજન્સી હેલ્પલાઈન નંબરો જાહેર કરવામાં આવ્યા છે અને બચાવ કેન્દ્રો સક્રિય કરાયા છે. ભારે વરસાદ દરમિયાન લોકોને અંડરપાસથી બચવા અને સાવચેતી રાખવા અપીલ કરાઈ છે.",
    hi: "अहमदाबाद में लगातार भारी बारिश के कारण निचले इलाकों में जलभराव हो गया और ट्रैफिक जाम की समस्या पैदा हो गई। साबरमती रिवरफ्रंट विकास प्राधिकरण पानी के स्तर पर पैनी नजर रख रहा है और सुरक्षा बनाए रखने के लिए मुख्य गेट खोल दिए गए हैं। नगर निगम की टीमें सड़कों को साफ करने और सार्वजनिक सुरक्षा सुनिश्चित करने के लिए काम कर रही हैं।\n\nप्रशासन ने नागरिकों के लिए आपातकालीन हेल्पलाइन नंबर जारी किए हैं और विभिन्न राहत केंद्रों को सक्रिय कर दिया है। लोगों को सलाह दी गई है कि वे जलभराव वाले क्षेत्रों और अंडरपासों की ओर जाने से बचें।"
  },
  ph2: {
    category: { en: "Sports", gu: "રમતગમત", hi: "खेल" },
    en: "The Gujarat Cricket Team was seen during an intense practice session at the Narendra Modi Stadium. With the upcoming domestic and IPL seasons, key batsmen and bowlers were seen refining their skills under head coach's supervision. The energy was high as the young talent blended with experienced pros during training drills.\n\nCoaches focused heavily on fielding accuracy and fast bowling lengths. The session also saw tactical discussions regarding target setting in powerplays, with players showing promising shape ahead of the tournaments.",
    gu: "ગુજરાત ક્રિકેટ ટીમ નરેન્દ્ર મોદી સ્ટેડિયમમાં સઘન પ્રેક્ટિસ સેશન દરમિયાન જોવા મળી હતી. આગામી સ્થાનિક અને આઈપીએલ સીઝનને ધ્યાનમાં રાખીને, મુખ્ય બેટ્સમેનો અને બોલરો હેડ કોચની દેખરેખ હેઠળ તેમની કુશળતા સુધારી રહ્યા છે. તાલીમ દરમિયાન અનુભવી ખેલાડીઓ સાથે યુવા પ્રતિભાઓ ઉત્સાહભેર જોડાઈ હતી.\n\nકોચિંગ સ્ટાફ દ્વારા ફિલ્ડિંગ ચોકસાઈ અને બોલિંગ લેન્થ પર વિશેષ ભાર મૂકવામાં આવ્યો હતો. આ સત્રમાં પાવરપ્લે દરમિયાન રન રેટ વધારવાની વ્યુહરચના અંગે ચર્ચાઓ પણ કરવામાં આવી હતી.",
    hi: "नरेंद्र मोदी स्टेडियम में गुजरात क्रिकेट टीम अभ्यास सत्र के दौरान नजर आई। आगामी घरेलू और आईपीएल सीज़न को देखते हुए, मुख्य बल्लेबाज और गेंदबाज मुख्य कोच की देखरेख में अपने कौशल को निखार रहे हैं। प्रशिक्षण के दौरान अनुभवी खिलाड़ियों के साथ युवा प्रतिभाएं भी काफी सक्रिय नजर आईं।\n\nकोचिंग स्टाफ ने फील्डिंग और गेंदबाजी की सटीक लेंथ पर विशेष ध्यान दिया। अभ्यास सत्र के दौरान पावरप्ले की रणनीतियों और खिलाड़ियों की फिटनेस स्तर पर भी चर्चा की गई।"
  },
  ph3: {
    category: { en: "Politics", gu: "રાજકારણ", hi: "राजनीति" },
    en: "A massive crowd gathered at the district election rally showing high enthusiasm and support. Political leaders addressed key developmental schemes, civic infrastructure plans, and employment initiatives targeted for the upcoming 2027 state assembly elections. Strict police deployment ensured smooth crowd management and traffic movement.\n\nSpeakers highlighted achievements in industry growth, agricultural subsidies, and smart-city implementations. Opposition leaders simultaneously scheduled parallel town halls, marking an early start to campaign trails.",
    gu: "જિલ્લા ચૂંટણી રેલીમાં ભારે ઉત્સાહ અને સમર્થન દર્શાવતી વિશાળ જનમેદની એકઠી થઈ હતી. રાજકીય નેતાઓએ આગામી ૨૦૨૭ની વિધાનસભા ચૂંટણી માટે નિર્ધારિત કલ્યાણકારી યોજનાઓ, ઈન્ફ્રાસ્ટ્રક્ચર વિકાસ અને રોજગાર પહેલ અંગે સંબોધન કર્યું હતું. પોલીસ બંદોબસ્તને કારણે જનમેદની વ્યવસ્થા સુચારૂ રહી હતી.\n\nનેતાઓએ ઉદ્યોગ વિકાસ, કૃષિ સબસિડી અને સ્માર્ટ સિટી પ્રોજેક્ટ્સની સિદ્ધિઓ રજૂ કરી હતી. બીજી તરફ, વિપક્ષી પક્ષોએ પણ સમાંતર જનસભાઓનું આયોજન કરીને ચૂંટણી પ્રચારના શ્રીગણેશ કરી દીધા છે.",
    hi: "जिला चुनाव रैली में भारी उत्साह और समर्थन दिखाते हुए विशाल जनसमुदाय एकत्रित हुआ। राजनीतिक नेताओं ने आगामी 2027 के राज्य विधानसभा चुनावों के लिए लक्षित प्रमुख विकास योजनाओं, बुनियादी ढांचे और रोजगार पहलों पर चर्चा की। पुलिस की मुस्तैदी से भीड़ प्रबंधन सुचारू रहा।\n\nनेताओं ने औद्योगिक प्रगति, कृषि सब्सिडी और स्मार्ट सिटी परियोजनाओं की उपलब्धियों पर ध्यान केंद्रित किया। इस बीच विपक्षी दलों ने भी समानांतर रैलियों के जरिए चुनाव अभियान तेज कर दिया है।"
  },
  ph4: {
    category: { en: "Entertainment", gu: "મનોરંજન", hi: "मनोरंजन" },
    en: "Navratri Garba celebrations reached peak excitement in Gujarat as thousands of youngsters danced to traditional folk tunes. Dressed in vibrant ethnic attire, the participants showcased coordinated choreography. Organizing committees highlighted high-end security measures, CCTV surveillance, and first-aid counters at all major venues.\n\nSeveral celebrity guests attended the commercial venues, raising the festive energy. Traditional musicians and modern acoustic bands blended classical garba roots with contemporary tempos, creating memorable evenings.",
    gu: "નવરાત્રી ગરબા મહોત્સવ ગુજરાતમાં ચરમસીમા પર પહોંચ્યો હતો જ્યાં હજારો ખેલૈયાઓ પરંપરાગત લોકધૂન પર ઝૂમ્યા હતા. વાઇબ્રન્ટ પરંપરાગત પોશાક સજ્જ થઈને ખેલૈયાઓએ રાસ-ગરબાની રમઝટ બોલાવી હતી. આયોજક સમિતિઓએ તમામ મુખ્ય સ્થળોએ હાઈ-એન્ડ સુરક્ષા પગલાં, સીસીટીવી સર્વેલન્સ અને પ્રાથમિક સારવાર કાઉન્ટર્સની વ્યવસ્થા કરી હતી.\n\nકેટલાક સેલિબ્રિટી મહેમાનોએ ગરબા પંડાલોની મુલાકાત લીધી હતી. પરંપરાગત ગાયકો અને સંગીતકારોએ શાસ્ત્રીય ગરબા રાગને આધુનિક બીટ્સ સાથે જોડીને અદ્ભુત માહોલ સરજ્યો હતો.",
    hi: "गुजरात में नवरात्रि गरबा महोत्सव का उत्साह चरम पर पहुंच गया जहां हजारों युवाओं ने पारंपरिक धुनों पर नृत्य किया। रंग-बिरंगे पारंपरिक परिधानों में सजे प्रतिभागियों ने शानदार प्रदर्शन किया। आयोजन समितियों ने सुरक्षा उपायों, सीसीटीवी निगरानी और प्राथमिक चिकित्सा काउंटरों की व्यवस्था की।\n\nमहोत्सव के दौरान विभिन्न हस्तियों ने गरबा पंडालों में शिरकत की। पारंपरिक गायकों और आधुनिक ऑर्केस्ट्रा ने शास्त्रीय गरबा गीतों को नई धुनों के साथ पेश कर शाम को बेहद खास बना दिया।"
  },
  ph5: {
    category: { en: "Business", gu: "બિઝનેસ", hi: "बिजनेस" },
    en: "The iconic GIFT City skyline captured during twilight, representing Gujarat's growing corporate footprint and global financial integrations. With state-of-the-art infrastructure, tech hubs, and smart traffic control corridors, the district is rapidly emerging as a preferred investment destination for global multinational firms.\n\nMultiple global banks and fintech companies have recently expanded their office footprints in the international zone. Local infrastructure is scaling up with premium residential projects and metro connectivity nearing commercial operations.",
    gu: "સંધ્યાકાળે લેવાયેલ GIFT સિટીની આકર્ષક સ્કાઇલાઇન, જે ગુજરાતના વધતા જતા કોર્પોરેટ ક્ષેત્ર અને વૈશ્વિક નાણાકીય એકીકરણનું પ્રતિનિધિત્વ કરે છે. અત્યાધુનિક ઇન્ફ્રાસ્ટ્રક્ચર, ટેક હબ અને સ્માર્ટ કંટ્રોલ કોરિડોર સાથે, આ ક્ષેત્ર વૈશ્વિક મલ્ટિનેશનલ કંપનીઓ માટે રોકાણનું કેન્દ્ર બની રહ્યું છે.\n\nકેટલીક વૈશ્વિક બેંકો અને ફિનટેક કંપનીઓએ તાજેતરમાં ઇન્ટરનેશનલ ઝોનમાં પોતાના એકમો શરૂ કર્યા છે. રહેણાંક પ્રોજેક્ટ્સ અને મેટ્રો કનેક્ટિવિટી પણ અહીં ઝડપથી પૂર્ણ થઈ રહી છે.",
    hi: "संध्याकाल के समय ली गई गिफ्ट सिटी की स्काईलाइन, जो गुजरात के बढ़ते कॉर्पोरेट क्षेत्र और वैश्विक वित्तीय एकीकरण का प्रतिनिधित्व करती है। अत्याधुनिक बुनियादी ढांचे, तकनीकी हब और स्मार्ट नियंत्रण के साथ, यह क्षेत्र बहुराष्ट्रीय कंपनियों के लिए पसंदीदा निवेश गंतव्य बन रहा है।\n\nकई वैश्विक बैंकों और वित्तीय संस्थानों ने हाल ही में अंतरराष्ट्रीय वित्तीय केंद्र में काम शुरू किया है। आवासीय सुविधाओं और मेट्रो कनेक्टिविटी के विस्तार से यहां काफी तेजी आई है।"
  },
  ph6: {
    category: { en: "Education", gu: "શિક્ષણ", hi: "शिक्षा" },
    en: "Students interacting in a modern digital classroom implemented across municipal schools in Gujarat. Equipped with interactive smartboards, educational software, and tablet-based learning, the initiative aims to bridge the digital divide and foster conceptual clarity and cognitive skill development at secondary school levels.\n\nEducation departments recorded double-digit improvements in term assessments following digital integrations. Training programs for teachers have also been streamlined to ensure effective delivery of interactive learning modules.",
    gu: "ગુજરાતની સરકારી શાળાઓમાં અમલીકૃત આધુનિક ડિજિટલ ક્લાસરૂમમાં વિદ્યાર્થીઓ અભ્યાસ કરી રહ્યા છે. ઇન્ટરેક્ટિવ સ્માર્ટબોર્ડ્સ, શૈક્ષણિક સોફ્ટવેર અને ટેબ્લેટ-આધારિત લર્નિંગથી સજ્જ આ પહેલનો હેતુ ડિજિટલ વિભાજનને દૂર કરવાનો અને ગુણવત્તાયુક્ત શિક્ષણ પ્રદાન કરવાનો છે.\n\nઆ ડિજિટલ શિક્ષણ પદ્ધતિ અપનાવ્યા બાદ વિદ્યાર્થીઓના પરિણામોમાં સારો સુધારો નોંધાયો છે. શિક્ષકોને પણ આધુનિક સાધનો દ્વારા રસપ્રદ શિક્ષણ આપવા માટે તાલીમ આપવામાં આવી રહી છે.",
    hi: "गुजरात के सरकारी स्कूलों में लागू आधुनिक डिजिटल कक्षा में छात्र पढ़ाई कर रहे हैं। इंटरैक्टिव स्मार्टबोर्ड, शैक्षिक सॉफ्टवेयर और टैबलेट-आधारित लर्निंग से लैस इस पहल का उद्देश्य डिजिटल विभाजन को दूर करना और माध्यमिक स्तर पर गुणवत्तापूर्ण शिक्षा प्रदान करना है।\n\nडिजिटल माध्यमों के इस्तेमाल से छात्रों के शैक्षणिक प्रदर्शन में सकारात्मक सुधार देखा गया है। शिक्षकों को भी इन आधुनिक उपकरणों का उपयोग कर कक्षा को प्रभावी बनाने के लिए प्रशिक्षित किया गया है।"
  }
};

interface Props {
  activeId: string;
}

export default function PhotoDetailClient({ activeId }: Props) {
  const { language } = useApp();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeIndex = PHOTOS.findIndex((item) => item.id === activeId);
  const photo = PHOTOS[activeIndex === -1 ? 0 : activeIndex];
  const photoUrl = typeof window !== 'undefined' ? window.location.href : 'https://gujaratpost.com/photos';

  // Finding next/prev active indexes excluding the current photo from list is not strictly necessary for simple carousel
  const nextIndex = (activeIndex + 1) % PHOTOS.length;
  const prevIndex = (activeIndex - 1 + PHOTOS.length) % PHOTOS.length;

  const handleNext = () => {
    router.push(`/photos/${PHOTOS[nextIndex].id}`);
  };

  const handlePrev = () => {
    router.push(`/photos/${PHOTOS[prevIndex].id}`);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(photoUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const caption = getLocalized(language, { en: photo.caption, gu: photo.captionGu, hi: photo.captionHi });
  
  const descriptionData = MOCK_DESCRIPTIONS[photo.id] || {
    category: { en: "Gallery", gu: "ગેલેરી", hi: "गैलरी" },
    en: caption, gu: caption, hi: caption
  };

  const category = getLocalized(language, descriptionData.category);
  const bodyText = getLocalized(language, descriptionData);
  const paragraphs = bodyText.split(/\n\n+/);

  const trending = ARTICLES.filter((item) => item.isTrending).slice(0, 6);

  const shareLinks = [
    { label: 'Facebook', href: shareUrl('facebook', photoUrl, caption), bg: 'bg-[#1877f2]' },
    { label: 'WhatsApp', href: shareUrl('whatsapp', photoUrl, caption), bg: 'bg-[#25d366]' },
    { label: 'X', href: shareUrl('twitter', photoUrl, caption), bg: 'bg-black' },
  ];

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2">
          
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-accent">Home</Link>
            <ChevronRightIcon className="h-3 w-3" />
            <Link href="/photos" className="hover:text-accent">
              {getLocalized(language, { en: 'Photo Gallery', gu: 'ફોટો ગેલેરી', hi: 'फोटो गैलरी' })}
            </Link>
            <ChevronRightIcon className="h-3 w-3" />
            <span className="line-clamp-1">{caption}</span>
          </nav>

          {/* Category Tag */}
          <div className="mb-3 flex items-center gap-2">
            <span className="cat-badge bg-accent text-white rounded px-2 py-0.5 text-xs font-black uppercase">
              {category}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {activeIndex + 1} / {PHOTOS.length}
            </span>
          </div>

          {/* Caption / Heading */}
          <h1 className="mb-4 text-2xl font-black leading-tight text-foreground md:text-4xl">{caption}</h1>

          {/* Author/Date Row */}
          <div className="mb-5 flex flex-wrap items-center gap-4 border-y border-border py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-black text-sm">
              GP
            </div>
            <div>
              <p className="text-sm font-black text-foreground">
                {getLocalized(language, { en: 'Gujarat Post Photographer', gu: 'ગુજરાત પોસ્ટ ફોટોગ્રાફર', hi: 'गुजरात पोस्ट फोटोग्राफर' })}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                {getLocalized(language, { en: 'Special Coverage', gu: 'ખાસ કવરેજ', hi: 'विशेष कवरेज' })}
              </p>
            </div>
            <div className="ml-auto text-xs text-muted-foreground text-right">
              <p className="flex items-center gap-1"><Clock className="h-3 w-3" />
                {new Date().toLocaleDateString(language === 'gu' ? 'gu-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="flex items-center gap-1 justify-end"><Eye className="h-3 w-3" />10K+ {getLocalized(language, { en: 'views', gu: 'વ્યુઝ', hi: 'વ્યુઝ' })}</p>
            </div>
          </div>

          {/* Share Action Row */}
          <div className="no-print mb-5 flex flex-wrap gap-2">
            {shareLinks.map(({ label, href, bg }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black text-white ${bg} hover:scale-[1.02] transition`}>
                {label === 'Facebook' && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true"><path fill="currentColor" d="M14.2 8.2V6.8c0-.7.5-.9.9-.9h2.2V2.1L14.2 2c-3.5 0-4.3 2.1-4.3 4.1v2.1H7.8v4.2h2.1V22h4.3v-9.6h2.9l.5-4.2h-3.4Z" /></svg>}
                {label === 'WhatsApp' && <MessageCircle className="h-3.5 w-3.5" fill="currentColor" />}
                {label === 'X' && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.8-6.3L6.7 22H3.5l7.2-8.3L3 2h6.3l4.4 5.8L18.9 2Zm-1.1 17.9h1.7L8.4 4H6.6l11.2 15.9Z" /></svg>}
                {label}
              </a>
            ))}
            <button type="button" onClick={() => setSaved((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground">
              {saved ? 'Saved' : 'Save Story'}
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground">
              Printer
            </button>
            <button type="button" onClick={copyUrl} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground">
              {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>

          {/* Main Photo Card with Prev/Next Overlay */}
          <div className="group relative aspect-[16/10] bg-muted/40 w-full overflow-hidden rounded-xl mb-6 shadow-sm border border-border">
            <Image 
              src={photo.src} 
              alt={photo.alt} 
              fill 
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover" 
              priority
            />
            
            {/* Prev / Next buttons inside image bounds */}
            <button 
              type="button" 
              onClick={handlePrev} 
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white hover:bg-accent transition opacity-0 group-hover:opacity-100 duration-200"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              type="button" 
              onClick={handleNext} 
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white hover:bg-accent transition opacity-0 group-hover:opacity-100 duration-200"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Descriptions */}
          <div className="space-y-5 text-sm font-semibold leading-relaxed text-muted-foreground/90 border-b border-border pb-6">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Other Photos thumbnails inside main column */}
          <div className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground mb-4 border-b border-border pb-2">
              {getLocalized(language, { en: 'Browse Photo Gallery', gu: 'ફોટો ગેલેરી બ્રાઉઝ કરો', hi: 'फोटो गैलरी ब्राउज़ करें' })}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PHOTOS.filter((item) => item.id !== photo.id).map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={`/photos/${item.id}`}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted transition duration-200 hover:-translate-y-0.5 hover:border-accent"
                  >
                    <Image 
                      src={item.src} 
                      alt={item.alt} 
                      fill 
                      sizes="150px"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div 
                      className="absolute inset-0 bg-black/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center p-2 text-center"
                      title={getLocalized(language, { en: item.caption, gu: item.captionGu, hi: item.captionHi })}
                    >
                      <span className="text-[10px] sm:text-xs font-black text-white leading-snug line-clamp-3">
                        {getLocalized(language, { en: item.caption, gu: item.captionGu, hi: item.captionHi })}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </article>

        {/* Right Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-40 lg:self-start">
          
          {/* Simulated Advertisement */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-[8px] uppercase px-2 py-0.5 rounded-bl">
              Ad
            </div>
            <div className="flex items-center gap-1.5 text-accent text-[9px] font-black uppercase tracking-widest mb-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Gujarat Post
            </div>
            <h5 className="text-xs font-black text-foreground mb-1 leading-snug">
              Business Advertisement
            </h5>
            <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed mb-3">
              Reach lakhs of daily readers across Gujarat. Feature your businesses on our News Portal & Facebook Page.
            </p>
            
            <div className="space-y-1.5 border-t border-border pt-3">
              <a href="tel:+919909907227" className="flex items-center gap-2 text-[10px] font-bold text-foreground hover:text-accent transition">
                <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                +91 99099 07227
              </a>
              <a href="mailto:info@gujaratpost.in" className="flex items-center gap-2 text-[10px] font-bold text-foreground hover:text-accent transition">
                <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                info@gujaratpost.in
              </a>
              <a href="https://gujaratpost.in" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-foreground hover:text-accent transition">
                <Globe className="h-3.5 w-3.5 text-accent shrink-0" />
                www.gujaratpost.in
              </a>
            </div>

            <a 
              href="mailto:info@gujaratpost.in" 
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent text-white px-3 py-2 text-xs font-black hover:bg-accent/90 transition shadow-sm"
            >
              Advertise Now
            </a>
          </div>

          {/* Trending Stories */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="bg-accent px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white">
              {getLocalized(language, { en: 'Trending Stories', gu: 'ટ્રેન્ડિંગ સ્ટોરીઝ', hi: 'ट्रेंडિંગ स्टोरीज' })}
            </div>
            <div className="p-3 divide-y divide-border/60">
              {trending.map((item, index) => (
                <div key={item.id} className="flex gap-2 py-2 first:pt-0 last:pb-0">
                  <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-black text-muted-foreground">{index + 1}</span>
                  <NewsCard article={item} variant="compact" />
                </div>
              ))}
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}
