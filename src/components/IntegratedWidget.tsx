import {motion} from "motion/react";
import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import {useMediaQuery} from "react-responsive";

const IntegratedWidget = ({heading, children, className, disableAnimation}: {
	heading: string | ReactNode,
	children: ReactNode,
	className?: string,
	disableAnimation?: boolean
}) => {
	const isMobile = useMediaQuery({maxWidth: "sm"});

	return disableAnimation ? (
		<div
			className={twMerge(`p-12 max-sm:p-10 pb-24 max-sm:pb-20 rounded-xl text-[#FFFFFFA3] transition-colors bg-[#9494941A] opacity-95 hover:opacity-100 space-y-6 cursor-default`, className)}>
			<p className={'text-2xl max-sm:text-lg mb-6'}>{heading}</p>
			{children}
		</div>
	) : (
		<motion.div
			initial={{opacity: 0, y: 12}}
			whileInView={{opacity: 1, y: 0}}
			transition={{duration: 0.55, ease: "easeOut"}}
			viewport={{once: true, amount: isMobile ? 0.25 : 0.4}}
			className={twMerge(`transform-gpu p-12 max-sm:p-10 pb-24 max-sm:pb-20 rounded-xl text-[#FFFFFFA3] transition-colors bg-[#9494941A] opacity-95 hover:opacity-100 space-y-6 cursor-default`, className)}>
			<p className={'text-2xl max-sm:text-lg mb-6'}>{heading}</p>
			{children}
		</motion.div>
	);
};

export default IntegratedWidget;