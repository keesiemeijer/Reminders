import { Route, Routes } from "react-router-dom";

import Reminders from "./components/reminders";
import Settings from "./components/settings";
import PageNotFound from "./components/404Page";
import Navbar from "./components/navbar";
import { ToastContainer } from "react-toastify";

import "./App.css";

function App() {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Reminders />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
