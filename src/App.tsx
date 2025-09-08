import {Route, Routes, useLocation} from "react-router";
import {useEffect, useRef, useState} from "react";

import './App.css'
import Home from "./pages/home/Home.tsx";
import Footer from "./components/Footer.tsx";
import BackToTop from "./components/BackToTop.tsx";

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
	const [isTop, setIsTop] = useState(true);
	const ticking = useRef(false);

	useHashOnPageLoad();

	useEffect(() => {
		const handleScroll = () => {
			if (!ticking.current) {
				setTimeout(() => {
					setIsTop(window.scrollY < 256);
					ticking.current = false;
				}, 200);

				ticking.current = true;
			}
		}

		window.addEventListener("scroll", handleScroll, {passive: true});
		handleScroll(); // run once on mount

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<Routes>
				<Route index element={<Home/>}/>
			</Routes>
			{!isTop && <BackToTop/>}
			<Footer/>
		</>
	);
}

export default App
