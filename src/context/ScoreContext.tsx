import React, { createContext, useState, useContext } from "react";

interface ScoreContextType {
  pcosScore: number;
  setPcosScore: React.Dispatch<React.SetStateAction<number>>;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pcosScore, setPcosScore] = useState(0);

  return (
    <ScoreContext.Provider value={{ pcosScore, setPcosScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};
