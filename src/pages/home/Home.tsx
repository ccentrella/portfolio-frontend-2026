import InspirationalQuote from "../../components/InspirationalQuote.tsx";
import {type ChangeEvent, useEffect, useMemo, useRef, useState} from "react";
import IntegratedWidget from "../../components/IntegratedWidget.tsx";
import {supabase} from "../../utils/supabaseClient.ts";
import AttributeLabel from "../../components/AttributeLabel.tsx";
import {twMerge} from "tailwind-merge";
import {
	Bot,
	Cloud,
	Database,
	Download,
	DraftingCompass,
	ExternalLink,
	FolderHeart,
	Network,
	SearchCheck,
	Send
} from 'lucide-react';
import {SiCalendly} from "@icons-pack/react-simple-icons";
import {motion, useAnimate, useInView} from "motion/react"
import {
	type Attribute,
	type InviteForm,
	LOADING_MESSAGE,
	type ProjectMap,
	type Role,
	SECTION_KEYS,
	type SectionMap,
	type translation
} from "./HomeTypes.tsx";
import Markdown from "react-markdown";
import AttributeWidget from "../../components/AttributeWidget.tsx";
import SectionHeading from "../../components/SectionHeading.tsx";
import {useMediaQuery} from "react-responsive";

// TODO: Add header

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
	<div className={"md:text-lg space-y-5"}>
		<Markdown>
			{props.sections[props.sectionTitle]?.content ?? LOADING_MESSAGE}
		</Markdown>
	</div>
);

const Hero = ({sections}: { sections: SectionMap }) => {
	const [scope, animate] = useAnimate();

	useEffect(() => {
		const isMobile = window.matchMedia("(max-width: 40rem)").matches
		const beat = 0.15;
		const dropBeats = 2;
		const holdBeats = 4;
		const firstItem = 0;
		const secondItem = (dropBeats + holdBeats) * beat;
		const thirdItem = secondItem + beat;
		const firstDuration = dropBeats * beat;
		const secondDuration = beat;
		const thirdDuration = 2 * beat;

		const runAnimation = async () =>
			await animate([
				// Image drops in
				[
					"#profile-image",
					{y: isMobile ? 0 : ["-40px", 0], opacity: [0, 1]},
					{duration: isMobile ? secondDuration : firstDuration, ease: "easeOut", at: isMobile ? secondItem : firstItem}
				],
				[
					"#controls",
					{y: isMobile ? ["-40px", 0] : 0, opacity: [0, 1]},
					{duration: isMobile ? firstDuration : secondDuration, ease: "easeOut", at: isMobile ? firstItem: secondItem}
				],
				[
					"#cards",
					{y: ["40px", 0], opacity: [0, 1]},
					{duration: thirdDuration, ease: "easeOut", at: thirdItem}
				],
			]);

		runAnimation().then();
	}, [animate]);

	return (
		<div ref={scope}
				 className={"min-h-[100svh] flex flex-col p-14 max-sm:p-10 space-y-14 max-sm:space-y-12 snap-start"}>
			<div className={"flex justify-between flex-wrap space-y-12 max-sm:space-y-8 "}>
				<motion.div id={'controls'}
										className={"opacity-0 transform-gpu will-change-transform font-poppins font-medium text-4xl max-sm:text-3xl text-gray-400 [&_a]:hover:text-gray-300 [&_a]:transition-colors space-y-5 max-sm:space-y-4 lg:basis-[calc((100%-18rem)/2)]  xl:basis-[calc((100%-24rem)/2)] max-md:basis-full"}>
					<p className={"text-cyan-500 text-4xl max-sm:text-3xl mb-10 max-sm:mb-8"}>Chris <span
						className={"ml-2 bg-cyan-200 size-2.5 rounded-[50%] inline-block"}></span></p>
					<p><a href={'https://blog.chriscentrella.com'} target={'_blank'}>blog</a></p>
					<p><a href={'#resume'}>resume</a></p>
					<p><a href={'#chat'}>chat</a></p>
					<p><a href={'#human-rights'}>human rights</a></p>
					<p><a href={'#invite-chris'}>invite Chris</a></p>
				</motion.div>
				<motion.div id={'profile-image'} className={'transform-gpu will-change-transform my-0 max-md:mx-auto'}>
					<img
						className={"animate-imgFloat object-cover opacity-95 hover:opacity-100 transition-colors w-60 h-64  sm:w-72 sm:h-80  xl:w-96 xl:h-[26rem]  rounded-[55%_45%_55%_45%]"}
						src={"/images/profile.jpeg"} alt={"Chris in hoodie, relaxed"}/>
				</motion.div>
				<div className={"basis-full lg:basis-[calc((100%-18rem)/2)]  xl:basis-[calc((100%-24rem)/2)]"}></div>
			</div>
			<motion.div id={'cards'}
									className={"transform-gpu will-change-transform opacity-0 grow flex justify-center flex-wrap gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full"}>
				<IntegratedWidget heading={'design'} className={'bg-[#62EAFF6B]'} disableAnimation={true}>
					<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DESIGN}/>
				</IntegratedWidget>
				<IntegratedWidget heading={'engineering'} className={'bg-[#9494946B]'} disableAnimation={true}>
					<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ENGINEERING}/>
				</IntegratedWidget>
			</motion.div>
		</div>
	);
};

