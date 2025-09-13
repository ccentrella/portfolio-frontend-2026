import Markdown from "react-markdown";
import {useEffect, useState} from "react";

const Single = ({path}: { path: string }) => {
	const [markdown, setMarkdown] = useState<string>();

	useEffect(() => {
		fetch(path)
			.then(res => res.text())
			.then(data => {
				setMarkdown(data)
			})
	}, [path]);

	return (
		<div className={'prose prose-invert max-w-none pt-28 snap-start p-24 max-sm:p-12'}>
			<Markdown>
				{markdown}
			</Markdown>
		</div>
	);
};

export default Single;