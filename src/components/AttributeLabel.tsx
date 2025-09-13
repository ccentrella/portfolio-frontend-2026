import type {ReactNode} from "react";

const AttributeLabel = ({children}: { children: ReactNode }) =>
	(
		<div className={'max-sm:text-sm py-2 px-6 bg-[#FFFFFF33] hover:bg-[#FFFFFF3D] cursor-default transition-colors rounded-sm'}>
			{children}
		</div>
	);

export default AttributeLabel;