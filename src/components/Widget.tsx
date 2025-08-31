import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";

const Widget = ({heading, children, className}: {
	heading: string,
	children: ReactNode,
	className?: string,
}) => {
	return (
		<div className={twMerge(`p-12 pb-48 rounded-xl text-[#FFFFFFA3] bg-[#9494941A]`, className)}>
			<p className={'text-2xl'}>{heading}</p>
			{children}
		</div>
	);
};

export default Widget;