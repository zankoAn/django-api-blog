import { Outlet, ScrollRestoration } from 'react-router-dom';

import Navbar from './components/base/navbar';
import Footer from './components/base/footer';
import './App.css';

function App() {
  return (
    <div className="base" dir="rtl">
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
