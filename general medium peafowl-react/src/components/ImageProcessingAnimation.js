import React, { useState, useEffect } from 'react';

const ImageProcessingAnimation = ({ isVisible = true, processingTime = 5 }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const processingPhases = [
    "Analyzing image...",
    "Detecting tattoo style...",
    "Identifying key elements...",
    "Matching with artists...",
    "Finalizing results..."
  ];
  
  useEffect(() => {
    if (!isVisible) return;
    
    const increment = 100 / (processingTime * 10);
    const phaseIncrement = processingTime / processingPhases.length;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => {
        const nextPhase = prev + 1;
        return nextPhase >= processingPhases.length ? processingPhases.length - 1 : nextPhase;
      });
    }, phaseIncrement * 1000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [isVisible, processingTime, processingPhases.length]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-xl bg-gray-900 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
        <div className="relative h-16 mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/50 via-purple-600/50 to-fuchsia-800/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-xl font-bold text-white text-center tracking-wider">
              AI STYLE ANALYSIS
            </h3>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute w-32 h-32 -top-16 -left-16 rounded-full bg-purple-600/20 blur-xl"></div>
            <div className="absolute w-24 h-24 -bottom-12 -right-12 rounded-full bg-fuchsia-600/20 blur-xl"></div>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
              <path d="M60 30V80" stroke="white" strokeWidth="3" strokeLinecap="round" className="animate-dash"/>
              <path d="M50 25H70" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
              <path d="M55 20H65" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
              <rect x="55" y="35" width="10" height="20" rx="2" fill="#a855f7" />
              <rect x="53" y="55" width="14" height="5" rx="1" fill="white" />
              <circle cx="60" cy="85" r="5" fill="#a855f7" className="animate-blink">
                <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
            
            <div className="absolute left-0 top-0 w-full h-full overflow-hidden">
              <div className="w-full h-2 bg-purple-500/50 blur-sm absolute" style={{
                top: `${progress}%`,
                animation: 'scan 1s ease-in-out infinite alternate',
                boxShadow: '0 0 10px #a855f7, 0 0 20px #a855f7'
              }}></div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-white text-lg font-medium h-8">
            {processingPhases[currentPhase]}
          </p>
        </div>
        
        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600"
            style={{ width: `${progress}%`, transition: 'width 0.2s ease' }}
          ></div>
        </div>
        
        <p className="text-gray-400 text-sm text-center">
          Our AI is analyzing your tattoo to find matching artists. Please wait...
        </p>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { opacity: 0.5; transform: translateY(-2px); }
          100% { opacity: 0.8; transform: translateY(2px); }
        }
        
        @keyframes dash {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        
        .animate-dash {
          stroke-dasharray: 20;
          animation: dash 1s linear infinite;
        }
        
        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ImageProcessingAnimation;