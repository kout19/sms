import {useState} from "react";
import { GraduationCap, Menu, X } from "lucide-react";

const Navebar = () => {
  const [isMenuOpen, setIsMenuOpen] =useState(false);
    const toggleMenu= () =>{
      setIsMenuOpen(!isMenuOpen)
    }
  return (
    <header className="bg-white w-full sticky top-0 z-50 border-b border-slate-300">
      <div className=" max-w-7xl mx-auto  px-6  h-16 flex items-center justify-between  ">
        {/* Logo section */}
        <div className=" flex items-center gap-2 ">
          <div className="h-10 w-10  flex justify-center items-center bg-indigo-600 text-white rounded-xl">
            <GraduationCap size={20} className=" h-5 w-5" />
          </div>
          <span className="tracking-tight hover:text-indigo-600 font-bold text-2xl cursor-pointer">
            EduSystems
          </span>
        </div>
        {/* Navigation links */}
        <nav className="hidden md:flex  flex items-center gap-6 text-sm">
          <a
            href="#features"
            className="hover:text-indigo-600 text-sm transition-colors"
          >
            Features
          </a>
          <a
            href="#solutions"
            className="hover:text-indigo-600 text-sm transition-colors"
          >
            Solutions
          </a>
          <a
            href="#pricing"
            className="hover:text-indigo-600 text-sm transition-colors"
          >
            Pricing
          </a>
        </nav>
        {/* Sign in button */}
        <div className="hidden md:block">
          <button className="cursor-pointer text-indigo-600 font-semibold hover:text-indigo-600 transition-colors text-sm">
            Sign In
          </button>
        </div>
        {/* Mobile humburger  toogle button( hiiden in desktop) */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => toggleMenu()}
            className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none cursor-poiinter"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile menu (hidden in desktop) */}
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 space-y-4 py-4 shadow-lg absolute w-full left-0 ">
          <nav className="flex flex-col gap-4 space-y-4 z-50">
            <a
              href="#features"
              className=""
              onclick={() => setIsMenuOpen(false)}
              className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors"
            >
              Features
            </a>
            <a href="#solutions"
            onclick= {() => setIsMenuOpen(false)}
          className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors">
              Solutions
              </a>      
            <a href ="#Pricing"
            onclick= {() => setIsMenuOpen(false)}
            className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors">
              Pricing
              </a>     
          </nav>
          <div className="border-1 border-indigo-600 rounded-md p-2 flex justify-center flex-col gap-4">
            <button className="cursor-pointer text-indigo-600  hover:text-indigo-600 transition-colors text-sm font-bold">
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navebar;
