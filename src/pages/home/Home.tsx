import InspirationalQuote from "../../components/InspirationalQuote.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import Widget from "../../components/Widget.tsx";
import {supabase} from "../../utils/supabaseClient.ts";
import AttributeLabel from "../../components/AttributeLabel.tsx";
import {twMerge} from "tailwind-merge";
import {Download, Send} from 'lucide-react';
import {SiCalendly} from "@icons-pack/react-simple-icons";

interface InviteForm {
	name: string,
	email: string,
	phone?: string
	message: string
	signup: boolean,
	token?: string,
}

// TODO: Add header
// TODO: Add transitions

type SectionMap = Record<string, Section>;

interface Section {
	id: string
	content: string,
	attributes: Attribute[]
}

interface Attribute {
	id: string
	name: string,
}

type ProjectMap = Record<string, Project>;

interface Project {
	id: string
	title: string,
	link: string,
	thumbnail_path?: string,
	description?: string,
	color?: string
}

interface Role {
	id: string,
	title: string,
	company: string,
	year_start: number,
	year_end?: number,
	accomplishments: string[]
}

const LOADING_MESSAGE = 'Loading...';
const SECTION_KEYS = {
	DESIGN: "design",
	ENGINEERING: "engineering",
	ABOUT_ME: "about me",
	DESIGN_MINDED_SOFTWARE_ENGINEER: "design-minded software engineer",
	ARTIFICIAL_INTELLIGENCE: "artificial intelligence",
	DATABASES: "databases",
	DISTRIBUTED_SYSTEMS: "distributed systems",
	CLOUD: "cloud",
	ARCHITECTURE: "architecture",
	QUALITY_ASSURANCE: "quality assurance",
	CONTINUOUS_IMPROVEMENT: "continuous improvement",
	LEAN_PROCESSES: "lean processes",
	ENVIRONMENT: "environment",
	PLANNED_OBSOLESCENCE: "planned obsolescence",
	AFFORDABLE_HOUSING: "affordable housing",
	BACKEND: "backend",
	FRONTEND: "frontend",
} as const;

