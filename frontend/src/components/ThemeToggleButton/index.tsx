import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant={"ghost"}
      size={"icon"}
    >
      {theme === 'light' ? <Moon/> : <Sun/>}
    </Button>
  );
};

export default ThemeToggleButton;
