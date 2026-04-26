
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, AlertCircle, TrendingUp, Users, Lightbulb } from 'lucide-react';

const EducationPage = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const topics = [
    {
      title: "Understanding PCOS",
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
      description: "Learn the basics about Polycystic Ovary Syndrome",
      url: "https://askpcos.org/"
    },
    {
      title: "PCOD vs PCOS",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      description: "Understand the differences between PCOD and PCOS",
      url: "https://www.unicef.org/india/stories/do-pcod-and-pcos-mean-same-thing-or-are-they-different"
    },
    {
      title: "Symptoms & Signs",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
      description: "Recognize early warning signs and symptoms",
      url: "https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439"
    },
    {
      title: "Management Tips",
      icon: Lightbulb,
      color: "bg-pink-50 text-pink-600",
      description: "Lifestyle changes and management strategies",
      url: "https://www.mayoclinic.org/diseases-conditions/pcos/diagnosis-treatment/drc-20353443"
    }
  ];

  const myths = [
    {
      myth: "PCOS only affects overweight women",
      fact: "PCOS can affect women of all body types and weights. While weight gain is common, lean women can also have PCOS."
    },
    {
      myth: "You can't get pregnant with PCOS",
      fact: "While PCOS can make conception more challenging, many women with PCOS do conceive naturally or with treatment."
    },
    {
      myth: "PCOS will go away on its own",
      fact: "PCOS is a lifelong condition, but symptoms can be effectively managed with proper treatment and lifestyle changes."
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 gradient-gentle rounded-full mx-auto mb-3 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">PCOS/PCOD Education</h2>
        <p className="text-gray-600">Learn everything you need to know</p>
      </div>

      {/* Quick Topics */}
      <div className="grid grid-cols-2 gap-4">
        {topics.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <a key={index} href={(topic as any).url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full border-purple-50/50">
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${topic.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{topic.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{topic.description}</p>
                </div>
              </Card>
            </a>
          );
        })}
      </div>

      {/* What is PCOS */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-600" />
          What is PCOS?
        </h3>
        <div className="space-y-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age.
            It affects how the ovaries work and can cause irregular periods, excess androgen (male hormones),
            and polycystic ovaries.
          </p>
          <div className="bg-purple-50 p-4 rounded-xl">
            <h4 className="font-medium text-purple-800 mb-2">Key Statistics</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Affects 1 in 10 women of childbearing age</li>
              <li>• Leading cause of infertility in women</li>
              <li>• Often goes undiagnosed for years</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* PCOD vs PCOS */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">PCOD vs PCOS: What's the Difference?</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100/50">
            <h4 className="font-medium text-purple-800 mb-2">PCOD (Polycystic Ovarian Disease)</h4>
            <p className="text-sm text-purple-700">
              A condition where ovaries produce many immature eggs which turn into cysts.
              Usually milder and more manageable with lifestyle changes.
            </p>
          </div>
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-100/50">
            <h4 className="font-medium text-pink-800 mb-2">PCOS (Polycystic Ovary Syndrome)</h4>
            <p className="text-sm text-pink-700">
              A metabolic disorder that affects hormones, metabolism, and fertility.
              More serious condition requiring comprehensive management.
            </p>
          </div>
        </div>
      </Card>

      {/* Common Symptoms */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Common Symptoms</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Irregular periods", "Weight gain", "Acne", "Hair loss",
            "Excessive hair growth", "Mood changes", "Sleep problems", "Skin darkening"
          ].map((symptom, index) => (
            <div key={index} className="flex items-center p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">{symptom}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Myth Busters */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
          Myth Busters
        </h3>
        <div className="space-y-4">
          {myths.map((item, index) => (
            <div key={index} className="border-l-4 border-red-400 pl-4">
              <p className="text-sm font-medium text-red-800 mb-1">❌ Myth: {item.myth}</p>
              <p className="text-sm text-green-700">✅ Fact: {item.fact}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Management Tips */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Management & Treatment</h3>
        <div className="space-y-3">
          <div className="p-4 bg-pink-50 rounded-xl border border-pink-100/50">
            <h4 className="font-medium text-pink-800 mb-2">🥗 Diet & Nutrition</h4>
            <p className="text-sm text-pink-700">Focus on low-glycemic foods, increase fiber intake, and maintain regular meal times.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100/50">
            <h4 className="font-medium text-purple-800 mb-2">🏃‍♀️ Exercise</h4>
            <p className="text-sm text-purple-700">Regular cardio and strength training can improve insulin sensitivity and hormone balance.</p>
          </div>
          <div className="p-4 bg-pink-50 rounded-xl border border-pink-100/50">
            <h4 className="font-medium text-pink-800 mb-2">💊 Medical Treatment</h4>
            <p className="text-sm text-pink-700">Hormonal birth control, metformin, and other medications as prescribed by your doctor.</p>
          </div>
        </div>
      </Card>

      {/* Skin Care Routines */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          Skin Care Routines for PCOS
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
            <h4 className="font-medium text-pink-800 mb-2">Morning Routine (Protect)</h4>
            <ul className="text-sm text-pink-700 space-y-2">
              <li><strong>1. Gentle Cleanse:</strong> Use a non-comedogenic cleanser to remove overnight oils without stripping moisture.</li>
              <li><strong>2. Targeted Treatment:</strong> Apply a Vitamin C serum or Azelaic acid to help with pigmentation and active breakouts.</li>
              <li><strong>3. Moisturize:</strong> Use a lightweight, oil-free moisturizer to maintain the skin barrier.</li>
              <li><strong>4. SPF:</strong> Mandatory! Use broad-spectrum SPF 30+ to prevent darkening of pigmentation spots.</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100/50">
            <h4 className="font-medium text-purple-800 mb-2">Evening Routine (Repair)</h4>
            <ul className="text-sm text-purple-700 space-y-2">
              <li><strong>1. Double Cleanse:</strong> Use a cleansing balm followed by your water-based cleanser to remove sunscreen and grime.</li>
              <li><strong>2. Actives:</strong> Consider Salicylic Acid (BHA) for acne or Niacinamide for sebum control and pores.</li>
              <li><strong>3. Hydration:</strong> Use a slightly richer moisturizer or a sleeping mask to help skin repair overnight.</li>
            </ul>
          </div>
          <div className="p-3 bg-pink-50 rounded-xl border border-pink-100/50">
            <p className="text-[10px] text-pink-800 italic"><strong>Tip:</strong> Always patch test new products and consult your dermatologist before starting high-strength retinoids.</p>
          </div>
        </div>
      </Card>

      {/* Credible Articles */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Credible Articles
        </h3>
        <div className="space-y-4">
          <a href="https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome" target="_blank" rel="noreferrer" className="block p-4 border border-purple-50 rounded-xl hover:bg-purple-50 transition">
            <h4 className="font-medium text-purple-800 mb-1">WHO: PCOS Fact Sheet</h4>
            <p className="text-xs text-gray-600">Global health authority perspective on PCOS prevalence, symptoms, and diagnosis.</p>
          </a>
          <a href="https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/" target="_blank" rel="noreferrer" className="block p-4 border border-purple-50 rounded-xl hover:bg-purple-50 transition">
            <h4 className="font-medium text-purple-800 mb-1">NHS (UK): Comprehensive Guide</h4>
            <p className="text-xs text-gray-600">In-depth guide on clinical treatments and living with PCOS from the National Health Service.</p>
          </a>
          <a href="https://www.aad.org/public/diseases/a-z/pcos-overview" target="_blank" rel="noreferrer" className="block p-4 border border-purple-50 rounded-xl hover:bg-purple-50 transition">
            <h4 className="font-medium text-purple-800 mb-1">American Academy of Dermatology</h4>
            <p className="text-xs text-gray-600">Specialized article on managing hormonal acne and skin changes associated with PCOS.</p>
          </a>
          <a href="https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439" target="_blank" rel="noreferrer" className="block p-4 border border-purple-50 rounded-xl hover:bg-purple-50 transition">
            <h4 className="font-medium text-purple-800 mb-1">Mayo Clinic: Symptoms & Causes</h4>
            <p className="text-xs text-gray-600">Expert medical insights into the hormonal imbalances and diagnostic criteria for PCOS.</p>
          </a>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 gradient-gentle text-white text-center">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-90" />
        <h3 className="font-semibold text-lg mb-2">Need Support?</h3>
        <p className="text-sm opacity-90 mb-4">Connect with our AI health coach for personalized guidance</p>
        <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30" onClick={() => onNavigate?.('coach')}>
          Chat with AI Coach
        </Button>
      </Card>
    </div>
  );
};

export default EducationPage;
