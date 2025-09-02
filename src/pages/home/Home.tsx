import InspirationalQuote from "../../components/InspirationalQuote.tsx";
import {useEffect, useState} from "react";
import Widget from "../../components/Widget.tsx";
import {supabase} from "../../utils/supabaseClient.ts";
import AttributeLabel from "../../components/AttributeLabel.tsx";
import {twMerge} from "tailwind-merge";

// TODO: Add header
// TODO: Add scroll snap
// TODO: Add transitions

type SectionMap = Record<string, Section>;

interface Section {
	content: string,
	attributes: Attribute[]
}

interface Attribute {
	name: string,
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
	{lang: "en", heading: "hello", placeholder: "Have a question?"},
	{lang: "es", heading: "hola", placeholder: "¿Tienes una pregunta?"},
	{lang: "fr", heading: "bonjour", placeholder: "Une question ?"},
	{lang: "de", heading: "hallo", placeholder: "Hast du eine Frage?"},
	{lang: "it", heading: "ciao", placeholder: "Hai una domanda?"},
	{lang: "pt", heading: "olá", placeholder: "Tem uma pergunta?"},
	{lang: "zh", heading: "你好", placeholder: "有问题吗？"},
	{lang: "ja", heading: "こんにちは", placeholder: "質問はありますか？"},
	{lang: "ko", heading: "안녕하세요", placeholder: "질문이 있나요?"},
	{lang: "ar", heading: "مرحبًا", placeholder: "هل لديك سؤال؟"},
	{lang: "hi", heading: "नमस्ते", placeholder: "कोई सवाल है?"},
	{lang: "bn", heading: "হ্যালো", placeholder: "কোনো প্রশ্ন আছে?"},
	{lang: "ur", heading: "ہیلو", placeholder: "کوئی سوال ہے؟"},
	{lang: "fa", heading: "سلام", placeholder: "سوالی دارید؟"},
	{lang: "ru", heading: "привет", placeholder: "Есть вопрос?"},
	{lang: "uk", heading: "привіт", placeholder: "Є питання?"},
	{lang: "tr", heading: "merhaba", placeholder: "Bir sorunuz mu var?"},
	{lang: "th", heading: "สวัสดี", placeholder: "มีคำถามไหม?"},
	{lang: "vi", heading: "xin chào", placeholder: "Bạn có câu hỏi không?"},
	{lang: "id", heading: "halo", placeholder: "Ada pertanyaan?"},
	{lang: "ms", heading: "hai", placeholder: "Ada soalan?"},
	{lang: "nl", heading: "hallo", placeholder: "Heb je een vraag?"},
	{lang: "sv", heading: "hej", placeholder: "Har du en fråga?"},
	{lang: "no", heading: "hei", placeholder: "Har du et spørsmål?"},
	{lang: "da", heading: "hej", placeholder: "Har du et spørgsmål?"},
	{lang: "fi", heading: "hei", placeholder: "Onko kysyttävää?"},
	{lang: "pl", heading: "cześć", placeholder: "Masz pytanie?"},
	{lang: "cs", heading: "ahoj", placeholder: "Máš otázku?"},
	{lang: "sk", heading: "ahoj", placeholder: "Máš otázku?"},
	{lang: "sl", heading: "živjo", placeholder: "Imate vprašanje?"},
	{lang: "ro", heading: "salut", placeholder: "Ai o întrebare?"},
	{lang: "el", heading: "γεια", placeholder: "Έχεις ερώτηση;"},
	{lang: "sr", heading: "здраво", placeholder: "Имате питање?"},
	{lang: "hr", heading: "bok", placeholder: "Imate pitanje?"},
	{lang: "bs", heading: "zdravo", placeholder: "Imate li pitanje?"},
	{lang: "mk", heading: "здраво", placeholder: "Имате прашање?"},
	{lang: "bg", heading: "здравей", placeholder: "Имате въпрос?"},
	{lang: "lt", heading: "labas", placeholder: "Turite klausimą?"},
	{lang: "lv", heading: "sveiki", placeholder: "Vai jums ir jautājums?"},
	{lang: "et", heading: "tere", placeholder: "Kas teil on küsimus?"},
	{lang: "ka", heading: "გამარჯობა", placeholder: "გაქვთ კითხვა?"},
	{lang: "hy", heading: "բարեւ", placeholder: "Հարց ունե՞ք:"},
	{lang: "sq", heading: "përshëndetje", placeholder: "Keni ndonjë pyetje?"},
	{lang: "am", heading: "ሰላም", placeholder: "ጥያቄ አለ?"},
	{lang: "sw", heading: "hujambo", placeholder: "Una swali?"},
	{lang: "so", heading: "salaan", placeholder: "Su'aal ma qabtaa?"},
	{lang: "ta", heading: "வணக்கம்", placeholder: "ஏதாவது கேள்வியா?"},
	{lang: "te", heading: "హలో", placeholder: "ఏదైన ప్రశ్న ఉందా?"},
	{lang: "kn", heading: "ನಮಸ್ಕಾರ", placeholder: "ಯಾವುದೇ ಪ್ರಶ್ನೆಯಿದೆಯೆ?"},
	{lang: "ml", heading: "നമസ്കാരം", placeholder: "ചോദ്യം ഉണ്ടോ?"},
	{lang: "mr", heading: "नमस्कार", placeholder: "काही प्रश्न आहे का?"},
	{lang: "gu", heading: "નમસ્તે", placeholder: "કોઈ પ્રશ્ન છે?"},
	{lang: "pa", heading: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", placeholder: "ਕੀ ਕੋਈ ਸਵਾਲ ਹੈ?"},
	{lang: "kk", heading: "сәлем", placeholder: "Сұрағыңыз бар ма?"},
	{lang: "mn", heading: "сайн байна уу", placeholder: "Таньд асуулт байна уу?"},
	{lang: "my", heading: "မင်္ဂလာပါ", placeholder: "မေးစရာရှိပါသလား?"},
	{lang: "tl", heading: "kumusta", placeholder: "May tanong ka ba?"},
	{lang: "ca", heading: "hola", placeholder: "Tens alguna pregunta?"},
	{lang: "is", heading: "halló", placeholder: "Ertu með spurningu?"}
];

const WidgetSectionAttributes = ({collection}: { collection: Attribute[] }) => {
	if (!collection) {
		return <p>{LOADING_MESSAGE}</p>
	} else if (collection.length == 0) {
		return;
	}

	return (
		<div className={'flex flex-wrap gap-2'}>
			{collection.map(attribute => (<AttributeLabel>{attribute.name}</AttributeLabel>))}
		</div>
	)
}
const WidgetSectionContent = (props: { sections: SectionMap, sectionTitle: string }) => (
	<p className={"md:text-lg"}>{props.sections[props.sectionTitle]?.content ?? LOADING_MESSAGE}</p>
);

const ComingSoon = ({className}: { className?: string }) => (
	<div
		className={twMerge("max-sm:text-sm bg-cyan-500 text-gray-100 py-5 px-10 md:pr-20 rounded-md inline-block", className)}>
		<p>Coming soon! Check back in the near future :)</p>
	</div>
);
const ImageComingSoon = ({className}: { className?: string }) => (
	<div
		className={twMerge("max-sm:text-sm bg-cyan-500 text-gray-100 py-5 px-10 md:pr-20 m-10 rounded-md inline-block", className)}>
		<p>Image coming soon! Check back in the near future :)</p>
	</div>
);


