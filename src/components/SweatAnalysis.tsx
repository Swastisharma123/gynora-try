import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useScans } from '@/hooks/useScans';
import { History, Sparkles, FlaskConical, AlertCircle, TrendingUp, Camera } from 'lucide-react';
import { StripScanner } from '@/components/StripScanner';
import ReactMarkdown from 'react-markdown';

const SweatAnalysis = () => {
  const [glucose, setGlucose] = useState('');
  const [ph, setPh] = useState('');
  const [cortisol, setCortisol] = useState('');
  const [salt, setSalt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [pcosScore, setPcosScore] = useState<number | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();
  const { addScan, scans } = useScans();


  const { addScan, scans } = useScans();



  const handleAnalyze = async () => {
    if (!glucose || !ph || !cortisol || !salt) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all test results.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { callAI } = await import('@/lib/ai');

      // Clinical Score Calculation based on User Manual
      const calculateClinicalScore = () => {
        let totalScore = 0;
        let count = 0;

        const checkRisk = (val: string, low: string[], med: string[], high: string[]) => {
          const v = val.toLowerCase();
          if (high.some(k => v.includes(k))) return 90;
          if (med.some(k => v.includes(k))) return 50;
          if (low.some(k => v.includes(k))) return 15;
          return 30; // Default baseline
        };

        totalScore += checkRisk(cortisol, ["dark brown"], ["light brown"], ["faded", "no color", "none"]);
        totalScore += checkRisk(glucose, ["no color", "faint", "clear"], ["light blue", "pale brown"], ["deep blue", "dark brown"]);
        totalScore += checkRisk(ph, ["purple"], ["pink", "green"], ["bright pink", "strong", "blue"]);
        totalScore += checkRisk(salt, ["clear", "faint"], ["slight white", "cloud"], ["dense", "white cloud"]);

        return Math.round(totalScore / 4);
      };

      const clinicalScore = calculateClinicalScore();

      const prompt = `You are Gynora's Clinical AI. Analyze these sweat/saliva results based on the Gynora 4-in-1 manual:
- Cortisol: ${cortisol}
- Glucose: ${glucose}
- pH: ${ph}
- Salt/Electrolytes: ${salt}

Clinical Guidelines:
1. Cortisol: Dark Brown is Normal. No Color is High Risk.
2. Glucose: No Color is Normal. Dark Brown/Deep Blue is High Risk.
3. pH: Purple is Normal. Bright Pink/Strong Green is High Risk.
4. Salt: Clear is Normal. Dense White Cloud is High Risk.

CRITICAL INSTRUCTION:
DO NOT use markdown tables. DO NOT use pipes (|) or dashes (---). 
Format your response exactly like this:

**Cortisol:** [Your analysis here]
**Glucose:** [Your analysis here]
**pH:** [Your analysis here]
**Salt:** [Your analysis here]

End with "This is not a medical diagnosis."`;

      const aiResponseText = await callAI(prompt);

      setPcosScore(clinicalScore);
      setAiResult(aiResponseText);

      // Save to History
      await addScan({
        acne_score: clinicalScore, // Using acne_score slot for sweat risk
        facial_hair_score: 0,
        pigmentation_score: 0,
        overall_improvement: 0,
        scan_date: new Date().toISOString(),
        recommendations: [aiResponseText.slice(0, 150) + "..."]
      });

      toast({
        title: "Analysis Complete",
        description: "Your results have been analyzed based on clinical guidelines.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to generate AI analysis.",
        variant: "destructive",
        description: "Your results have been analyzed based on clinical guidelines.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to generate AI analysis.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }
  setIsLoading(false);
};

return (
  <div className="space-y-6 pb-24">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
        <FlaskConical className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-purple-600 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500" style={{ WebkitTextFillColor: 'transparent' }}>Sweat Analysis</h2>
      <h2 className="text-2xl font-bold text-purple-600 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500" style={{ WebkitTextFillColor: 'transparent' }}>Sweat Analysis</h2>
      <p className="text-gray-600">Log your DIY strip result to get PCOS insights</p>
      <a
        href="https://drive.google.com/file/d/1NsiOcFGK-1Lj9qBSwivIWln9QgM8MnHf/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 italic underline"
      >
        Gynora Sweat Analysis Manual
      </a>
    </div>

    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => setShowScanner(true)}
        className="h-14 w-full max-w-sm gradient-wellness text-white shadow-lg border-0 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
      >
        <Camera className="w-5 h-5" />
        Scan My Kit (AI)
      </Button>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or enter manually below</p>
    </div>

    {showScanner && (
      <StripScanner
        onClose={() => setShowScanner(false)}
        onScanComplete={(results) => {
          setGlucose(results.glucose || "");
          setPh(results.ph || "");
          setCortisol(results.cortisol || "");
          setSalt(results.salt || "");
        }}
      />
    )}

    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => setShowScanner(true)}
        className="h-14 w-full max-w-sm gradient-wellness text-white shadow-lg border-0 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
      >
        <Camera className="w-5 h-5" />
        Scan My Kit (AI)
      </Button>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or enter manually below</p>
    </div>

    {showScanner && (
      <StripScanner
        onClose={() => setShowScanner(false)}
        onScanComplete={(results) => {
          setGlucose(results.glucose || "");
          setPh(results.ph || "");
          setCortisol(results.cortisol || "");
          setSalt(results.salt || "");
        }}
      />
    )}

    <Card className="p-6 space-y-4">
      <div>
        <label className="block font-medium mb-1">Glucose Zone Result</label>
        <Input
          placeholder="e.g., Dark Blue, No Color"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">pH Zone Result</label>
        <Input
          placeholder="e.g., Pink, Green, Purple"
          value={ph}
          onChange={(e) => setPh(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Cortisol Zone Result</label>
        <Input
          placeholder="e.g., Dark Brown, Faint, No Color"
          value={cortisol}
          onChange={(e) => setCortisol(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Salt Zone Result</label>
        <Input
          placeholder="e.g., Light Brown, Yellow, Dark"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
        />
      </div>

      <Button
        onClick={handleAnalyze}
        className="gradient-rose text-white w-full mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Analyze Sweat Result"}
      </Button>
    </Card>

    {pcosScore !== null && (
      <Card className="p-6 mt-4 border-0 shadow-xl bg-white animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Sweat Analysis Result</h3>
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Biomarker Risk
          </div>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-purple-100 flex items-center justify-center">
              <span className="text-4xl font-black text-purple-600">{pcosScore}%</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
              Score
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <h4 className="text-xs font-bold text-purple-800 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" /> AI Wellness Insight
            </h4>
            <div className="text-xs text-purple-700 leading-relaxed prose prose-sm prose-purple max-w-none">
              <ReactMarkdown>{aiResult}</ReactMarkdown>
            </div>
          </div>

          {/* History Section for Sweat Analysis */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 mb-4 flex items-center uppercase tracking-widest">
              <History className="w-4 h-4 mr-2 text-gray-400" /> Previous Biomarker History
            </h4>
            <div className="space-y-2">
              {scans.filter(s => s.facial_hair_score === 0).slice(0, 3).map((scan, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-medium text-gray-500">
                    {new Date(scan.scan_date || scan.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-purple-600">{scan.acne_score}%</span>
                    <TrendingUp className="w-3 h-3 text-purple-400" />
                  </div>
                </div>
              ))}
              {scans.filter(s => s.facial_hair_score === 0).length === 0 && (
                <p className="text-[10px] text-gray-400 italic text-center py-2">No previous biomarker history found.</p>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={() => { setPcosScore(null); setAiResult(''); }}
          variant="outline"
          className="w-full mt-6 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl"
        >
          New Analysis
        </Button>
      </Card>
    )}
  </div>
);
};

export default SweatAnalysis;
