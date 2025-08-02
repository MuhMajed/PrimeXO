import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon, VolumeUpIcon, VolumeOffIcon, CloseIcon } from './Icons';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen, onClose, theme, setTheme, soundEnabled, setSoundEnabled
}) => {
  if (!isOpen) return null;
  
  const TonalButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
     <button 
        onClick={onClick} 
        className={`p-2 rounded-full color-transition ${isActive ? 'bg-[rgb(var(--primary))] text-white' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
     >
        {children}
    </button>
  )

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[rgb(var(--surface))] rounded-2xl shadow-2xl p-6 w-full max-w-sm m-4 relative pop-in color-transition"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <CloseIcon className="w-6 h-6"/>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Options</h2>
        
        <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Theme</span>
              <div className="flex items-center bg-[rgb(var(--surface-variant))] rounded-full p-1 color-transition">
                <TonalButton isActive={theme === 'light'} onClick={() => setTheme('light')}>
                  <SunIcon className="w-6 h-6"/>
                </TonalButton>
                <TonalButton isActive={theme === 'dark'} onClick={() => setTheme('dark')}>
                  <MoonIcon className="w-6 h-6"/>
                </TonalButton>
              </div>
            </div>
            
            {/* Sound Toggle */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Sound</span>
               <div className="flex items-center bg-[rgb(var(--surface-variant))] rounded-full p-1 color-transition">
                <TonalButton isActive={soundEnabled} onClick={() => setSoundEnabled(true)}>
                  <VolumeUpIcon className="w-6 h-6"/>
                </TonalButton>
                <TonalButton isActive={!soundEnabled} onClick={() => setSoundEnabled(false)}>
                  <VolumeOffIcon className="w-6 h-6"/>
                </TonalButton>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;