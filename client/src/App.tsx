import Signin from "./pages/Auth/Signin";

import { Outlet, Route, Routes } from "react-router-dom";
import Signup from "./pages/Auth/Signup";

import Navbar from "@components/Navbar/Navbar";
import Home from "./pages/Home/Home";

import ProtectedRoute from "@components/Protected/ProtectedRoute";
import Account from "./pages/User/Account";

function Layout() {
  return (
    <div className="bg-dark-blue w-full h-full ">
      <div className=" flex w-full h-screen  p-10 flex-col space-y-5">
        <Navbar />
        <Outlet />
      </div>
      <hr className="border-black" />
      <footer className="w-full bg-dark-blue flex items-center justify-center p-5">
      </footer>
    </div>
  );
}
function App() {
  return (
    <div className="bg-dark-blue">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/account/:user" element={<Account />}></Route>
          </Route>
        </Route>
        <Route path="/auth/signin" element={<Signin />}></Route>
        <Route path="/auth/signup" element={<Signup />}></Route>
      </Routes>
    </div>
  );
}

export default App;