const translations = [
	{
		lang: "en",
		heading: "hello",
		placeholder: "Have a question?",
		comingSoon: "Coming soon! Check back in the near future :)"
	},
	{
		lang: "es",
		heading: "hola",
		placeholder: "¿Tienes una pregunta?",
		comingSoon: "¡Próximamente! Vuelve a consultar en un futuro cercano :)"
	},
	{
		lang: "fr",
		heading: "bonjour",
		placeholder: "Une question ?",
		comingSoon: "Bientôt disponible ! Revenez dans un futur proche :)"
	},
	{
		lang: "de",
		heading: "hallo",
		placeholder: "Hast du eine Frage?",
		comingSoon: "Kommt bald! Schau in naher Zukunft wieder vorbei :)"
	},
	{
		lang: "it",
		heading: "ciao",
		placeholder: "Hai una domanda?",
		comingSoon: "In arrivo! Ricontrolla nel prossimo futuro :)"
	},
	{lang: "pt", heading: "olá", placeholder: "Tem uma pergunta?", comingSoon: "Em breve! Volte a verificar em breve :)"},
	{lang: "zh", heading: "你好", placeholder: "有问题吗？", comingSoon: "即将推出！请在不久的将来再查看 :)"},
	{
		lang: "ja",
		heading: "こんにちは",
		placeholder: "質問はありますか？",
		comingSoon: "近日公開！近いうちにまたチェックしてください :)"
	},
	{lang: "ko", heading: "안녕하세요", placeholder: "질문이 있나요?", comingSoon: "곧 제공됩니다! 가까운 미래에 다시 확인해 주세요 :)"},
	{
		lang: "ar",
		heading: "مرحبًا",
		placeholder: "هل لديك سؤال؟",
		comingSoon: "قريباً! تحقق مرة أخرى في المستقبل القريب :)"
	},
	{
		lang: "hi",
		heading: "नमस्ते",
		placeholder: "कोई सवाल है?",
		comingSoon: "जल्द आ रहा है! निकट भविष्य में दोबारा देखें :)"
	},
	{
		lang: "bn",
		heading: "হ্যালো",
		placeholder: "কোনো প্রশ্ন আছে?",
		comingSoon: "শীঘ্রই আসছে! নিকট ভবিষ্যতে আবার চেক করুন :)"
	},
	{
		lang: "ur",
		heading: "ہیلو",
		placeholder: "کوئی سوال ہے؟",
		comingSoon: "جلد آ رہا ہے! قریب مستقبل میں دوبارہ چیک کریں :)"
	},
	{
		lang: "fa",
		heading: "سلام",
		placeholder: "سوالی دارید؟",
		comingSoon: "به زودی! در آینده نزدیک دوباره بررسی کنید :)"
	},
	{
		lang: "ru",
		heading: "привет",
		placeholder: "Есть вопрос?",
		comingSoon: "Скоро выйдет! Загляните в ближайшем будущем :)"
	},
	{
		lang: "uk",
		heading: "привіт",
		placeholder: "Є питання?",
		comingSoon: "Незабаром! Перевірте ще раз найближчим часом :)"
	},
	{
		lang: "tr",
		heading: "merhaba",
		placeholder: "Bir sorunuz mu var?",
		comingSoon: "Çok yakında! Yakın gelecekte tekrar kontrol edin :)"
	},
	{
		lang: "th",
		heading: "สวัสดี",
		placeholder: "มีคำถามไหม?",
		comingSoon: "เร็วๆ นี้! โปรดกลับมาตรวจสอบอีกครั้งในอนาคตอันใกล้ :)"
	},
	{
		lang: "vi",
		heading: "xin chào",
		placeholder: "Bạn có câu hỏi không?",
		comingSoon: "Sắp ra mắt! Vui lòng kiểm tra lại trong tương lai gần :)"
	},
	{
		lang: "id",
		heading: "halo",
		placeholder: "Ada pertanyaan?",
		comingSoon: "Segera hadir! Periksa kembali di masa mendatang :)"
	},
	{
		lang: "ms",
		heading: "hai",
		placeholder: "Ada soalan?",
		comingSoon: "Akan datang! Semak semula dalam masa terdekat :)"
	},
	{
		lang: "nl",
		heading: "hallo",
		placeholder: "Heb je een vraag?",
		comingSoon: "Binnenkort beschikbaar! Kom binnenkort terug :)"
	},
	{
		lang: "sv",
		heading: "hej",
		placeholder: "Har du en fråga?",
		comingSoon: "Kommer snart! Kolla igen inom en snar framtid :)"
	},
	{
		lang: "no",
		heading: "hei",
		placeholder: "Har du et spørsmål?",
		comingSoon: "Kommer snart! Sjekk igjen i nær fremtid :)"
	},
	{
		lang: "da",
		heading: "hej",
		placeholder: "Har du et spørgsmål?",
		comingSoon: "Kommer snart! Tjek igen i den nærmeste fremtid :)"
	},
	{
		lang: "fi",
		heading: "hei",
		placeholder: "Onko kysyttävää?",
		comingSoon: "Tulossa pian! Tarkista uudelleen lähitulevaisuudessa :)"
	},
	{
		lang: "pl",
		heading: "cześć",
		placeholder: "Masz pytanie?",
		comingSoon: "Wkrótce dostępne! Sprawdź ponownie w niedalekiej przyszłości :)"
	},
	{
		lang: "cs",
		heading: "ahoj",
		placeholder: "Máš otázku?",
		comingSoon: "Již brzy! Podívej se znovu v blízké budoucnosti :)"
	},
	{
		lang: "sk",
		heading: "ahoj",
		placeholder: "Máš otázku?",
		comingSoon: "Už čoskoro! Skontrolujte znova v blízkej budúcnosti :)"
	},
	{
		lang: "sl",
		heading: "živjo",
		placeholder: "Imate vprašanje?",
		comingSoon: "Kmalu na voljo! Preverite znova v bližnji prihodnosti :)"
	},
	{
		lang: "ro",
		heading: "salut",
		placeholder: "Ai o întrebare?",
		comingSoon: "În curând! Verifică din nou în viitorul apropiat :)"
	},
	{
		lang: "el",
		heading: "γεια",
		placeholder: "Έχεις ερώτηση;",
		comingSoon: "Σύντομα διαθέσιμο! Έλεγξε ξανά στο άμεσο μέλλον :)"
	},
	{
		lang: "sr",
		heading: "здраво",
		placeholder: "Имате питање?",
		comingSoon: "Ускоро! Проверите поново у блиској будућности :)"
	},
	{
		lang: "hr",
		heading: "bok",
		placeholder: "Imate pitanje?",
		comingSoon: "Uskoro! Provjerite ponovo u skoroj budućnosti :)"
	},
	{
		lang: "bs",
		heading: "zdravo",
		placeholder: "Imate li pitanje?",
		comingSoon: "Uskoro! Provjerite ponovo u bliskoj budućnosti :)"
	},
	{
		lang: "mk",
		heading: "здраво",
		placeholder: "Имате прашање?",
		comingSoon: "Наскоро! Проверете повторно во блиска иднина :)"
	},
	{
		lang: "bg",
		heading: "здравей",
		placeholder: "Имате въпрос?",
		comingSoon: "Скоро! Проверете отново в близко бъдеще :)"
	},
	{
		lang: "lt",
		heading: "labas",
		placeholder: "Turite klausimą?",
		comingSoon: "Netrukus! Patikrinkite dar kartą artimiausiu metu :)"
	},
	{
		lang: "lv",
		heading: "sveiki",
		placeholder: "Vai jums ir jautājums?",
		comingSoon: "Drīzumā! Pārbaudiet vēlreiz tuvākajā nākotnē :)"
	},
	{
		lang: "et",
		heading: "tere",
		placeholder: "Kas teil on küsimus?",
		comingSoon: "Varsti saadaval! Kontrollige uuesti lähitulevikus :)"
	},
	{
		lang: "ka",
		heading: "გამარჯობა",
		placeholder: "გაქვთ კითხვა?",
		comingSoon: "მალე გამოვა! შეამოწმეთ ახლო მომავალში :)"
	},
	{
		lang: "hy",
		heading: "բարեւ",
		placeholder: "Հարց ունե՞ք:",
		comingSoon: "Շուտով հասանելի կլինի! Ստուգեք կրկին մոտ ապագայում :)"
	},
	{
		lang: "sq",
		heading: "përshëndetje",
		placeholder: "Keni ndonjë pyetje?",
		comingSoon: "Së shpejti! Kontrolloni përsëri në të ardhmen e afërt :)"
	},
	{lang: "am", heading: "ሰላም", placeholder: "ጥያቄ አለ?", comingSoon: "በቅርቡ! በቅርቡ ደግሞ ይመልከቱ :)"},
	{
		lang: "sw",
		heading: "hujambo",
		placeholder: "Una swali?",
		comingSoon: "Inakuja hivi karibuni! Angalia tena katika siku zijazo :)"
	},
	{
		lang: "so",
		heading: "salaan",
		placeholder: "Su'aal ma qabtaa?",
		comingSoon: "Waxaa soo socda dhowaan! Dib u hubi mustaqbalka dhow :)"
	},
	{
		lang: "ta",
		heading: "வணக்கம்",
		placeholder: "ஏதாவது கேள்வியா?",
		comingSoon: "விரைவில் வருகிறது! அருகிலுள்ள காலத்தில் மீண்டும் சரிபார்க்கவும் :)"
	},
	{
		lang: "te",
		heading: "హలో",
		placeholder: "ఏదైన ప్రశ్న ఉందా?",
		comingSoon: "త్వరలో రాబోతోంది! సమీప భవిష్యత్తులో మళ్లీ చూడండి :)"
	},
	{
		lang: "kn",
		heading: "ನಮಸ್ಕಾರ",
		placeholder: "ಯಾವುದೇ ಪ್ರಶ್ನೆಯಿದೆಯೆ?",
		comingSoon: "ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತದೆ! ಸಮೀಪದ ಭವಿಷ್ಯದಲ್ಲಿ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ :)"
	},
	{
		lang: "ml",
		heading: "നമസ്കാരം",
		placeholder: "ചോദ്യം ഉണ്ടോ?",
		comingSoon: "വേഗത്തിൽ വരുന്നു! അടുത്ത കാലത്ത് വീണ്ടും പരിശോധിക്കുക :)"
	},
	{
		lang: "mr",
		heading: "नमस्कार",
		placeholder: "काही प्रश्न आहे का?",
		comingSoon: "लवकरच येत आहे! निकट भविष्यात पुन्हा तपासा :)"
	},
	{
		lang: "gu",
		heading: "નમસ્તે",
		placeholder: "કોઈ પ્રશ્ન છે?",
		comingSoon: "જલદી જ આવી રહ્યું છે! નજીકના ભવિષ્યમાં ફરી તપાસો :)"
	},
	{
		lang: "pa",
		heading: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
		placeholder: "ਕੀ ਕੋਈ ਸਵਾਲ ਹੈ?",
		comingSoon: "ਜਲਦੀ ਹੀ ਆ ਰਿਹਾ ਹੈ! ਨੇੜਲੇ ਭਵਿੱਖ ਵਿੱਚ ਦੁਬਾਰਾ ਜਾਂਚ ਕਰੋ :)"
	},
	{
		lang: "kk",
		heading: "сәлем",
		placeholder: "Сұрағыңыз бар ма?",
		comingSoon: "Жақында! Жақын арада қайта тексеріңіз :)"
	},
	{
		lang: "mn",
		heading: "сайн байна уу",
		placeholder: "Таньд асуулт байна уу?",
		comingSoon: "Тун удахгүй! Ойрын үед дахин шалгаарай :)"
	},
	{
		lang: "my",
		heading: "မင်္ဂလာပါ",
		placeholder: "မေးစရာရှိပါသလား?",
		comingSoon: "မကြာမီ လာမယ်! မကြာမီနောက်တဖန် စစ်ဆေးပါ :)"
	},
	{
		lang: "tl",
		heading: "kumusta",
		placeholder: "May tanong ka ba?",
		comingSoon: "Malapit na! Suriin muli sa malapit na hinaharap :)"
	},
	{
		lang: "ca",
		heading: "hola",
		placeholder: "Tens alguna pregunta?",
		comingSoon: "Pròximament! Torna a consultar en un futur proper :)"
	},
	{
		lang: "is",
		heading: "halló",
		placeholder: "Ertu með spurningu?",
		comingSoon: "Kemur fljótlega! Athugaðu aftur í náinni framtíð :)"
	}
];

