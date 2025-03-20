// App.js
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/signup";
import Signin from "./components/signin";
import Dasboard from "./components/Dasboard";
import Footer from "./components/Footer";



function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="main-content">
                    <Routes>
                        {/* Route for Home */}
                        <Route path="/" element={<Dasboard />} /> {/* Use the Home component here */}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/signin" element={<Signin />} />


                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <Footer />

            </div>
        </BrowserRouter>
    );
}

export default App;