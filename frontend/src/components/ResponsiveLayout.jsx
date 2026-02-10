import { useEffect, useState } from 'react';
import Layout from './Layout';
import MobileLayout from './MobileLayout';
import Dashboard from '../pages/Dashboard';
import { useLocation } from 'react-router-dom';

const ResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use regular dashboard for all devices
  return isMobile ? <MobileLayout /> : <Layout />;
};

export default ResponsiveLayout;
