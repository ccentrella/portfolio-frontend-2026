import {motion} from "motion/react";
import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import {useMediaQuery} from "react-responsive";

const AttributeWidget = ({heading, children, className}: {
	heading: string | ReactNode,
	children: ReactNode,
	className?: string,
}) => {
	const isMobile = useMediaQuery({maxWidth: 640});

	return (
		<motion.div initial={{opacity: 0, y: 12}}
								whileInView={{opacity: 1, y: 0}}
								transition={{duration: 0.55, ease: "easeOut"}}
								viewport={{once: true, amount: isMobile ? 0.4 : 0.6}}
								className={'flex flex-col space-y-6'}>
			<div
				className={twMerge(`transform-gpu grow p-12 pt-14 rounded-xl text-[#FFFFFFA3] transition-colors bg-[#9494941A] opacity-95 hover:opacity-100 cursor-default`, className)}>
				{children}
			</div>
			<p className={'uppercase text-gray-400 text-xl max-sm:text-lg'}>{heading}</p>
		</motion.div>
	);
};

export default AttributeWidget;