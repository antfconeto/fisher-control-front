"use client";
import { Droplet, FishIcon, Home, User, Egg, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import styles from "./sideMenu.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LuFilePenLine } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";

const menuItems = [
  {
    category: "Principal",
    items: [
      {
        name: "Dashboard",
        icon: <Home size={18} />,
        link: "/dashboard",
      },
    ],
  },
  {
    category: "Gerenciamento",
    items: [
      {
        name: "Tanques",
        icon: <Droplet size={18} />,
        link: "/dashboard/tanks",
      },
      {
        name: "Animais",
        icon: <FishIcon size={18} />,
        link: "/dashboard/animals",
      },
      {
        name: "Espécies",
        icon: <LuFilePenLine size={18} />,
        link: "/dashboard/species",
      },
      {
        name: "Desovas",
        icon: <Egg size={18} />,
        link: "/dashboard/spawning",
      },
      {
        name: "Usuários",
        icon: <FaRegUser size={18} />,
        link: "/dashboard/users",
      },
    ],
  },
  {
    category: "Usuário",
    items: [
      {
        name: "Perfil",
        icon: <User size={18} />,
        link: "/dashboard/profile",
      },
    ],
  },
];

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsMenuOpen(false);
      }
    };

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar event listener para redimensionamento
    window.addEventListener("resize", checkIfMobile);

    // Limpar event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    // Fechar menu ao mudar de página em dispositivos móveis
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (link: string) => {
    return pathname === link;
  };

  // Renderiza o conteúdo do menu
  const renderMenuContent = () => (
    <>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Image
              src="/logo.svg"
              alt="Fisher Control"
              width={32}
              height={32}
            />
          </div>
          Fisher Control
        </div>
      </div>

      <div className={styles.menuContainer}>
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className={styles.menuCategory}>{section.category}</div>
            <Nav className={`flex-column ${styles.navMenu}`}>
              {section.items.map((item, index) => (
                <Nav.Item key={index} className="w-100">
                  <Link
                    href={item.link}
                    prefetch={true}
                    passHref
                    legacyBehavior
                  >
                    <Nav.Link
                      className={`text-white ${styles.sideItem} ${
                        isActive(item.link) ? styles.activeItem : ""
                      }`}
                    >
                      <div className={styles.iconItem}>
                        <span className="me-3">{item.icon}</span> {item.name}
                      </div>
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>
        ))}
      </div>

      <div className={styles.menuFooter}>
        <span>© 2025 Fisher Control</span>
        <div style={{ fontSize: "0.7rem", marginTop: "5px", opacity: 0.7 }}>
          Versão 1.0.0
        </div>
      </div>

      <div className={styles.menuDecoration}></div>
    </>
  );

  // Menu para dispositivos móveis
  if (isMobile) {
    return (
      <>
        <div className={styles.mobileMenuToggle} onClick={toggleMenu}>
          <Menu size={22} />
        </div>

        {isMenuOpen && (
          <>
            <div className={styles.mobileOverlay} onClick={toggleMenu}></div>
            <div className={styles.mobileSidebar}>
              <div className={styles.closeButton} onClick={toggleMenu}>
                <X size={18} />
              </div>
              {renderMenuContent()}
            </div>
          </>
        )}
      </>
    );
  }

  // Menu para desktop
  return <div className={styles.desktopSidebar}>{renderMenuContent()}</div>;
};

export default Sidebar;
