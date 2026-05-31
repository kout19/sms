import "./App.css";
import "./index.css";
import Landingpages from "./modules/public/pages/Landingpages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./modules/admin/routes/AdminRoutes";
function App() {
  return (
    <div className="app ">
      <BrowserRouter>
        {/* Landing pages */}
        <Routes>
          <Route path="/" element={<Landingpages/>}/>
          {/* Admin pages */}
          <Route path="/admin/*" element={<AdminRoutes/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
