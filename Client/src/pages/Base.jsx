import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";


const Base = () => {
    return (
        <div>
            <div className="w-full">
            <Navbar></Navbar>
            </div>
            <Outlet></Outlet>
        </div>
    );
};

export default Base;