import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar";
import Footer from "../components/footer";

export default function Root() {
     return (
          <div className="root-background">
               <NavBar />
               <div className="outlet">
                    <Outlet />
               </div>
               <div className="footer">
                    <Footer />
               </div>
          </div>
     );
}
