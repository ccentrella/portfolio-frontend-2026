import {type ReactNode, useEffect, useRef} from "react";
import {twMerge} from "tailwind-merge";
import {useAnimate, useInView} from "motion/react";

const InspirationalQuote = ({author, children, className}: {
	author: string,
	children: ReactNode,
	className?: string
}) => {
	const quoteRef = useRef(null);
	const authorRef = useRef(null);
	const [scope, animate] = useAnimate();
	const isInView = useInView(scope,
		{
			amount: 0.4,
			once: true
		})

	useEffect(() => {

		const beat = 0.3
		const runAnimation = async () => animate(
			[
				[
					quoteRef.current!,
					{y: ["-10px", 0], opacity: [0, 1]},
					{duration: 2 * beat, ease: "easeOut", at: beat}
				],
				[
					authorRef.current!,
					{opacity: [0, 0.5]},
					{duration: beat, ease: "easeOut", at: 3 * beat}
				],
			]
		);

		if (isInView) {
			runAnimation().then();
		}

	}, [animate, isInView, quoteRef, authorRef]);

	return (
		<div ref={scope}
				 className={twMerge('min-h-[100lvh] bg-white text-black flex justify-center snap-start', className)}>
			<div className={'flex space-y-6 flex-col justify-center p-16 max-w-[64rem]'}>
				<p ref={quoteRef} className={'transform-gpu opacity-0 text-5xl max-sm:text-3xl leading-[1.25]'}>{children}</p>
				<p ref={authorRef}
					 className={'transform-gpu opacity-0 text-2xl max-sm:text-base tracking-[0.25rem] uppercase'}>{author}</p>
			</div>
		</div>
	);
};

export default InspirationalQuote;