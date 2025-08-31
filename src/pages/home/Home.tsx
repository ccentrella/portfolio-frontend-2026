import InspirationalQuote from "../../components/InspirationalQuote.tsx";

const Home = () => {
	return (
		<div className={'bg-[#002028] text-gray-50'}>

			<div className={'min-h-[100dvh] p-14 space-y-14'}>
				<div className={'flex justify-between flex-wrap space-y-12'}>
					<div className={'font-poppins font-medium text-3xl text-gray-400 space-y-5 basis-1/5 max-md:basis-full'}>
						<p className={'text-cyan-500 text-4xl mb-10'}>Chris <span
							className={'ml-2 bg-cyan-200 size-2.5 rounded-[50%] inline-block'}></span></p>
						<p>resume</p>
						<p>human rights</p>
						<p>invite Chris</p>
					</div>
					<img className={'object-cover m-auto w-72 h-80 rounded-[55%_45%_55%_45%]'}
							 src={'/images/profile.jpeg'} alt={'Chris in hoodie, relaxed'}/>
					<div className={'basis-1/5 max-md:basis-full'}></div>
				</div>

				<div className={'flex justify-center flex-wrap gap-12 *:basis-[calc(50%-1.5rem)] ' +
					'*:max-md:basis-11/12 *:pt-14 *:pb-48 *:px-24 *:rounded-xl'}>
					<div className={'bg-[#62EAFF6B]'}><p>design</p></div>
					<div className={'bg-[#9494946B]'}><p>engineering</p></div>

				</div>
			</div>
			<InspirationalQuote author={'Steve Jobs'}>
				The only way to do great work is to love what you do.
			</InspirationalQuote>
		</div>
	);
};

export default Home;