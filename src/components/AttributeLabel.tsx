import type {ReactNode} from "react";

const AttributeLabel = ({children}: { children: ReactNode }) =>
	(
		<div className={'py-2 px-6 bg-[#FFFFFF33] hover:bg-[#FFFFFF41] cursor-default transition-colors'}>
			{children}
		</div>
	);

export default AttributeLabel;