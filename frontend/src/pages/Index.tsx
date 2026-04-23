import { Navigate } from 'react-router-dom';

// Redirect root to the landing page
const Index = () => <Navigate to="/landing" replace />;

export default Index;
