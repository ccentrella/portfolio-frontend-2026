import type {ReactNode} from "react";

const InspirationalQuote = ({author, children}: {author:string, children:ReactNode}) => {
	return (
		<div className={'h-[100dvh] bg-white text-black flex justify-center'}>
			<div className={'flex space-y-5 flex-col justify-center p-16 max-w-[64rem]'}>
				<p className={'text-5xl max-sm:text-4xl leading-[1.25]'}>{children}</p>
				<p className={'text-2xl max-sm:text-lg tracking-[0.25rem] opacity-[.5] uppercase'}>{author}</p>
			</div>
		</div>
	);
};

export default InspirationalQuote;