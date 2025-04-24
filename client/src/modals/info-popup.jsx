import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';

function InfoPopup({ isOpen, message }) {
  const [infoVisible, setInfoVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setInfoVisible(false);

      // remove session message
      sessionStorage.removeItem('message');
    }, 1000);
  };

  // close after 5 seconds
  useEffect(() => {
    if (isOpen && infoVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, infoVisible]);

  if (!isOpen || !infoVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 bg-[#213448] text-white font-bold text-xl p-4 rounded-lg shadow-lg max-w-md w-full flex items-start gap-3 z-50 
      transform transition-all duration-300 ease-in-out 
      ${isClosing ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}
    >
      <div className="flex-1 overflow-auto max-h-40 pr-2">
        <p className="text-base leading-relaxed">{message}</p>
      </div>
      <button onClick={handleClose} className="text-[#94B4C1] hover:text-[#547792] shrink-0 mt-1">
        <CircleX />
      </button>
    </div>
  );
}

export default InfoPopup;
