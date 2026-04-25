import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './i18n';
import Frontend from './Frontend';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardLayout } from './pages/DashboardLayout';
import { PredictYield } from './pages/PredictYield';
import { DiseaseDetection } from './pages/DiseaseDetection';
import { CropRecommend } from './pages/CropRecommend';
import { SoilDetails } from './pages/SoilDetails';
import { Profile } from './pages/Profile';
import { DashboardOverview } from './pages/DashboardOverview';
import { SuccessStories } from './pages/SuccessStories';
import { GreenShiftMarket } from './pages/GreenShiftMarket';
import { ChatBot } from './components/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Frontend />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/market" element={<GreenShiftMarket />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/soil-details" element={<SoilDetails />} />
        
        {/* Dashboard Shell via Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/predict" element={<PredictYield />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/recommend" element={<CropRecommend />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <ChatBot />
    </Router>
  )
}

export default App;
