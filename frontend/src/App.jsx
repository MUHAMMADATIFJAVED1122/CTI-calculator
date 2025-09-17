import React from "react";
import Calculator from "./pages/Calculator";
import { School } from "@mui/icons-material";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🌟 Fancy Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
        <div className="flex flex-col items-center py-6 space-y-2">
          <div className="flex items-center space-x-2">
            <School fontSize="large" />
            <h1 className="text-3xl font-extrabold tracking-wide">
              CTI Merit Calculator
            </h1>
          </div>
          <p className="text-base opacity-90">
            Calculate merit for <span className="font-semibold">BS</span> &{" "}
            <span className="font-semibold">Community Colleges</span>
          </p>
        </div>
      </header>

      {/* Calculator Page */}
      <main className="container mx-auto p-4">
        <Calculator />
      </main>
    </div>
  );
};

export default App;