const WidgetSectionAttributes = ({collection}: { collection: Attribute[] }) => {
	if (!collection) {
		return <p>{LOADING_MESSAGE}</p>
	} else if (collection.length == 0) {
		return;
	}

	return (
		<div className={'flex flex-wrap gap-2'}>
			{collection.map(attribute => (<AttributeLabel key={attribute.id}>{attribute.name}</AttributeLabel>))}
		</div>
	)
}
const WidgetSectionContent = (props: { sections: SectionMap, sectionTitle: string }) => (
	<p className={"md:text-lg"}>{props.sections[props.sectionTitle]?.content ?? LOADING_MESSAGE}</p>
);

const ComingSoon = ({className}: { className?: string }) => (
	<div
		className={twMerge("max-sm:text-sm bg-cyan-500 text-gray-100 py-5 px-10 max-sm:py-4 max-sm:px-6 md:pr-20 rounded-md inline-block", className)}>
		<p>Coming soon! Check back in the near future :)</p>
	</div>
);
const ImageComingSoon = ({className}: { className?: string }) => (
	<div
		className={twMerge("max-sm:text-sm bg-cyan-500 text-gray-100 py-5 px-10  max-sm:py-4 max-sm:px-6 md:pr-20 m-10 rounded-md inline-block", className)}>
		<p>Image coming soon! Check back in the near future :)</p>
	</div>
);


