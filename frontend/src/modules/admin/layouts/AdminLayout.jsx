import Sidbar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const AdminLayout= () =>{
    

    return(
        <div className="flex min-h-screeen">
            <Sidbar/>
            <div className="flex-1">
                <Header/>
                <main>
                <Outlet/>
                </main>

            </div>

        </div>
    )
}

export default AdminLayout