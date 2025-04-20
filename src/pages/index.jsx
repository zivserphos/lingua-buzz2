import Layout from "./Layout.jsx";
import Sounds from "./Sounds";
import Leaderboard from "./Leaderboard";
import MemeSound from "./MemeSound";
import SavedSounds from "./SavedSounds";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Sounds: Sounds,
    Leaderboard: Leaderboard,
    MemeSound: MemeSound,
    SavedSounds: SavedSounds,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<Sounds />} />
                <Route path="/Sounds" element={<Sounds />} />
                <Route path="/sounds" element={<Sounds />} />
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/SavedSounds" element={<SavedSounds />} />
                <Route path="/savedsounds" element={<SavedSounds />} />
                <Route path="/MemeSound" element={<MemeSound />} />
                <Route path="/memesound" element={<MemeSound />} />
                {/* Add case-insensitive routes for the name parameter */}
                <Route path="/MemeSound/:name" element={<MemeSound />} />
                <Route path="/memesound/:name" element={<MemeSound />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}