import { createContext, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [font, setFont] = useState("sans");

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, font, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
}
