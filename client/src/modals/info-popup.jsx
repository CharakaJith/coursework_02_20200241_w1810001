import { useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';

function InfoPopup({ isOpen, message, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      if (onClose) onClose();

      // remove session message
      sessionStorage.removeItem('message');
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 bg-[#213448] text-white font-bold z-[60] text-xl p-4 rounded-lg shadow-lg max-w-md w-full flex items-start gap-3 
      transform transition-all duration-300 ease-in-out 
      ${isClosing ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}
    >
      <div className="flex-1 overflow-auto max-h-40 pr-2">
        <p className="text-base leading-relaxed">{message}</p>
      </div>
      <button onClick={handleClose} className="text-[#94B4C1] hover:text-[#547792] shrink-0 mt-1 cursor-pointer">
        <CircleX />
      </button>
    </div>
  );
}

export default InfoPopup;
