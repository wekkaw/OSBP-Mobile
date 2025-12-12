
import React, { useState } from 'react';

interface IntroVideoProps {
  onClose: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('osbp_intro_video_seen', 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-lg bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700 relative group">
             {/* 
                Placeholder video URL. 
                Replace 'src' with your specific NASA video URL. 
             */}
             <video 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" 
                autoPlay 
                muted 
                playsInline
                controls 
                className="w-full h-auto aspect-video object-cover"
                onEnded={handleClose}
            >
                Your browser does not support the video tag.
            </video>
            
            <button 
                onClick={handleClose}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Close video"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-6 w-full max-w-xs">
            <button 
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors group w-full"
             >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${dontShowAgain ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 group-hover:border-slate-300'}`}>
                    {dontShowAgain && (
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <span className="font-medium select-none">Don't show this again</span>
             </button>

            <button 
                onClick={handleClose}
                className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-white/10"
            >
                Skip Video
            </button>
        </div>
    </div>
  );
};

export default IntroVideo;
