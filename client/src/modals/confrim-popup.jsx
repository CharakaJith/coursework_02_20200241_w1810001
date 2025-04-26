function ConfirmPopup({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-[400px] md:w-[500px] transform transition-all duration-300 ease-in-out text-center">
        {/* title and content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600 mb-8 whitespace-nowrap overflow-hidden text-ellipsis">{message}</p>

        {/* buttons */}
        <div className="flex justify-center gap-4">
          {/* cancel button */}
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full bg-[#2ABE3D] text-gray-700 hover:bg-[#1E952E] font-semibold transition duration-200 cursor-pointer"
          >
            Cancel
          </button>

          {/* confirm button */}
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-full bg-[#BE3D2A] text-white hover:bg-[#952E1E] font-semibold transition duration-200 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPopup;
