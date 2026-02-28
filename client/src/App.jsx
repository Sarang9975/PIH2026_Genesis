import { BrowserRouter, Routes, Route } from 'react-router-dom';
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Linzo Landing (WIP)</h1>} />
                <Route path="/dashboard" element={<h1>Dashboard (Draft)</h1>} />
            </Routes>
        </BrowserRouter>
    );
}