const Hero = ({sections}: { sections: SectionMap }) => (
	<div className={"min-h-[100dvh] p-14 max-sm:p-10 space-y-14 max-sm:space-y-12"}>
		<div className={"flex justify-between flex-wrap space-y-12 max-sm:space-y-8"}>
			<div
				className={"font-poppins font-medium text-4xl max-sm:text-3xl text-gray-400 [&_a]:hover:text-gray-300 [&_a]:transition-colors space-y-5 max-sm:space-y-4 basis-1/5 max-md:basis-full"}>
				<p className={"text-cyan-500 text-4xl max-sm:text-3xl mb-10 max-sm:mb-8"}>Chris <span
					className={"ml-2 bg-cyan-200 size-2.5 rounded-[50%] inline-block"}></span></p>
				<p><a href={'/resume_christopher_centrella.pdf'} target={'_blank'}>resume</a></p>
				<p><a href={'#human-rights'}>human rights</a></p>
				<p><a href={'#invite-chris'}>invite Chris</a></p>
			</div>
			<img
				className={"animate-imgFloat object-cover opacity-95 hover:opacity-100 transition-colors m-auto w-72 max-sm:w-60 h-80 max-sm:h-64 rounded-[55%_45%_55%_45%]"}
				src={"/images/profile.jpeg"} alt={"Chris in hoodie, relaxed"}/>
			<div className={"basis-1/5 max-md:basis-full"}></div>
		</div>
		<div
			className={"flex justify-center flex-wrap gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full"}>
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
	<div className={"min-h-[100dvh] py-[8rem] max-sm:py-[6rem]"}>
		<div className={"flex flex-wrap px-14 max-sm:px-10 gap-12 max-sm:gap-10"}>
			<Widget heading={'about me'} className={'grow max-w-[48rem]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ABOUT_ME}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.ABOUT_ME]?.attributes}/>
				<ComingSoon/>
			</Widget>
			<img
				className={`basis-[calc(100%-100%/1.61803398875-5rem)] transition-colors opacity-95 hover:opacity-100 object-cover rounded-xl min-w-0 max-md:grow max-sm:flex-[100%]`}
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

	const [current, setCurrent] = useState(0);
	const [heading, setHeading] = useState('hello');
	const [placeholder, setPlaceholder] = useState('Have a question?');

	useEffect(() => {
		const updateText = () => {
			const next = (current + 1) % translations.length;

			setCurrent(next);
			setHeading(translations[next].heading);
			setPlaceholder(translations[next].placeholder);
		}

		const timer = setInterval(updateText, 2500);

		return () => clearInterval(timer);
	}, [current]);

	return (
		<div className={'min-h-[100dvh] bg-[#3C9FBA] flex justify-center items-center'}>
			<div className={'text-center space-y-10 grow'}>
				<p className={'font-bumbbled text-8xl max-sm:text-6xl text-[#85D7E0]'}>{heading}</p>
				<input placeholder={placeholder}
							 className={'py-5 px-12 bg-[#FFFFFF7F] placeholder-gray-500 text-xl max-sm:text-lg rounded-lg w-4/5'}
							 type={'text'}/>
				<div className={'inline-block w-4/5'}>
					<ComingSoon className={'block md:w-max text-left'}/>
				</div>
			</div>
		</div>
	);
};
const CreativelyIntelligent = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10'}>
		<p className={'text-4xl max-sm:text-3xl'}>creatively intelligent.</p>
		<Widget heading={'artificial intelligence'} className={'md:w-1/2 bg-[#FCFCFC1A]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ARTIFICIAL_INTELLIGENCE}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.ARTIFICIAL_INTELLIGENCE]?.attributes}/>
		</Widget>
	</div>
);
const DataIsBeautiful = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10'}>
		<p className={'text-4xl max-sm:text-3xl'}>data is beautiful.</p>
		<Widget heading={'databases'} className={'md:w-1/2 bg-[#FCFCFC1A]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DATABASES}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.DATABASES]?.attributes}/>
		</Widget>
	</div>
);
const SystemDesign = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 max-sm:pt-12'}>
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
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10'}>
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
				 className={"w-full h-[100dvh] object-cover"}/>
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
		className={'min-h-[100dvh] bg-white flex flex-wrap px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)]' +
			' *:max-md:basis-full'}>
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
		className={'min-h-[100dvh] flex flex-wrap px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
		<div className={'flex justify-center'}>
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
				 className={"w-full h-[100dvh] object-cover"}/>
		<ImageComingSoon/>
		<p className={"text-5xl max-sm:text-4xl text-center py-32 max-sm:py-24"}>principles for life.</p>
		<ImproveContinuously sections={props.sections}/>
		<LeanProcesses sections={props.sections}/>
		<InspirationalQuote author={"Steve Jobs"} className={"text-white bg-black"}>
			Your time is limited, so don't waste it living someone else's life.
		</InspirationalQuote>
	</>
);

const WorkExperienceSection = () => (
	<div className={'pt-32 px-32 px-14 max-sm:px-10'}>
		<div className={'min-h-[100dvh]'}>
			<p className={'text-4xl max-sm:text-3xl'}>what's in a timeline?</p>
			<ComingSoon className={'mt-8'}/>
		</div>
		<p className={'text-4xl max-sm:text-3xl text-center mb-14'}>...and so much more</p>
		<ComingSoon className={'mb-8'}/>
		<div className={'flex flex-wrap gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
			<Widget heading={'portfolio site'}>
				<></>
			</Widget>
			<Widget heading={'AI prompt widget'}>
				<></>
			</Widget>
			<Widget heading={'AI terminal interface'}>
				<></>
			</Widget>
			<Widget heading={'Ajax Alternates redesign'}>
				<></>
			</Widget>
			<Widget heading={'iOS coding goals app'}>
				<></>
			</Widget>
			<Widget heading={'text formatter utility'}>
				<></>
			</Widget>
			<Widget heading={'2024 portfolio site'}>
				<></>
			</Widget>
			<Widget heading={'2022 portfolio site'}>
				<></>
			</Widget>
		</div>
	</div>
)

const Environment = ({sections}: { sections: SectionMap }) => (
	<div className={'min-h-[100dvh] bg-[#91A38B] px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 flex flex-wrap'}>
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
	<div className={'min-h-[100dvh] bg-white px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 flex flex-wrap'}>
		<div className={'flex justify-center basis-[calc(100%-100%/1.61803398875-5rem)] max-lg:basis-[calc(50%-1.5rem)] ' +
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
	<div className={'min-h-[100dvh] bg-[#4A4A4A] gap-12 max-sm:gap-10 flex flex-wrap'}>
		<img
			className={'w-[calc(100%/1.61803398875-1.5rem)] max-lg:basis-[calc(50%-1.5rem)] max-md:basis-full object-cover'}
			src={'/images/pattern_background.png'}
			alt={'picture of people in Palestine'}/>
		<div className={'grow flex justify-center px-10'}>
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
		<p id={"human-rights"} className={"text-5xl max-sm:text-4xl text-center py-32 max-sm:py-24"}>human rights</p>
		<InspirationalQuote author={"Steve Jobs"}>
			The people who are crazy enough to think they can change the world, are the ones who do.
		</InspirationalQuote>
		<Environment sections={props.sections}/>
		<Housing sections={props.sections}/>
		<Palestine/>
	</>
);

const InviteChrisSection = () => (
	<div id={'invite-chris'}
			 className={'min-h-[100dvh] bg-black text-[#FFFFFFCC] px-14 max-sm:px-10 py-32 max-sm:py-24 space-y-12 text-lg'}>
		<p className={'text-4xl max-sm:text-3xl'}>invite Chris</p>
		<div className={'py-6 px-12 bg-orange-400 rounded-md max-w-[45rem]'}>Coming Soon! This form is not yet active.</div>

		<div className={'space-y-8'}>
			<div className={'space-y-3 [&_input]:text-black [&_input]:py-2.5 [&_input]:px-10 [&_input]:mx-10' +
				' [&_input]:bg-[#FFFFFFCC] [&_input]:placeholder-gray-500 [&_input]:text-xl [&_input]:rounded-md' +
				' [&_input]:w-4/5 [&_input]:max-w-[36rem] [&_label]:basis-[6rem] [&_label]:shrink-0'}>
				<p className={'uppercase text-base text-[#FFFFFF99] mb-6'}>Contact Information</p>
				<div className={'flex'}>
					<label>Reason*</label>
					<input type={'text'} placeholder={'Event'}/>
				</div>
				<div className={'flex'}>
					<label>Name*</label>
					<input type={'text'}/>
				</div>
				<div className={'flex'}>
					<label>Email*</label>
					<input type={'text'}/>
				</div>
				<div className={'flex'}>
					<label>Phone</label>
					<input type={'text'}/>
				</div>
			</div>

			<div className={'space-y-3 [&_input]:text-black [&_input]:py-2.5 [&_input]:px-10 [&_input]:mx-10' +
				' [&_input]:bg-[#FFFFFFCC] [&_input]:placeholder-gray-500 [&_input]:text-xl [&_input]:rounded-md' +
				' [&_input]:w-4/5 [&_input]:max-w-[36rem] [&_label]:basis-[6rem] [&_label]:shrink-0'}>
				<p className={'uppercase text-base text-[#FFFFFF99] mb-6'}>Event Information</p>
				<div className={'flex'}>
					<label>Event*</label>
					<input type={'text'}/>
				</div>
				<div className={'flex'}>
					<label>Venue*</label>
					<input type={'text'}/>
				</div>
			</div>
		</div>

		<div className={'flex flex-wrap gap-x-32 gap-y-6'}>
			<p className={'uppercase lg'}>Add Message</p>
			<p className={'uppercase lg'}>Send</p>
		</div>
	</div>
)

const Home = () => {

	const [sections, setSections] = useState<SectionMap>({});

	useEffect(() => {
		const loadData = async () => {
			const {data} = await supabase
				.from('sections')
				.select(`
					title, content,
					attributes (name)
				`);
			const sectionMap =
				data?.reduce<SectionMap>((accumulator, section) => {
					accumulator[section.title] = {content: section.content, attributes: section.attributes}
					return accumulator;
				}, {})

			setSections(sectionMap ?? {});
		}
		loadData().then();
	}, []);

	return (
		<div>
			<Hero sections={sections}/>
			<AboutSection sections={sections}/>
			<GuidingPrinciplesSection sections={sections}/>
			<WorkExperienceSection/>
			<HumanRightsSection sections={sections}/>
			<InviteChrisSection/>
		</div>
	);
};

export default Home;