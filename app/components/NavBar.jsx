"use client";
import LanguageIcon from "@mui/icons-material/Language";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { Menu } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";
function Navbar() {
  const [res, setRes] = useState(false);
  function handleToggle() {
    setRes(!res);
  }
  const navlinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Account", href: "#" },
  ];
  return (
    <nav className="fixed w-full z-10">
      <div className="w-9/10 bg-background shadow-[0_5px_35px_rgba(0,0,0,0.25)] mx-auto flex mt-4 max-md:py-2 rounded-lg overflow-hidden">
        <div className="flex max-md:flex-col grow">
          <div className="flex justify-between items-stretch grow px-4">
            <div className="logo flex items-center gap-1">
              <span className="w-16">
                <img className="w-full" src="logo-blue-2.png" alt="" />
              </span>
              <span className="text-primary text-xl font-bold">SharkStage</span>
            </div>
            <div className="navlinks hidden lg:flex gap-1 text-lg self-stretch">
              {navlinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center px-4 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="icons hidden md:flex items-center gap-4">
              <LanguageIcon className="cursor-pointer" />
              <WbSunnyOutlinedIcon className="cursor-pointer" />
            </div>
            <div
              onClick={handleToggle}
              className="cursor-pointer md:hidden flex items-center"
            >
              <Menu />
            </div>
          </div>

          <div
            className={`md:hidden w-full bg-background flex flex-col gap-4 items-center overflow-hidden transition-all duration-300 ${
              res ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
            }`}
          >
            {navlinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center px-4 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/sign/in"
              className="bg-primary text-lg  text-white rounded-lg px-4 py-2 cursor-pointer"
            >
              Login <LoginIcon />
            </Link>
            <div className="icons flex md:hidden items-center gap-4">
              <LanguageIcon className="cursor-pointer" />
              <WbSunnyOutlinedIcon className="cursor-pointer" />
            </div>
          </div>
        </div>
        <Link
          href="/sign/in"
          className="bg-primary text-lg max-md:hidden text-white border-2 rounded-e-lg border-primary hover:text-primary transition-colors hover:bg-transparent px-8 py-4 cursor-pointer"
        >
          Login <LoginIcon />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
