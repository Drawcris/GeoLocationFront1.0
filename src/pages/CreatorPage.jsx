import React from 'react';
import { FaGithub, FaLinkedin, FaReact, FaDatabase, FaBootstrap, FaMicrosoft, } from 'react-icons/fa';
import { SiTailwindcss, SiDotnet, SiVite, SiPostman, SiJavascript } from 'react-icons/si';
import { TbBrandCSharp } from "react-icons/tb";
import { TbApi } from 'react-icons/tb';
import { VscCode } from 'react-icons/vsc';

function CreatorPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 ">
      <div className="container mx-auto p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">O twórcy</h1>
          <p className="text-lg mb-4">
            Projekt został stworzony przez Macieja Małutowskiego.
          </p>
          <div className="flex items-center space-x-4 mb-4">
            <a href="https://github.com/Drawcris" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black">
              <FaGithub size={30} />
            </a>
            <a href="https://linkedin.com/in/mmalutowski" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
              <FaLinkedin size={30} />
            </a>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Użyte technologie</h2>
          <ul className="list-disc list-inside space-y-2">
            <li className="flex items-center space-x-2">
              <FaReact size={24} className="text-blue-500" />
              <span>React</span>
            </li>
            <li className="flex items-center space-x-2">
              <SiVite size={24} className="text-purple-500" />
              <span>Vite</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaBootstrap size={24} className="text-purple-600" />
              <span>Bootstrap</span>
            </li>
            <li className="flex items-center space-x-2">
              <SiTailwindcss size={24} className="text-teal-500" />
              <span>Tailwind CSS</span>
            </li>
            <li className="flex items-center space-x-2">
            <img src="/shadcnui.png" alt="TomTom API" className="w-6 h-6" />
            <span>shadcnui</span>
            </li>           
            <li className="flex items-center space-x-2">
              <FaDatabase size={24} className="text-gray-700" />
              <span>SQL</span>
            </li>
            <li className="flex items-center space-x-2">
              <SiDotnet size={24} className="text-purple-500" />
              <span>ASP.NET</span>
            </li>
            <li className="flex items-center space-x-2">
              <VscCode size={24} className="text-blue-500" />
              <span>Visual Studio Code</span>
            </li>
            <li className="flex items-center space-x-2">
            <FaMicrosoft size={24} className="text-blue-500" />
            <span>Visual Studio 2022</span>
            </li>
            <li className="flex items-center space-x-2">
              <TbApi size={24} className="text-gray-700" />
              <span>RestAPI</span>
            </li>
            <li className="flex items-center space-x-2">
              <SiPostman size={24} className="text-orange-500" />
              <span>Postman</span>
            </li>
            <li className="flex items-center space-x-2">
              <img src="/tomtomicon.png" alt="TomTom API" className="w-6 h-6" />
              <span>TomTom API</span>
            </li>
            <li className="flex items-center space-x-2">
            <SiJavascript size={24} className="text-orange-500" />
              <span>JavaScript</span>
            </li>
            <li className="flex items-center space-x-2">
            <TbBrandCSharp size={24} className="text-orange-500" />
              <span>C#</span>
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Linki do repozytoriów</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <a href="https://github.com/Drawcris/GeoLocationFront" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Frontend - React 
              </a>
            </li>
            <li>
              <a href="https://github.com/Drawcris/GeoLocationAPI" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Backend - ASP .NET
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}

export default CreatorPage;