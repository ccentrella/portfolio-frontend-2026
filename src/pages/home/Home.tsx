import InspirationalQuote from "../../components/InspirationalQuote.tsx";
import {useEffect, useState} from "react";

const Hero = () => (
	<div className={"min-h-[100dvh] p-14 space-y-14"}>
		<div className={"flex justify-between flex-wrap space-y-12"}>
			<div className={"font-poppins font-medium text-3xl text-gray-400 space-y-5 basis-1/5 max-md:basis-full"}>
				<p className={"text-cyan-500 text-4xl mb-10"}>Chris <span
					className={"ml-2 bg-cyan-200 size-2.5 rounded-[50%] inline-block"}></span></p>
				<p>resume</p>
				<p>human rights</p>
				<p>invite Chris</p>
			</div>
			<img className={"object-cover m-auto w-72 h-80 rounded-[55%_45%_55%_45%]"}
					 src={"/images/profile.jpeg"} alt={"Chris in hoodie, relaxed"}/>
			<div className={"basis-1/5 max-md:basis-full"}></div>
		</div>
		<div className={"flex justify-center flex-wrap gap-12 *:basis-[calc(50%-1.5rem)] text-[#FFFFFFA3] text-2xl " +
			"*:max-md:basis-11/12 *:p-12 *:pb-48 *:rounded-xl"}>
			<div className={"bg-[#62EAFF6B]"}><p>design</p></div>
			<div className={"bg-[#9494946B]"}><p>engineering</p></div>
		</div>
	</div>
);

const AboutMe = () => {
	return <div className={"min-h-[100dvh] py-[8rem]"}>
		<div className={"flex flex-wrap *:rounded-xl px-14 gap-12"}>
			<div className={"grow bg-[#9494941A] p-12 text-[#FFFFFFA3] text-2xl"}><p>about me</p></div>
			<img className={`basis-[calc(100%-100%/1.61803398875-5rem)] min-w-0 max-md:grow max-sm:flex-[100%]`}
					 src={"/images/stroll.jpeg"} alt={"Chris walking while carrying iPad"}/>
		</div>
		<div className={"flex justify-center flex-wrap m-14 text-[#FFFFFFA3] text-2xl " +
			"*:p-12 *:pb-96 *:rounded-xl"}>
			<div className={"bg-[#62EAFF6B] grow"}><p>looking for a design-minded software engineer?</p></div>
		</div>
	</div>;
};

const AIWidget = () => {

	const [current, setCurrent] = useState(0);
	const [heading, setHeading] = useState('hello');
	const [placeholder, setPlaceholder] = useState('Have a question?');

	useEffect(() => {
		const headingArray = ['hello', 'hola']
		const placeholderArray = ['Have a question?', '¿Tenga una pregunta?']

		const updateText = () => {
			const next = (current + 1) % headingArray.length;

			setCurrent(next);
			setHeading(headingArray[next]);
			setPlaceholder(placeholderArray[next]);
		}

		const timer = setInterval(updateText, 2500);

		return () => clearInterval(timer);
	}, [current]);

	return (
		<div className={'min-h-[100dvh] bg-[#3C9FBA] flex justify-center items-center'}>
			<div className={'text-center space-y-10 grow'}>
				<p className={'font-bumbbled text-8xl text-[#85D7E0]'}>{heading}</p>
				<input placeholder={placeholder}
							 className={'py-5 px-12 bg-[#0973907F] placeholder-gray-300 rounded-lg w-4/5'} type={'text'}/>
			</div>
		</div>
	);
};

const Home = () => {
	return (
		<div className={'bg-[#002028] text-gray-50'}>
			<Hero/>
			<InspirationalQuote author={'Steve Jobs'}>
				The only way to do great work is to love what you do.
			</InspirationalQuote>
			<AboutMe/>
			<AIWidget/>
		</div>
	);
};

export default Home;