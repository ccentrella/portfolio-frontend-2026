import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";

const InspirationalQuote = ({author, children, className}: {
	author: string,
	children: ReactNode,
	className?: string
}) => {
	return (
		<div className={twMerge('min-h-[100dvh] bg-white text-black flex justify-center snap-start', className)}>
			<div className={'flex space-y-6 flex-col justify-center p-16 max-w-[64rem]'}>
				<p className={'text-5xl max-sm:text-3xl leading-[1.25]'}>{children}</p>
				<p className={'text-2xl max-sm:text-base tracking-[0.25rem] opacity-[.5] uppercase'}>{author}</p>
			</div>
		</div>
	);
};

export default InspirationalQuote;