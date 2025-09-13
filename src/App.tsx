import {Route, Routes, useLocation} from "react-router";
import {useEffect, useRef, useState} from "react";

import './App.css'
import Home from "./pages/home/Home.tsx";
import Footer from "./components/Footer.tsx";
import BackToTop from "./components/BackToTop.tsx";
import Single from "./pages/single/Single.tsx";

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
				<Route path={'/privacy-policy'} element={<Single path={'/policies/privacy.md'}/>}/>
				<Route path={'/terms-conditions'} element={<Single path={'/policies/terms.md'}/>}/>
				<Route path={'/accessibility'} element={<Single path={'/policies/accessibility.md'}/>}/>
				<Route path={'/modern-slavery'} element={<Single path={'/policies/modern-slavery.md'}/>}/>
				<Route path={'/palestine'} element={<Single path={'/policies/palestine.md'}/>}/>
			</Routes>
			{!isTop && <BackToTop/>}
			<Footer/>
		</>
	);
}

export default App