const AboutMe = ({sections}: { sections: SectionMap }) => (
	<div className={"min-h-[100lvh] py-[8rem] max-sm:py-[6rem] snap-start"}>
		<div className={"flex max-md:flex-wrap px-14 max-sm:px-10 gap-12 max-sm:gap-10 max-xl:*:basis-1/2"}>
			<IntegratedWidget heading={'about me'} className={'grow'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ABOUT_ME}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.ABOUT_ME]?.attributes}/>
			</IntegratedWidget>
			<motion.img
				initial={{opacity: 0, y: 12}}
				whileInView={{opacity: 1, y: 0}}
				transition={{duration: 0.55, ease: "easeOut"}}
				viewport={{once: true, amount: 0.6}}
				className={`transform-gpu xl:basis-[calc(100%-100%/1.61803398875-1.5rem)] transition-colors opacity-95 hover:opacity-100 object-cover rounded-xl min-w-0 max-md:grow max-sm:flex-[100%]`}
				src={"/images/stroll.jpeg"} alt={"Chris walking while carrying iPad"}/>
		</div>
		<IntegratedWidget heading={'looking for a design-minded software engineer?'}
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
		</IntegratedWidget>
	</div>
);
const AIWidget = () => {
	const sectionRef = useRef(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const current = useRef(0);
	const [heading, setHeading] = useState('hello');
	const [placeholder, setPlaceholder] = useState('Have a question?');
	const [comingSoon, setComingSoon] = useState('Coming soon! Check back in the near future :)');
	const [translations, setTranslations] = useState<translation[]>([]);

	const [scope, animate] = useAnimate();
	const isInView = useInView(scope,
		{
			amount: 0.6,
			once: true
		})

	const isMobile = useMediaQuery({maxWidth: 640});
	const beat = isMobile ? 0.24 : 0.3;

	useEffect(() => {

		const runAnimation = async () => animate(
			[
				[
					'#ai-widget-heading',
					{y: ["-40px", '50%'], opacity: [0, 1]},
					{duration: 2 * beat, ease: "easeOut", at: beat}
				],
				[
					'#ai-widget-input',
					{opacity: [0, 1]},
					{duration: 2 * beat, ease: "easeOut", at: 4 * beat}
				],
				[
					'#ai-widget-heading',
					{y: 0},
					{duration: 2 * beat, ease: "easeOut", at: 4 * beat}
				],
				[
					'#ai-widget-coming-soon',
					{opacity: [0, 1]},
					{duration: 2 * beat, ease: "easeOut", at: 6 * beat}
				],
			]
		);

		if (isInView) {
			runAnimation().then();
		}

	}, [beat, animate, isInView]);

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
		fetch('/translations.json')
			.then(res => res.json())
			.then(data => {
				setTranslations(data)
			})
	}, [])

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;

		if (translations.length === 0 || !isAnimating) {
			return;
		}

		const updateText = () => {
			current.current = (current.current + 1) % translations.length;
			setHeading(translations[current.current].heading);
			setPlaceholder(translations[current.current].placeholder);
			setComingSoon(translations[current.current].comingSoon)
		}

		const initialDelay = setTimeout(() => {
			updateText();
			timer = setInterval(updateText, 2400);
		}, 10000 * beat)

		return () => {
			clearTimeout(initialDelay);
			clearInterval(timer);
		}
	}, [beat, isAnimating, translations]);

	return (
		<div ref={sectionRef} id={'chat'}
				 className={'min-h-[100lvh] bg-[#3C9FBA] flex justify-center items-center snap-start'}>
			<div ref={scope} className={'text-center space-y-10 grow'}>
				<p id={'ai-widget-heading'}
					 className={'will-change-transform transform-gpu opacity-0 font-bumbbled text-8xl max-sm:text-6xl text-[#85D7E0]'}>{heading}</p>
				<input id={'ai-widget-input'} placeholder={placeholder}
							 className={'will-change-transform transform-gpu opacity-0 py-5 px-12 bg-[#FFFFFF7F] placeholder-gray-500 text-xl max-sm:text-lg rounded-lg w-4/5'}
							 type={'text'}/>
				<div id={'ai-widget-coming-soon'}
						 className={'will-change-transform transform-gpu opacity-0 inline-block w-4/5'}>
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
		<SectionHeading className={'text-4xl max-sm:text-3xl'}>creatively intelligent.</SectionHeading>
		<AttributeWidget heading={<><Bot className={'mr-3 mt-[-.25rem] inline'}/> Artificial Intelligence</>}
										 className={'md:w-1/2 bg-[#FCFCFC1A]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ARTIFICIAL_INTELLIGENCE}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.ARTIFICIAL_INTELLIGENCE]?.attributes}/>
		</AttributeWidget>
	</div>
);
const DataIsBeautiful = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10 snap-start'}>
		<SectionHeading className={'text-4xl max-sm:text-3xl'}>data is beautiful.</SectionHeading>
		<AttributeWidget heading={<><Database className={'mr-3 mt-[-.15rem] inline'}/> Databases</>}
										 className={'md:w-1/2 bg-[#FCFCFC1A]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DATABASES}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.DATABASES]?.attributes}/>
		</AttributeWidget>
	</div>
);
const SystemDesign = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 max-sm:pt-12 snap-start'}>
		<SectionHeading className={'text-4xl max-sm:text-3xl mb-14 max-sm:mb-10 text-center'}>millions of users. one
			system.</SectionHeading>
		<div
			className={'flex flex-wrap px-14 max-sm:px-10 gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
			<AttributeWidget heading={<><Network className={'mr-3 mt-[-.15rem] inline'}/> Distributed Systems</>}
											 className={'bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.DISTRIBUTED_SYSTEMS}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.DISTRIBUTED_SYSTEMS]?.attributes}/>
			</AttributeWidget>
			<AttributeWidget heading={<><Cloud className={'mr-3 mt-[-.15rem] inline'}/> Cloud</>}
											 className={'bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.CLOUD}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.CLOUD]?.attributes}/>
			</AttributeWidget>
		</div>
	</div>
)
const BuiltToScale = ({sections}: { sections: SectionMap }) => (
	<div className={'py-32 max-sm:py-24 px-14 max-sm:px-10 space-y-10 snap-start'}>
		<SectionHeading className={'text-4xl max-sm:text-3xl'}>built to scale.</SectionHeading>
		<div className={'flex flex-wrap gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
			<AttributeWidget heading={<><DraftingCompass className={'mr-3 mt-[-.15rem] inline'}/> Architecture</>}
											 className={'bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ARCHITECTURE}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.ARCHITECTURE]?.attributes}/>
			</AttributeWidget>
			<AttributeWidget heading={<><SearchCheck className={'mr-3 mt-[-.15rem] inline'}/> Quality Assurance</>}
											 className={'bg-[#FCFCFC1A]'}>
				<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.QUALITY_ASSURANCE}/>
				<WidgetSectionAttributes collection={sections[SECTION_KEYS.QUALITY_ASSURANCE]?.attributes}/>
			</AttributeWidget>
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
		<motion.img loading="lazy"
								decoding="async"
								fetchPriority="low"
								initial={{opacity: 0, scale: 1.02}}
								whileInView={{opacity: 1, scale: 1}}
								transition={{duration: 0.8, ease: "easeOut"}}
								viewport={{once: true, amount: 0.4}}
								src={"/images/subway_very_dense.png"} alt={"systems illustration"}
								className={"transform-gpu w-full h-[100lvh] object-cover snap-start"}/>
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
			<SectionHeading className={'text-4xl max-sm:text-3xl text-black self-center leading-snug'}>improve.<br/>continuously.</SectionHeading>
		</div>
		<IntegratedWidget heading={<>改善<span className={'ml-4 text-base'}>continuous improvement</span></>}
											className={'bg-[#16748C]'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.CONTINUOUS_IMPROVEMENT}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.CONTINUOUS_IMPROVEMENT]?.attributes}/>
		</IntegratedWidget>
	</div>
)
const LeanProcesses = ({sections}: { sections: SectionMap }) => (
	<div
		className={'snap-start min-h-[100lvh] flex flex-wrap px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 *:basis-[calc(50%-1.5rem)] *:max-md:basis-full'}>
		<div className={'flex justify-center '}>
			<SectionHeading className={'text-4xl max-sm:text-3xl self-center leading-snug'}>
				simple. lean.<br/>forever.
			</SectionHeading>
		</div>
		<IntegratedWidget heading={<>トヨタ生産方式<span className={'ml-4 text-base'}>lean methodology</span></>}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.LEAN_PROCESSES}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.LEAN_PROCESSES]?.attributes}/>
		</IntegratedWidget>
	</div>
)
const GuidingPrinciplesSection = (props: { sections: SectionMap }) => (
	<>
		<motion.img
			loading="lazy"
			decoding="async"
			fetchPriority="low"
			initial={{opacity: 0, scale: 1.02}}
			whileInView={{opacity: 1, scale: 1}}
			transition={{duration: 0.8, ease: "easeOut"}}
			viewport={{once: true, amount: 0.4}}
			src={"/images/factory_2.png"} alt={"processes illustration"}
			className={"transform-gpu w-full h-[100lvh] object-cover snap-start"}/>
		<SectionHeading className={"text-5xl max-sm:text-4xl text-center py-32 max-sm:py-24 snap-start"}>人生の教訓<span
			className={'text-2xl ml-8'}>guidelines for
			life.</span></SectionHeading>
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
			<IntegratedWidget key={role.id} heading={`${role.title} at ${role.company}`}
												className={'max-w-[60rem] space-y-5 max-sm:space-y-4'}>
				<p className={'max-sm:text-sm text-gray-400'}>{role.year_start} - {role.year_end}</p>
				<p className={'max-sm:text-sm uppercase text-gray-400'}>Accomplishments:</p>
				<div className={'space-y-2'}>
					{role.accomplishments?.map(accomplishment => (<p key={accomplishment}>{accomplishment}</p>))}
				</div>

			</IntegratedWidget>
		))}
	</div>
)
const Projects = ({projects}: { projects: ProjectMap }) => (
	<div
		className={'flex flex-wrap m-auto justify-center gap-12 xl:gap-x-24 max-sm:gap-8 *:basis-[calc(50%-3rem)] *:max-md:basis-full max-w-[75rem]'}>
		{
			Object.values(projects).map(project => (
				<a key={project.id} href={project.link} target={'_blank'} rel={'noopener'} className={'*:h-full'}>
					<AttributeWidget
						className={'bg-[#FCFCFC1A] hover:bg-[#FCFCFC1F] cursor-pointer opacity-100'}
						heading={<><FolderHeart className={'mr-3 mt-[-.15rem] inline'}/> {project.title}</>}>
						{project.description}
					</AttributeWidget>
				</a>
			))
		}
	</div>
);
const WorkExperienceSection = (props: { projects: ProjectMap, roles: Role[] }) => (
	<div id={'resume'} className={'pt-32 max-sm:pt-24 px-14 max-sm:px-10 snap-start'}>
		<div className={'min-h-[100lvh]'}>
			<div className={'flex flex-wrap max-sm:justify-center gap-6 items-center mb-10 justify-between max-w-[60rem]'}>
				<SectionHeading className={'text-4xl max-sm:text-3xl'}>
					what's in a timeline?</SectionHeading>
				<motion.p
					initial={{opacity: 0, y: 12}}
					whileInView={{opacity: 1, y: 0}}
					transition={{duration: 0.55, ease: "easeOut"}}
					viewport={{once: true, amount: 0.6}}
					className={'transform-gpu max-sm:w-full'}><a
					className={'px-10 py-5 bg-cyan-500 hover:bg-cyan-600 rounded block'}
					href={'/resume_christopher_centrella.pdf'} target={'_blank'}><Download
					className={'inline mr-4 mt-[-.15rem]'}/> Download Resume</a></motion.p>
			</div>
			<Roles roles={props.roles}/>
		</div>
		<SectionHeading className={'text-4xl max-sm:text-3xl text-center mt-24 mb-14 snap-start'}>...and so much
			more</SectionHeading>
		<Projects projects={props.projects}/>
	</div>
)

