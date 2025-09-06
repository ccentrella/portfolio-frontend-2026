import {Route, Routes, useLocation} from "react-router";
import {useEffect, useState} from "react";

import './App.css'
import Home from "./pages/home/Home.tsx";
import Footer from "./components/Footer.tsx";

// When page first loads, scroll to hash and disable instant scroll
const useHashOnPageLoad = () => {
	const {hash} = useLocation();
	const [isInitial, setIsInitial] = useState(true);

	useEffect(() => {
		setIsInitial(false);

		if (!hash || !isInitial) {
			return;
		}

		const element = document.getElementById(hash.slice(1)) ??
			document.getElementById(hash.slice(1).toLowerCase());
		element?.scrollIntoView({behavior: "instant"});

	}, [isInitial, hash]);
}

const App = () => {
	useHashOnPageLoad();

	return (
		<>
			<Routes>
				<Route index element={<Home/>}/>
			</Routes>
			<Footer/>
		</>
	);
}

export default App
