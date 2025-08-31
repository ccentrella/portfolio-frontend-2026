import './App.css'
import Home from "./pages/home/Home.tsx";
import {Route, Routes} from "react-router";

const App = () => (
	<Routes>
		<Route index element={<Home/>}/>
	</Routes>
)

export default App
