import {motion} from "motion/react";
import type {ReactElement, ReactNode} from "react";
import {twMerge} from "tailwind-merge";

const SectionHeading = ({children, className}:{children:ReactNode, className?:string}) => {
	return (
		<motion.p initial={{opacity: 0, y: 12}}
							whileInView={{opacity: 1, y: 0}}
							transition={{duration: 0.55, ease: "easeOut"}}
							viewport={{once: true, amount: 0.6}}
							className={twMerge('transform-gpu', className)}>{children}</motion.p>
	);
};

export default SectionHeading;