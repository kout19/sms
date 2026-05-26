import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-gray-100 text-black py-6 md:px-16  ">
      <div className="md:flex md:px-12 md:justify-between  px-4 mr-24 ">
        <div className="">
        <div className="inner-container px-4 flex items-center gap-2">
          <div className="flex items-center justify-center bg-indigo-600 text-white  rounded-xl w-10 h-10 mb-4">
            <GraduationCap className="text-white cursor-pointer" size={24} />
          </div>
          <h3 className="font-bold text-lg tracking-tight cursor-pointer">
            EduSystems
          </h3>
        </div>
        <span className="text-sm text-gray-600 ml-auto inline-block mb-3 px-4">
          Modern school management platform for the digital age.
        </span>
        </div>

        <div className="px-4">
          <h2 className="font-semibold mb-3 text-slate-800">Product</h2>
          <ul className="text-gray-600 text-sm mb-6">
            <li>Features</li>
            <li>Pricing</li>
            <li>Security</li>
            <li>Integrations</li>
          </ul>
        </div>
        <div className="px-4">
          <h2 className="font-semibold mb-3 text-slate-800">Company</h2>
          <ul className="text-gray-600 text-sm mb-6">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Blog</li>
          </ul>
        </div>
        <div className="px-4">
          <h2 className="font-semibold mb-3 text-slate-800">Resources</h2>
          <ul className="text-gray-600 text-sm mb-6">
            <li>Help Center</li>
            <li>Documentation</li>
            <li>Community</li>
            <li>Status</li>
          </ul>
        </div>
      </div>
      <div className=" md:flex md:justify-between md:px-16 items-center  px-4 text-center py-8 border-t border-gray-300 ">
        <span className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} EduSystems. All rights reserved.
        </span>
        <div className=" flex items-center justify-center gap-4 mt-4 md:mt-0 text-slate-600 md:px-6">
          <span className=" cursor-pointer">Privacy </span>
          <span className="cursor-pointer">Terms</span>
          <span className="cursor-pointer">Cookies</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
