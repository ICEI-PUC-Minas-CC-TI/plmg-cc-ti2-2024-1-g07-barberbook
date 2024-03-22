import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Page from './components/Page';
import Home from './components/Home';
import ServicePage from './components/ServicePage';
import AdditionalService from './components/AdditionalService';
import Scheduling from './components/Scheduling';
import NumberPage from './components/NumberPage';
import MyAcc from './components/MyAcc';
import AdminPage from './components/Admin';
import Visagism from './components/Visagism';
import LandingPage from './components/LandingPage';
import StoreRegister from './components/StoreRegister';
import MyScheduling from './components/MyScheduling';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Roote />} />
        <Route path="/HomePage/store/:storeId" element={<Home />} />
        <Route path="/HomePage/store/:storeId/ServicePage/:serviceId" element={<ServicePage />} />
        <Route path="/HomePage/store/:storeId/ServicePage/:serviceId/AdditionalService" element={<AdditionalService />} />
        <Route path="/HomePage/store/:storeId/ServicePage/:serviceId/AdditionalService/SchedulingPage" element={<Scheduling />} />
        <Route path="/HomePage/store/:storeId/NumberPage" element={<NumberPage />} />
        <Route path="/HomePage/store/:storeId/MyAccount" element={<MyAcc />} />
        <Route path="/HomePage/store/:storeId/AdminPage" element={<AdminPage />} />
        <Route path="/HomePage/store/:storeId/VisagismPage" element={<Visagism />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/StoreRegister" element={<StoreRegister />} />
        <Route path="/HomePage/store/:storeId/MyScheduling" element={<MyScheduling />} />
      </Routes>
    </Router>
  );
}

const Roote = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('/LandingPage');
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <Page>
      <img
        src="./public/logo.svg"
        alt=""
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          margin: 'auto',
          opacity: 0.8,
          paddingTop: '20vh',
          animation: 'fadeInUp 1.5s ease-in-out forwards',
        }}
      />
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Page>);
};

export default App;
