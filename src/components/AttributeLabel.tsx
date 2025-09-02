import type {ReactNode} from "react";

const AttributeLabel = ({children}: { children: ReactNode }) =>
	(
		<div className={'py-2 px-6 bg-[#FFFFFF33] hover:bg-[#FFFFFF1A] cursor-default transition-colors'}>
			{children}
		</div>
	);

export default AttributeLabel;