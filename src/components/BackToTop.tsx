import {ArrowBigUp} from 'lucide-react';

const BackToTop = () => {
	return (
		<a href={'#'}>
			<div
				className={'bg-gray-500 opacity-40 rounded-[50%] p-4 hover:opacity-100 hover:transform-[scale(1.1)]  duration-[0.25s] fixed bg right-[18px] bottom-[6rem]'}>
				<ArrowBigUp className={'w-8 h-8'}/>
			</div>
		</a>
	)
		;
};

export default BackToTop;