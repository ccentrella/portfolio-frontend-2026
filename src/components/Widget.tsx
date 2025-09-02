import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";

const Widget = ({heading, children, className}: {
	heading: string,
	children: ReactNode,
	className?: string,
}) => {
	return (
		<div
			className={twMerge(`p-12 max-sm:p-10 pb-24 max-sm:pb-20 rounded-xl text-[#FFFFFFA3] transition-colors bg-[#9494941A] opacity-95 hover:opacity-100 space-y-6 cursor-default`, className)}>
			<p className={'text-2xl max-sm:text-lg mb-6'}>{heading}</p>
			{children}
		</div>
	);
};

export default Widget;