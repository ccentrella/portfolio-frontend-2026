const Footer = () => (
	<div className={'snap-start min-h-[100lvh] bg-[#204F5C] text-[#FFFFFF66] p-14 pt-24 pb-10 flex flex-col gap-12 justify-between'}>
		<div className={"space-y-5 basis-1/5 max-md:basis-full"}>
			<p className={"text-cyan-500 hover:text-cyan-400 font-medium group text-4xl mb-10 max-sm:mb-8"}><a href={'#'}>Chris <span
				className={"ml-2 bg-cyan-200 group-hover:bg-cyan-100 size-2.5 rounded-[50%] inline-block"}></span></a></p>
			<div className={'flex flex-wrap gap-12 max-sm:gap-10'}>
				<div
					className={'font-poppins font-medium text-4xl max-sm:text-3xl text-gray-400 [&_a]:hover:text-gray-300 [&_a]:transition-colors space-y-5 max-sm:space-y-4 basis-2/5 max-md:basis-3/5 max-sm:basis-full'}>
					<p><a href={'https://blog.chriscentrella.com'} target={'_blank'}>blog</a></p>
					<p><a href={'#resume'}>resume</a></p>
					<p><a href={'#chat'}>chat</a></p>
					<p><a href={'#human-rights'}>human rights</a></p>
					<p><a href={'#invite-chris'}>invite Chris</a></p>
				</div>
				<div className={'uppercase text-lg space-y-5'}>
					<p className={'font-semibold'}>Legal</p>
					<p><a href={'/privacy-policy'} target={'_blank'}>Privacy Policy</a></p>
					<p><a href={'/terms-conditions'} target={'_blank'}>Terms of Use</a></p>
				</div>
			</div>
		</div>
		<div className={'space-y-8 lg:mx-6'}>
			<div className={'flex flex-wrap text-lg justify-between uppercase gap-x-10 gap-y-6'}>
				<p><a href={'/accessibility'} target={'_blank'}>Accessibility Statement</a></p>
				<p><a href={'/modern-slavery'} target={'_blank'}>Modern Slavery Notice</a></p>
				<p><a href={'/palestine'} target={'_blank'}>Statement on Palestine</a></p>
			</div>
			<div className={'space-y-0 max-md:space-y-3'}>
				<p>Designed with love by Chris Centrella, without the use of generative AI.</p>
				<p>Copyright &copy; 2025 Chris
					Centrella. All rights reserved.</p>
			</div>
		</div>
	</div>
);

export default Footer;