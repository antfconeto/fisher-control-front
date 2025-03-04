"use client"
import { Droplet, FishIcon, House, Album, PersonStanding, Egg } from "lucide-react";
import React from "react";
import { Nav } from "react-bootstrap";
import styles from  "./sideMenu.module.css"; 
import { useRouter } from "next/navigation";
const menuItems = [
  { name: "Início",  icon: <House className={`me-2 m-0 `} size={30} />, link: "/dashboard" },
  { name: "Tanques", icon: <Droplet className={`me-2 `}  size={30}/>, link: "tanks" },
  { name: "Animais", icon: <FishIcon className={`me-2 `}  size={30} />, link: "animals" },
  { name: "Desovas", icon: <Egg className={`me-2 `}  size={30}/>, link: "spawining" },
  { name: "Perfil", icon: <PersonStanding className={`me-2 `}   size={30}/>, link: "/dashboard/profile" },
];

const Sidebar = () => {
  const router = useRouter()
  return (
    <div className="d-flex flex-column flex-shrink-0  bg-primary text-white vh-100" style={{ width: "250px" }}>
      <h4 className="text-center m-3">Fisher Control</h4>
      <hr />
      <Nav className="flex-column">
        {menuItems.map((item, index) => (
          <Nav.Item key={index} className="m-0">
            <Nav.Link onClick={()=>{window.location.href = item.link}} className={`text-white d-flex align-items-center m-0 p-0 sidebar-item ${styles.sideItem}`}>
              <p className={`${styles.iconItem} flex h-100 m-0 p-4 rounded-pill`}>{item.icon} {item.name}</p>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};
export default Sidebar;