const Hero = ({sections}: { sections: SectionMap }) => (
	<div className={"min-h-[100svh] flex flex-col p-14 max-sm:p-10 space-y-14 max-sm:space-y-12 snap-start"}>
		<div className={"flex justify-between flex-wrap space-y-12 max-sm:space-y-8"}>
			<div
				className={"font-poppins font-medium text-4xl max-sm:text-3xl text-gray-400 [&_a]:hover:text-gray-300 [&_a]:transition-colors space-y-5 max-sm:space-y-4 lg:basis-[calc((100%-18rem)/2)]  xl:basis-[calc((100%-24rem)/2)] max-md:basis-full"}>
				<p className={"text-cyan-500 text-4xl max-sm:text-3xl mb-10 max-sm:mb-8"}>Chris <span
					className={"ml-2 bg-cyan-200 size-2.5 rounded-[50%] inline-block"}></span></p>
				<p><a href={'https://blog.chriscentrella.com'} target={'_blank'}>blog</a></p>
				<p><a href={'#resume'}>resume</a></p>
				<p><a href={'#human-rights'}>human rights</a></p>
				<p><a href={'#invite-chris'}>invite Chris</a></p>
			</div>
			<img
				className={"animate-imgFloat object-cover opacity-95 hover:opacity-100 transition-colors my-0 max-md:mx-auto w-60 h-64  sm:w-72 sm:h-80  xl:w-96 xl:h-[26rem]  rounded-[55%_45%_55%_45%]"}
				src={"/images/profile.jpeg"} alt={"Chris in hoodie, relaxed"}/>
			<div className={"basis-full lg:basis-[calc((100%-18rem)/2)]  xl:basis-[calc((100%-24rem)/2)]"}></div>
		</div>
		<div
			className={"grow flex justify-center flex-wrap gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full"}>
			<Widget heading={'design'} className={'bg-[#62EAFF6B]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DESIGN}/>
			</Widget>
			<Widget heading={'engineering'} className={'bg-[#9494946B]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ENGINEERING}/>
			</Widget>
		</div>
	</div>
);


const AboutMe = ({sections}: { sections: SectionMap }) => (
	<div className={"min-h-[100lvh] py-[8rem] max-sm:py-[6rem] snap-start"}>
		<div className={"flex max-md:flex-wrap px-14 max-sm:px-10 gap-12 max-sm:gap-10 max-xl:*:basis-1/2"}>
			<Widget heading={'about me'} className={'grow'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ABOUT_ME}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.ABOUT_ME]?.attributes}/>
				<ComingSoon/>
			</Widget>
			<img
				className={`xl:basis-[calc(100%-100%/1.61803398875-1.5rem)] transition-colors opacity-95 hover:opacity-100 object-cover rounded-xl min-w-0 max-md:grow max-sm:flex-[100%]`}
				src={"/images/stroll.jpeg"} alt={"Chris walking while carrying iPad"}/>
		</div>
		<Widget heading={'looking for a design-minded software engineer?'}
						className={'m-14 max-sm:m-10 bg-[#62EAFF6B]'}>
			<div className={'max-w-[48rem] space-y-6 *:space-y-2'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DESIGN_MINDED_SOFTWARE_ENGINEER}/>
				<div>
					<p className={'uppercase max-sm:text-sm'}>Design</p>
					<WidgetSectionAttributes collection={sections[SECTION_KEYS.DESIGN]?.attributes}/>
				</div>
				<div>
					<p className={'uppercase max-sm:text-sm'}>Frontend</p>
					<WidgetSectionAttributes collection={sections[SECTION_KEYS.FRONTEND]?.attributes}/>
				</div>
				<div>
					<p className={'uppercase max-sm:text-sm'}>Backend</p>
					<WidgetSectionAttributes collection={sections[SECTION_KEYS.BACKEND]?.attributes}/>
				</div>
			</div>
		</Widget>
	</div>
);
const AIWidget = () => {
	const sectionRef = useRef(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const current = useRef(0);
	const [heading, setHeading] = useState('hello');
	const [placeholder, setPlaceholder] = useState('Have a question?');
	const [comingSoon, setComingSoon] = useState('Coming soon! Check back in the near future :)');

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				let elementInView = false;
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						elementInView = true;
					}
				})
				setIsAnimating(elementInView);
			}
		)
		observer.observe(sectionRef.current!)

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isAnimating) {
			return;
		}

		const updateText = () => {
			current.current = (current.current + 1) % translations.length;
			setHeading(translations[current.current].heading);
			setPlaceholder(translations[current.current].placeholder);
			setComingSoon(translations[current.current].comingSoon)
		}

		const timer = setInterval(updateText, 2500);

		return () => clearInterval(timer);
	}, [isAnimating]);

	return (
		<div ref={sectionRef} id={'chatbot'}
				 className={'min-h-[100lvh] bg-[#3C9FBA] flex justify-center items-center snap-start'}>
			<div className={'text-center space-y-10 grow'}>
				<p className={'font-bumbbled text-8xl max-sm:text-6xl text-[#85D7E0]'}>{heading}</p>
				<input placeholder={placeholder}
							 className={'py-5 px-12 bg-[#FFFFFF7F] placeholder-gray-500 text-xl max-sm:text-lg rounded-lg w-4/5'}
							 type={'text'}/>
				<div className={'inline-block w-4/5'}>
					<div className={twMerge("max-sm:text-sm bg-cyan-500 text-gray-100 py-5 px-10 max-sm:py-4" +
						" max-sm:px-6 md:pr-20 rounded-md inline-block", "block md:w-max text-left")}>
						<p>{comingSoon}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
const CreativelyIntelligent = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10 snap-start'}>
		<p className={'text-4xl max-sm:text-3xl'}>creatively intelligent.</p>
		<Widget heading={'artificial intelligence'} className={'md:w-1/2 bg-[#FCFCFC1A]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ARTIFICIAL_INTELLIGENCE}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.ARTIFICIAL_INTELLIGENCE]?.attributes}/>
		</Widget>
	</div>
);
const DataIsBeautiful = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10 snap-start'}>
		<p className={'text-4xl max-sm:text-3xl'}>data is beautiful.</p>
		<Widget heading={'databases'} className={'md:w-1/2 bg-[#FCFCFC1A]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DATABASES}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.DATABASES]?.attributes}/>
		</Widget>
	</div>
);
const SystemDesign = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 max-sm:pt-12 snap-start'}>
		<p className={'text-4xl max-sm:text-3xl mb-14 max-sm:mb-10 text-center'}>millions of users. one system.</p>
		<div
			className={'flex flex-wrap px-14 max-sm:px-10 gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
			<Widget heading={'distributed systems'} className={'bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DISTRIBUTED_SYSTEMS}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.DISTRIBUTED_SYSTEMS]?.attributes}/>
			</Widget>
			<Widget heading={'cloud'} className={'bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.CLOUD}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.CLOUD]?.attributes}/>
			</Widget>
		</div>
	</div>
)
const BuiltToScale = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10 snap-start'}>
		<p className={'text-4xl max-sm:text-3xl'}>built to scale.</p>
		<div className={'flex flex-wrap gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
			<Widget heading={'architecture'} className={'md:w-1/2 bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ARCHITECTURE}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.ARCHITECTURE]?.attributes}/>
				<ComingSoon/>
			</Widget>
			<Widget heading={'quality assurance'} className={'md:w-1/2 bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.QUALITY_ASSURANCE}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.QUALITY_ASSURANCE]?.attributes}/>
			</Widget>
		</div>
	</div>
);
const AboutSection = (props: { sections: SectionMap }) => (
	<>
		<InspirationalQuote author={"Steve Jobs"}>
			The only way to do great work is to love what you do.
		</InspirationalQuote>
		<AboutMe sections={props.sections}/>
		<AIWidget/>
		<CreativelyIntelligent sections={props.sections}/>
		<InspirationalQuote author={"Steve Jobs"}>
			You can't connect the dots looking forward; you can only connect them looking backwards.
		</InspirationalQuote>
		<DataIsBeautiful sections={props.sections}/>
		<img src={"/images/pattern_background.png"} alt={"systems illustration"}
				 className={"w-full h-[100lvh] object-cover snap-start"}/>
		<ImageComingSoon/>
		<SystemDesign sections={props.sections}/>
		<InspirationalQuote author={"Steve Jobs"}>
			Design is not just what it looks like and feels like. Design is how it works.
		</InspirationalQuote>
		<BuiltToScale sections={props.sections}/>
	</>
);

const ImproveContinuously = ({sections}: { sections: SectionMap }) => (
	<div
		className={'min-h-[100lvh] bg-white flex flex-wrap px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)]' +
			' *:max-md:basis-full snap-start'}>
		<div className={'flex justify-center'}>
			<p className={'text-4xl max-sm:text-3xl text-black self-center leading-snug'}>improve.<br/>continuously.</p>
		</div>
		<Widget heading={'continuous improvement'} className={'bg-[#16748C]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.CONTINUOUS_IMPROVEMENT}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.CONTINUOUS_IMPROVEMENT]?.attributes}/>
			<ComingSoon/>
		</Widget>
	</div>
)
const LeanProcesses = ({sections}: { sections: SectionMap }) => (
	<div
		className={'snap-start min-h-[100lvh] flex flex-wrap px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
		<div className={'flex justify-center '}>
			<p className={'text-4xl max-sm:text-3xl self-center leading-snug'}>simple. lean.<br/>forever.</p>
		</div>
		<Widget heading={'lean processes'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.LEAN_PROCESSES}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.LEAN_PROCESSES]?.attributes}/>
			<ComingSoon/>
		</Widget>
	</div>
)
const GuidingPrinciplesSection = (props: { sections: SectionMap }) => (
	<>
		<img src={"/images/pattern_background.png"} alt={"processes illustration"}
				 className={"w-full h-[100lvh] object-cover snap-start"}/>
		<ImageComingSoon/>
		<p className={"text-5xl max-sm:text-4xl text-center py-32 max-sm:py-24 snap-start"}>principles for life.</p>
		<ImproveContinuously sections={props.sections}/>
		<LeanProcesses sections={props.sections}/>
		<InspirationalQuote author={"Steve Jobs"} className={"text-white bg-black"}>
			Your time is limited, so don't waste it living someone else's life.
		</InspirationalQuote>
	</>
);

const Roles = ({roles}: { roles: Role[] }) => (
	<div className={'space-y-10 max-sm:space-y-8'}>
		{roles.map(role => (
			<Widget key={role.id} heading={`${role.title} at ${role.company}`}
							className={'max-w-[60rem] space-y-5 max-sm:space-y-4'}>
				<p className={'max-sm:text-sm text-gray-400'}>{role.year_start} - {role.year_end}</p>
				<p className={'max-sm:text-sm uppercase text-gray-400'}>Accomplishments:</p>
				<div className={'space-y-2'}>
					{role.accomplishments?.map(accomplishment => (<p key={accomplishment}>{accomplishment}</p>))}
				</div>

			</Widget>
		))}
	</div>
)

const Projects = ({projects}: { projects: ProjectMap }) => (
	<div
		className={'flex flex-wrap m-auto justify-center gap-12 xl:gap-x-24 max-sm:gap-8 *:basis-[calc(50%-3rem)] *:max-md:basis-full max-w-[75rem]'}>
		{
			Object.values(projects).map(project => (
				<a key={project.id} href={project.link} target={'_blank'} rel={'noopener'}>
					<Widget
						className={'bg-[#FCFCFC1A] h-full cursor-pointer opacity-100 hover:bg-[#FCFCFC1F]'}
						heading={project.title}>
						{project.description}
					</Widget>
				</a>
			))
		}
	</div>
);

const WorkExperienceSection = (props: { projects: ProjectMap, roles: Role[] }) => (
	<div id={'resume'} className={'pt-32 max-sm:pt-24 px-14 max-sm:px-10 snap-start'}>
		<div className={'min-h-[100lvh]'}>
			<div className={'flex flex-wrap max-sm:justify-center gap-6 items-center mb-10 justify-between max-w-[60rem]'}>
				<p className={'text-4xl max-sm:text-3xl'}>
					what's in a timeline?</p>
				<p className={'max-sm:w-full'}><a className={'px-10 py-5 bg-cyan-500 hover:bg-cyan-600 rounded block'}
																					href={'/resume_christopher_centrella.pdf'} target={'_blank'}><Download
					className={'inline mr-4 mt-[-.15rem]'}/> Download Resume</a></p>
			</div>
			<Roles roles={props.roles}/>
		</div>
		<p className={'text-4xl max-sm:text-3xl text-center mt-24 mb-14 snap-start'}>...and so much more</p>
		<Projects projects={props.projects}/>
	</div>
)

const Environment = ({sections}: { sections: SectionMap }) => (
	<div
		className={'min-h-[100lvh] bg-[#91A38B] px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 flex flex-wrap snap-start'}>
		<Widget heading={'environment'} className={'grow bg-[#133F06]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ENVIRONMENT}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.ENVIRONMENT]?.attributes}/>
			<ComingSoon className={'bg-green-200 text-gray-600'}/>
		</Widget>
		<Widget heading={'planned obsolescence'}
						className={'basis-[calc(100%-100%/1.61803398875-5rem)] max-lg:basis-[calc(50%-1.5rem)] ' +
							'max-md:basis-full bg-[#133F0659]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.PLANNED_OBSOLESCENCE}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.PLANNED_OBSOLESCENCE]?.attributes}/>
			<ComingSoon className={'bg-green-200 text-gray-600'}/>
		</Widget>
	</div>
)
const Housing = ({sections}: { sections: SectionMap }) => (
	<div
		className={'min-h-[100lvh] bg-white px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 flex flex-wrap snap-start'}>
		<div
			className={'flex justify-center basis-[calc(100%-100%/1.61803398875-5rem)] max-lg:basis-[calc(50%-1.5rem)] ' +
				'max-md:basis-full'}>
			<p className={'text-4xl max-sm:text-3xl text-black self-center leading-snug'}>housing is a<br/>human right</p>
		</div>
		<Widget heading={'affordable housing'} className={'grow bg-[#746D40]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.AFFORDABLE_HOUSING}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.AFFORDABLE_HOUSING]?.attributes}/>
			<ComingSoon className={'bg-yellow-100 text-gray-600'}/>
		</Widget>
	</div>
)
const Palestine = () => (
	<div className={'min-h-[100lvh] bg-[#4A4A4A] gap-12 max-sm:gap-10 flex flex-wrap snap-start'}>
		<img
			className={'w-[calc(100%/1.61803398875-3rem)] max-md:basis-full object-cover grow'}
			src={'/images/pattern_background.png'}
			alt={'picture of people in Palestine'}/>
		<div className={'grow flex justify-center m-12'}>
			<div className={'self-center space-y-5'}>
				<p className={'text-4xl max-sm:text-3xl leading-snug'}>every person<br/>deserves dignity</p>
				<p className={'text-xl'}>statement on Palestine</p>
				<ComingSoon className={'bg-black mt-3 md:pr-10'}/>
			</div>
		</div>
	</div>
)
const HumanRightsSection = (props: { sections: SectionMap }) => (
	<>
		<p id={"human-rights"} className={"text-5xl max-sm:text-4xl text-center py-32 max-sm:py-24 snap-start"}>human
			rights</p>
		<InspirationalQuote author={"Steve Jobs"}>
			The people who are crazy enough to think they can change the world, are the ones who do.
		</InspirationalQuote>
		<Environment sections={props.sections}/>
		<Housing sections={props.sections}/>
		<Palestine/>
	</>
);

const InviteChrisSection = () => {

	const [isSuccess, setIsSuccess] = useState<boolean | undefined>();
	const [form, setForm] = useState<InviteForm>({
		email: "",
		message: "",
		name: "",
		phone: "",
		signup: false,
		token: ""
	});

	useEffect(() => {
		const widgetId = window.turnstile.render("#turnstile-container", {
			sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
			callback: (token: string) => setForm(prev => ({...prev, token})),
		});

		return () => window.turnstile.remove(widgetId);
	}, []);

	const updateFormState = useMemo(() => {
		let timer: ReturnType<typeof setTimeout>;

		return (property: string, value: string | boolean) => {
			clearTimeout(timer);
			timer = setTimeout(() => setForm(prev => ({...prev, [property]: value})), 500)
		}
	}, [])

	const sendMessage = async () => {
		const {error} = await supabase.functions.invoke('Invite-Form', {
			body: form
		})
		setIsSuccess(!error);
	}

	return (
		<div id={'invite-chris'}
				 className={'min-h-[100lvh] bg-black text-[#FFFFFFCC] px-14 max-sm:px-10 py-32 max-sm:py-24 space-y-12 text-lg snap-start'}>
			<p className={'text-4xl max-sm:text-3xl'}>invite Chris</p>
			<p className={'uppercase text-base text-[#FFFFFF99] mb-6'}>Schedule Call</p>
			<div className={'flex flex-wrap gap-6'}>
				<p className={'max-sm:w-full'}>
					<a className={'px-10 py-5 bg-cyan-500 hover:bg-cyan-600 rounded block'}
						 href={'https://calendly.com/ccentrella/chat'}
						 target={'_blank'}>
						<SiCalendly className={'inline mr-4 mt-[-.15rem]'}/> Calendly</a>
				</p>
			</div>
			{isSuccess && <div
				className={'max-sm:text-sm bg-green-500 text-gray-100 py-5 px-10  max-sm:py-4 max-sm:px-6 md:pr-20 rounded-md inline-block'}>
				<p>Message sent successfully.</p>
			</div>}
			{isSuccess == false && <div
				className={'max-sm:text-sm bg-red-400 text-gray-100 py-5 px-10  max-sm:py-4 max-sm:px-6 md:pr-20 rounded-md inline-block'}>
				<p>Message unsuccessful. Feel free to schedule a meeting on my Calendly.</p>
			</div>}
			<form onSubmit={e => {
				e.preventDefault();
				sendMessage().then();
			}} className={[
				'space-y-8',
				'[&_input,textarea]:text-black',
				'[&_input,textarea]:py-2.5',
				'[&_input,textarea]:px-5',
				'[&_input:not([type=checkbox]),textarea]:sm:mx-10',
				'[&_input,textarea]:max-sm:mt-2',
				'[&_input,textarea]:max-sm:mb-4',
				'[&_input,textarea]:bg-[#FFFFFFCC]',
				'[&_input,textarea]:invalid:bg-red-100',
				'[&_input,textarea]:placeholder-gray-500',
				'[&_input,textarea]:rounded-md',
				'[&_input:not([type=checkbox]),textarea]:w-full',
				'[&_input,textarea]:max-w-[36rem]',
				'[&_input,textarea]:text-lg',
				'[&_label]:text-base',
				'[&_label]:basis-[6rem]',
				'[&_label]:shrink-0',
			].join(' ')}>
				<div className={'space-y-3'}>
					<p className={'uppercase text-base text-[#FFFFFF99] mb-6'}>Contact Chris</p>
					<div className={'flex max-sm:flex-wrap'}>
						<label>Name*</label>
						<input required name={'name'} type={'text'}
									 onChange={(e) => updateFormState(e.target.name, e.target.value)}/>
					</div>
					<div className={'flex max-sm:flex-wrap'}>
						<label>Email*</label>
						<input required name={'email'} type={'email'}
									 onChange={(e) => updateFormState(e.target.name, e.target.value)}/>
					</div>
					<div className={'flex max-sm:flex-wrap'}>
						<label>Phone</label>
						<input name={'phone'} type={'tel'}
									 onChange={(e) => updateFormState(e.target.name, e.target.value)}/>
					</div>
					<div className={'flex max-sm:flex-wrap'}>
						<label>Message*</label>
						<textarea required name={'message'} className={'h-32'}
											onChange={(e) => updateFormState(e.target.name, e.target.value)}>
						</textarea>
					</div>
					<div className={'mt-6'}>
						<label className="inline-flex items-center gap-6 cursor-pointer">
							<input type="checkbox" className="sr-only peer"/>
							<span className={[
								"flex",
								"items-center",
								"justify-center",
								"w-8",
								"h-8",
								"rounded-[0.1rem]",
								"border",
								"border-gray-400",
								"peer-checked:bg-cyan-500",
								"peer-checked:border-cyan-500",

								"after:content-['']",
								"after:absolute",
								"after:w-[0.5rem]",
								"after:h-[1rem]",
								"after:border-white",
								"after:border-b-3",
								"after:border-r-3",
								"after:rotate-45",
								"after:opacity-0",
								"peer-checked:after:opacity-100",
							].join(" ")}></span>
							Send me helpful tips and updates
						</label>
					</div>
				</div>
				<p>
					<button type={'submit'} className={'px-10 py-5 bg-cyan-500 hover:bg-cyan-600 rounded block max-sm:w-full'}>
						<Send className={'inline mr-4 mt-[-.15rem]'}/> Send Message
					</button>
					<div id="turnstile-container" className={'mt-5'}></div>
				</p>
			</form>
		</div>
	);
}

const Home = () => {

	const [sections, setSections] = useState<SectionMap>({});
	const [projects, setProjects] = useState<ProjectMap>({});
	const [roles, setRoles] = useState<Role[]>([]);

	useEffect(() => {
		const loadData = async () => {

			const [{data: sectionsData}, {data: projectsData}, {data: rolesData}] = await Promise.all([
				supabase.from('sections').select(`
					*,
					attributes (id, name)
					`),
				supabase.from('projects').select('*').order('order'),
				supabase.from('roles').select('*')
			]);

			const sectionMap =
				sectionsData?.reduce<SectionMap>((accumulator, section) => {
					accumulator[section.title] = section;
					return accumulator;
				}, {})

			const projectMap = projectsData?.reduce<ProjectMap>((accumulator, project) => {
				accumulator[project.title] = project;
				return accumulator;
			}, {});

			setSections(sectionMap ?? {});
			setProjects(projectMap ?? {})
			setRoles(rolesData?.sort((a, b) => a.year_start <= b.year_start ? 1 : -1) ?? []);
		}
		loadData().then();
	}, []);

	return (
		<div>
			<Hero sections={sections}/>
			<AboutSection sections={sections}/>
			<GuidingPrinciplesSection sections={sections}/>
			<WorkExperienceSection projects={projects} roles={roles}/>
			<HumanRightsSection sections={sections}/>
			<InviteChrisSection/>
		</div>
	);
};

export default Home;