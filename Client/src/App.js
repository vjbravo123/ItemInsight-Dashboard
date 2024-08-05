import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './mycomponents/LandingPage';
import ItemList from './mycomponents/user/ItemsList';
import ItemDetail from './mycomponents/user/ItemDetail';
import Interaction from './mycomponents/user/Interaction';
import Login from './mycomponents/admin/Login';
import AdminDashboard from './mycomponents/admin/adminDashboard';


function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/items" element={<ItemList />} />
                    <Route path="/item/:itemId" element={<ItemDetail />} />
                    <Route path="/interaction" element={<Interaction />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
