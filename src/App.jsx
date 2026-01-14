import LoginPage from './LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import AdminLogin from './AdminLogin';
import DashboardPage from './DashboardPage';
import AdminDashb from './AdminDashb';
import VenueCheck from './VenueCheck';
import ProfilePage from './ProfilePage';
import ContactPage from './ContactPage';
import AdminProfile from './AdminProfile';
import AdminVerification from './AdminVerification';
import ResultCheck from './ResultCheck';




function App() { 
return ( 
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/admin-login" element={<AdminLogin/>}/>
    <Route path="/signup" element={<SignUp/>}/>
    <Route path="/dashboard" element={<DashboardPage/>}/>
    <Route path="/admin-dashboard" element={<AdminDashb/>}/>
    <Route path="/venue-check" element={<VenueCheck/>}/>
    <Route path="/profile" element={<ProfilePage/>}/>
    <Route path="/contact" element={<ContactPage/>}/>
    <Route path="/admin-profile" element={<AdminProfile/>}/>
    <Route path="/admin-verification" element={<AdminVerification/>}/>
    <Route path="/result-check" element={<ResultCheck/>}/>
  </Routes>
  </BrowserRouter>
); 
}
export default App;