const Environment = ({sections}: { sections: SectionMap }) => (
	<div
		className={'min-h-[100lvh] bg-[#021A24] px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 flex flex-wrap snap-start'}>
		<IntegratedWidget heading={'environment'}
											className={'bg-[#133F06] basis-[calc(50%-1.5rem)] max-md:basis-full'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.ENVIRONMENT}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.ENVIRONMENT]?.attributes}/>
		</IntegratedWidget>
		<IntegratedWidget heading={'planned obsolescence'}
											className={'basis-[calc(50%-1.5rem)] max-md:basis-full bg-[#3C4C24] '}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.PLANNED_OBSOLESCENCE}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.PLANNED_OBSOLESCENCE]?.attributes}/>
		</IntegratedWidget>
	</div>
)
const Housing = ({sections}: { sections: SectionMap }) => (
	<div
		className={'min-h-[100lvh] bg-white px-14 max-sm:px-10 py-32 max-sm:py-24 gap-12 max-sm:gap-10 flex flex-wrap snap-start'}>
		<div
			className={'flex justify-center basis-[calc(100%-100%/1.61803398875-5rem)] max-lg:basis-[calc(50%-1.5rem)] ' +
				'max-md:basis-full'}>
			<SectionHeading className={'text-4xl max-sm:text-3xl text-black self-center leading-snug'}>fight
				homelessness.</SectionHeading>
		</div>
		<IntegratedWidget heading={'affordable housing'}
											className={'grow bg-[#746D40] basis-[calc(100%-100%/1.61803398875-5rem)] max-lg:basis-[calc(50%-1.5rem)] max-md:basis-full'}>
			<WidgetSectionContent sections={sections} sectionTitle={SECTION_KEYS.AFFORDABLE_HOUSING}/>
			<WidgetSectionAttributes collection={sections[SECTION_KEYS.AFFORDABLE_HOUSING]?.attributes}/>
		</IntegratedWidget>
	</div>
)
const Palestine = () => (
	<div className={'min-h-[100lvh] bg-gray-900 gap-12 max-sm:gap-10 flex flex-wrap snap-start'}>
		<img
			className={'w-[calc(100%/1.61803398875-3rem)] max-md:basis-full object-cover grow'}
			src={'/images/palestine.jpg'}
			alt={'picture of people in Palestine'}/>
		<div className={'grow flex justify-center m-12'}>
			<div className={'self-center space-y-8'}>
				<SectionHeading className={'text-4xl max-sm:text-3xl leading-snug'}>every person<br/>deserves
					dignity</SectionHeading>
				<motion.a
					initial={{opacity: 0, y: 12}}
					whileInView={{opacity: 1, y: 0}}
					transition={{duration: 0.55, ease: "easeOut"}}
					viewport={{once: true, amount: 0.6}}
					href={'/palestine'} target={'_blank'}
					className={'transform-gpu px-10 py-5 bg-cyan-500 hover:bg-cyan-600 rounded block max-sm:w-full'}>
					<ExternalLink className={'inline mr-4 mt-[-.15rem]'}/> Statement on Palestine
				</motion.a>
			</div>
		</div>
	</div>
)
const HumanRightsSection = (props: { sections: SectionMap }) => (
	<div id={"human-rights"}>
		<SectionHeading className={"text-5xl max-sm:text-4xl text-center py-32 max-sm:py-24 snap-start"}>human
			rights</SectionHeading>
		<InspirationalQuote author={"Steve Jobs"}>
			The people who are crazy enough to think they can change the world, are the ones who do.
		</InspirationalQuote>
		<Environment sections={props.sections}/>
		<Housing sections={props.sections}/>
		<Palestine/>
	</div>
);

