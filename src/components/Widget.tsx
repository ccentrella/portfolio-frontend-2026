import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";

const Widget = ({heading, children, className}: {
	heading: string,
	children: ReactNode,
	className?: string,
}) => {
	return (
		<div className={twMerge(`p-12 pb-24 rounded-xl text-[#FFFFFFA3] bg-[#9494941A]`, className)}>
			<p className={'text-2xl mb-5'}>{heading}</p>
			{children}
		</div>
	);
};

export default Widget;