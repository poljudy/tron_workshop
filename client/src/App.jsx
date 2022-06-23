import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./components";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Outlet />
    </div>
    <Footer />
  </div>
);

export default App;
