import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import LearningPath from './components/LearningPath';
import Lesson from './components/Lesson';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Lesson route - fullscreen without layout */}
        <Route path="/lesson/:lessonId" element={<Lesson />} />

        {/* Main routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="learn" element={<LearningPath />} />
          <Route path="practice" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-white text-3xl">Practice - Coming Soon</h1></div>} />
          <Route path="leaderboard" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-white text-3xl">Leaderboard - Coming Soon</h1></div>} />
          <Route path="shop" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-white text-3xl">Shop - Coming Soon</h1></div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="more" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-white text-3xl">More - Coming Soon</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
