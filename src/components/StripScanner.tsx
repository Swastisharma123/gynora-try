import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { callAI } from '@/lib/ai';

interface StripScannerProps {
  onScanComplete: (results: {
    glucose: string;
    ph: string;
    cortisol: string;
    salt: string;
  }) => void;
  onClose: () => void;
}

export const StripScanner: React.FC<StripScannerProps> = ({ onScanComplete, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Please allow camera access to scan your kit.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      
      try {
        const prompt = `Analyze this Gynora 4-in-1 test strip image. 
        Detect the colors for the 4 zones: Cortisol, Glucose, pH, and Salt.
        Return ONLY a raw JSON object (no backticks) with these keys and the color names as values.
        Example: {"cortisol": "Dark Brown", "glucose": "No Color", "ph": "Purple", "salt": "Dense White"}`;
        
        const aiResponse = await callAI(prompt, imageData);
        
        // Find JSON in response
        const jsonMatch = aiResponse.match(/\{.*\}/s);
        if (jsonMatch) {
          const results = JSON.parse(jsonMatch[0]);
          onScanComplete(results);
          toast({
            title: "Scan Successful",
            description: "Colors detected and filled into the form.",
          });
          onClose();
        } else {
          throw new Error("Could not detect strip zones. Please try again with better lighting.");
        }
      } catch (error: any) {
        toast({
          title: "Analysis Failed",
          description: error.message || "Please ensure the strip is clearly visible and try again.",
          variant: "destructive"
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-black tracking-tight">Kit Scanner</h2>
            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">AI Vision Enabled</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Card className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 border-2 border-purple-500/30 rounded-3xl shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-10 border-2 border-dashed border-white/30 rounded-2xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-1/4 border-2 border-purple-500 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.5)]">
               <div className="absolute top-0 left-0 w-full h-0.5 bg-purple-400 shadow-[0_0_15px_#a855f7] animate-[scan_2s_infinite]"></div>
            </div>
          </div>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-md flex flex-center flex-col items-center justify-center text-white p-6 text-center">
              <RefreshCw className="w-12 h-12 animate-spin mb-4 text-purple-300" />
              <p className="font-black text-sm uppercase tracking-widest">Analyzing Strip...</p>
              <p className="text-[10px] mt-2 opacity-70">Detecting chemical biomarkers</p>
            </div>
          )}
        </Card>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
           <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-2 flex items-center">
             <Zap className="w-3 h-3 mr-2 text-yellow-400" /> Scan Tip
           </p>
           <p className="text-xs text-white/90 leading-relaxed">
             Hold the strip horizontally within the purple box. Ensure the colors are well-lit.
           </p>
        </div>

        <Button
          onClick={captureAndAnalyze}
          disabled={isAnalyzing}
          className="w-full h-16 gradient-wellness text-white text-lg font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
        >
          {isAnalyzing ? "Processing..." : "Capture Strip"}
        </Button>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};
