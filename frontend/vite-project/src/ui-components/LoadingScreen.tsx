import logo from "../assets/logo.png";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f8fafc] z-50">
      <div className="relative flex flex-col items-center space-y-6">
        {/* Logo Container with Pulse Effect */}
        <div className="relative w-48 h-48 animate-pulse">
            <div className="absolute inset-0 bg-[#1E5BBE]/10 rounded-full blur-3xl"></div>
            <img 
            src={logo} 
            alt="STS Logo" 
            className="relative w-full h-full object-contain"
            />
        </div>
        
        {/* Text / Loading Indicator */}
        <div className="flex flex-col items-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">Loading STS</h2>
            <div className="flex space-x-1.5 pt-2">
                <div className="w-2 h-2 bg-[#1E5BBE] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#1E5BBE] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#1E5BBE] rounded-full animate-bounce"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