const InviteChrisSection = () => {

	const [isValid, setIsValid] = useState<boolean>(false);
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
		let ignore = false;
		let widgetId = '';

		const script = document.createElement("script");
		script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
		script.onload = () => {
			if (!ignore) {
				// noinspection JSUnusedGlobalSymbols
				widgetId = window.turnstile.render("#turnstile-container", {
					sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
					callback: (token: string) => setForm(prev => ({...prev, token})),
				});
			}
		};

		document.body.appendChild(script);

		return () => {
			ignore = true;
			if (window.turnstile) {
				window.turnstile.remove(widgetId);
			}
		}
	}, []);

	const updateFormState = useMemo(() => {
		let timer: ReturnType<typeof setTimeout>;

		return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string | boolean) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				setIsValid(e.target.form?.checkValidity() ?? false);
				setForm(prev => ({...prev, [e.target.name]: value}));
			}, 500)
		}
	}, [])

	const sendMessage = async () => {
		const {error} = await supabase.functions.invoke('Invite-Form', {
			body: form
		})
		setIsSuccess(!error);
	}

	return (
		<motion.div
			initial={{opacity: 0, y: 12}}
			whileInView={{opacity: 1, y: 0}}
			transition={{duration: 0.55, ease: "easeOut"}}
			viewport={{once: true, amount: 0.4}}
			id={'invite-chris'}
			className={'transform-gpu min-h-[100lvh] bg-black px-14 max-sm:px-10 py-32 max-sm:py-24 space-y-12 text-lg snap-start'}>
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
				className={'max-sm:text-sm bg-green-600 text-gray-100 py-5 px-10  max-sm:py-4 max-sm:px-6 md:pr-20 rounded-md inline-block'}>
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
				'[&_input,textarea]:user-invalid:bg-red-200',
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
									 onChange={(e) => updateFormState(e, e.target.value)}/>
					</div>
					<div className={'flex max-sm:flex-wrap'}>
						<label>Email*</label>
						<input required name={'email'} type={'email'}
									 onChange={(e) => updateFormState(e, e.target.value)}/>
					</div>
					<div className={'flex max-sm:flex-wrap'}>
						<label>Phone</label>
						<input name={'phone'} type={'tel'}
									 onChange={(e) => updateFormState(e, e.target.value)}/>
					</div>
					<div className={'flex max-sm:flex-wrap'}>
						<label>Message*</label>
						<textarea required name={'message'} className={'h-32'}
											onChange={(e) => updateFormState(e, e.target.value)}>
						</textarea>
					</div>
					<div className={'mt-6'}>
						<label className="inline-flex items-center gap-6 cursor-pointer">
							<input name={'signup'} type="checkbox" className="sr-only peer"
										 onChange={(e) => updateFormState(e, e.target.checked)}/>
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
				<div>
					<button disabled={!isValid || isSuccess} type={'submit'}
									className={'px-10 py-5 bg-cyan-500 hover:bg-cyan-600 rounded block max-sm:w-full ' +
										'disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed'}>
						<Send className={'inline mr-4 mt-[-.15rem]'}/> Send Message
					</button>
					<div id="turnstile-container" className={'mt-5'}></div>
				</div>
			</form>
		</motion.div>
	);
}

const useScrollReveal = () => {
	useEffect(() => {
		const targets = document.querySelectorAll<HTMLElement>(".reveal");
		const io = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add("reveal-in");
						io.unobserve(entry.target);
					}
				});
			},
			{threshold: 0.18}
		);
		targets.forEach(t => io.observe(t));
		return () => io.disconnect();
	}, []);
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

	useScrollReveal();

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