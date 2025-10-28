import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, FlaskConical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SweatAnalysis = () => {
  const [glucose, setGlucose] = useState('');
  const [ph, setPh] = useState('');
  const [cortisol, setCortisol] = useState('');
  const [salt, setSalt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [pcosScore, setPcosScore] = useState<number | null>(null);
  const { toast } = useToast();

  const generateFakeAIResponse = (glucose: string, ph: string, cortisol: string, salt: string) => {
  return `
Based on your sweat strip results, here’s an analysis:

💧 Glucose Zone: The color "${glucose}" suggests moderate glucose presence, possibly linked with mild insulin resistance — common in early hormonal imbalance.
🌸 pH Zone: "${ph}" indicates your skin pH is slightly ${ph.toLowerCase().includes('pink') ? 'acidic' : 'neutral'}, which might hint at temporary metabolic stress.
😮‍💨 Cortisol Zone: "${cortisol}" suggests mild stress elevation. Chronic stress can affect ovulation and hormone regulation.
🧂 Salt Zone: "${salt}" shows electrolyte fluctuation, which can occur during dehydration or hormonal shifts.

✨ Interpretation: These results indicate a mild to moderate hormonal imbalance. While not diagnostic, such readings may correlate with early signs of PCOS or metabolic changes.

Lifestyle Tips:
1. Add more fiber-rich foods like oats, fruits, and greens to stabilize glucose.
2. Stay hydrated — at least 2.5L water daily.
3. Prioritize 7–8 hours of sleep; cortisol balance improves with rest.
4. Include light workouts like yoga or skating for stress reduction.
5. Avoid processed snacks; choose nuts or fruits instead.

Remember, this is not a medical diagnosis — just a wellness insight to guide healthy habits 💕
  `.trim();
};

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
    setTimeout(() => {
      const fakeScore = Math.floor(Math.random() * 40) + 50; // random 50–90%
      const fakeInsight = generateFakeAIResponse(glucose, ph, cortisol, salt);
      setPcosScore(fakeScore);
      setAiResult(fakeInsight);
      toast({
        title: "Analysis Complete",
        description: "Your sweat analysis has been generated!",
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
          <FlaskConical className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">Sweat Analysis</h2>
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
        <Card className="p-6 mt-4">
          <h3 className="font-semibold text-purple-700 mb-2">PCOS Risk Score</h3>
          <p className="text-3xl font-bold text-purple-600">{pcosScore}%</p>
        </Card>
      )}

      {aiResult && (
        <Card className="p-6 mt-4">
          <h3 className="font-semibold mb-3 flex items-center text-purple-700">
            <Sparkles className="w-5 h-5 mr-2" /> AI Insight
          </h3>
          <p className="text-sm whitespace-pre-wrap text-gray-800">{aiResult}</p>
        </Card>
      )}
    </div>
  );
};

export default SweatAnalysis;
