import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom';
import { BsArrowLeftShort, BsChevronBarDown } from "react-icons/bs";
import { AiFillSketchCircle } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { GoVersions } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import Login from './pages/Login';
import Type1 from './pages/Type1';
import DataDocumentList from './pages/DataDocumentList';
import Documentapproved from './pages/Documentapproved';
import Edit from './pages/Edit';
import Version from './pages/Version-1';
import { AiFillDiff } from "react-icons/ai";
import { AiFillSignal } from "react-icons/ai";
import DocumentRejectedList from './pages/Documentrejected';
import DocumentDestroy from './pages/Documentdestroy';
import Homepage from './pages/Homepage';

function App() {
  const [open, setOpen] = useState(true);
  const [submenuOpen1, setSubmenuOpen1] = useState(false);
  const [submenuOpen3, setSubmenuOpen3] = useState(false);

  const isLoginPage = window.location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/'; // Redirect to login page
  };

  const Menu = [
    { title: "Dashboard", link: "/Homepage" },
    {
      title: "การควบคุมเอกสาร", icon: <AiFillDiff />, spacing: true,
      submenu: true,
      submenuItems: [
        {
          title: "เพิ่มเอกสารลงระบบ",
          link: "/type1",
        },
        {
          title: "แก้ไขเอกสารในระบบ",
          link: "/Edit",
        },
      ],
    },
    {
      title: "สถานะเอกสาร", icon: <AiFillSignal />,
      submenu: true,
      submenuItems: [
        {
          title: "เอกสารรออนุมัติ",
          link: "/DataDocumentList",
        },
        {
          title: "เอกสารที่ได้รับการอนุมัติ",
          link: "/Documentapproved",
        },
        {
          title: "เอกสารที่ถูกปฏิเสธ",
          link: "/Documentrejected"
        },
        {
          title: "เอกสารรอการทำลาย",
          link: "/Documentdestroy"
        },
      ],
    },
    { title: "Version", icon: <GoVersions />, link: "/version" },
    { title: "Logout", icon: <CiLogout />, action: handleLogout },
  ];

  const ProtectedRoute = ({ children }) => {
    if (!localStorage.getItem('isLoggedIn')) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="flex">
        {!isLoginPage && (
          <div className={`bg-dark-purple h-screen p-5 pt-8 ${open ? "w-72" : "w-20"} duration-300 relative`}>
            <BsArrowLeftShort className={`bg-white text-dark-purple text-3xl rounded-full absolute -right-3 top-9 border-dark-purple cursor-pointer ${!open && "rotate-180"}`} onClick={() => setOpen(!open)} />

            <div className="inline-flex items-center">
              <AiFillSketchCircle className={`text-sky-400 text-6xl rounded cursor-pointer block float-left mr-2 p-1 duration-300 ${open && "rotate-[360deg]"}`} />
              <h1 className={`text-white origin-left font-medium text-2xl ${!open && "scale-0 duration-300"}`}>Document Control</h1>
            </div>

            <ul className="pt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
              {Menu.map((menu, index) => (
                <React.Fragment key={index}>
                  <li
                    className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-slate-600 rounded-md mt-2 ${menu.spacing ? "mt-9" : "mt-2"}`}
                    onClick={() => {
                      if (menu.submenu) {
                        if (menu.title === "การควบคุมเอกสาร") {
                          setSubmenuOpen1(!submenuOpen1);
                        } else if (menu.title === "สถานะเอกสาร") {
                          setSubmenuOpen3(!submenuOpen3);
                        }
                      } else if (menu.action) {
                        menu.action();
                      }
                    }}
                  >
                    <Link to={menu.link || "#"} className="flex items-center gap-x-4 w-full">
                      <span className="text-2xl block float-left">{menu.icon ? menu.icon : <RiDashboardFill />}</span>
                      <span className={`text-base font-medium flex-1 duration-300 ${!open && "hidden"}`}>{menu.title}</span>
                      {menu.submenu && open && (
                        <BsChevronBarDown
                          className={`${(menu.title === "การควบคุมเอกสาร" && submenuOpen1) || (menu.title === "สถานะเอกสาร" && submenuOpen3) ? "rotate-180" : ""}`}
                        />
                      )}
                    </Link>
                  </li>
                  {menu.submenu && menu.title === "การควบคุมเอกสาร" && submenuOpen1 && open && (
                    <ul className="pl-8">
                      {menu.submenuItems.map((submenuItems, subIndex) => (
                        <li key={subIndex} className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-slate-600 rounded-md mt-2">
                          <Link to={submenuItems.link || "#"} className="block w-full truncate">{submenuItems.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {menu.submenu && menu.title === "สถานะเอกสาร" && submenuOpen3 && open && (
                    <ul className="pl-8">
                      {menu.submenuItems.map((submenuItems, subIndex) => (
                        <li key={subIndex} className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-slate-600 rounded-md mt-2">
                          <Link to={submenuItems.link || "#"} className="block w-full truncate">{submenuItems.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        )}
        <div className={isLoginPage ? "w-full" : "p-7 flex-1"}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
            <Route path="/type1" element={<ProtectedRoute><Type1 /></ProtectedRoute>} />
            <Route path="/Edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
            <Route path="/DataDocumentList" element={<ProtectedRoute><DataDocumentList /></ProtectedRoute>} />
            <Route path="/Documentapproved" element={<ProtectedRoute><Documentapproved /></ProtectedRoute>} />
            <Route path="/Documentrejected" element={<ProtectedRoute><DocumentRejectedList /></ProtectedRoute>} />
            <Route path="/Documentdestroy" element={<ProtectedRoute><DocumentDestroy /></ProtectedRoute>} />
            <Route path="/version" element={<ProtectedRoute><Version /></ProtectedRoute>} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;
