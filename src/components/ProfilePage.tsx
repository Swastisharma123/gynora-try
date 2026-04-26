
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Calendar, Target, Save, Edit } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const ProfilePage = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    weight: '',
    height: '',
    menstruation_age: '',
    cycle_length: '',
    last_period_date: '',
    symptoms: '',
    goals: ''
  });
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        menstruation_age: profile.menstruation_age?.toString() || '',
        cycle_length: profile.cycle_length || '',
        last_period_date: (profile as any).last_period_date || '',
        symptoms: profile.symptoms || '',
        goals: profile.goals || ''
      });
      setViewMode(true);
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const calculateRiskScore = () => {
        let score = 0;
        const bmi = parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2);
        if (formData.cycle_length === 'irregular' || formData.cycle_length === '36+') score += 2;
        if (bmi > 25) score += 2;
        if (formData.symptoms.toLowerCase().includes('acne')) score += 1;
        if (formData.symptoms.toLowerCase().includes('hair')) score += 1;
        if (formData.symptoms.toLowerCase().includes('pigmentation')) score += 1;
        return Math.min(score, 6);
      };

      const riskScore = calculateRiskScore();

      await updateProfile({
        full_name: formData.full_name || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        menstruation_age: formData.menstruation_age ? parseInt(formData.menstruation_age) : undefined,
        cycle_length: formData.cycle_length || undefined,
        last_period_date: formData.last_period_date || undefined,
        symptoms: formData.symptoms || undefined,
        goals: formData.goals || undefined,
        pcos_risk_score: riskScore
      } as any);

      setViewMode(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mx-auto w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-64 mb-6"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode) {
    return (
      <div className="space-y-6 pb-20">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl border border-white/20">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Profile Summary</h2>
          <p className="text-gray-600 mt-2">Here is your saved profile</p>
        </div>

        <Card className="p-6 space-y-3 shadow-lg">
          <p><strong>Name:</strong> {formData.full_name}</p>
          <p><strong>Age:</strong> {formData.age}</p>
          <p><strong>Weight:</strong> {formData.weight} kg</p>
          <p><strong>Height:</strong> {formData.height} cm</p>
          <p><strong>Menstruation Age:</strong> {formData.menstruation_age}</p>
          <p><strong>Cycle Length:</strong> {formData.cycle_length}</p>
          <p><strong>Last Period:</strong> {formData.last_period_date || 'Not set'}</p>
          <p className="p-3 bg-purple-50 rounded-xl border border-purple-100 mt-2">
             <strong className="text-purple-700">Current Phase:</strong> 
             <span className="ml-2 font-bold text-purple-600">
               {(() => {
                 if (!formData.last_period_date) return 'Unknown';
                 const lastDate = new Date(formData.last_period_date);
                 const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                 const cycle = parseInt(formData.cycle_length.split('-')[1]) || 28;
                 
                 if (diffDays < 6) return 'Menstruation (Day ' + (diffDays + 1) + ')';
                 if (diffDays < 14) return 'Follicular Phase';
                 if (diffDays < 17) return 'Ovulation Window';
                 if (diffDays < cycle) return 'Luteal Phase';
                 return 'Cycle Overdue (Check Health)';
               })()}
             </span>
          </p>
          <p className="p-3 bg-pink-50 rounded-xl border border-pink-100 mt-2">
             <strong className="text-pink-700">Next Predicted Period:</strong> 
             <span className="ml-2 font-bold text-pink-600">
               {(() => {
                 if (!formData.last_period_date) return 'Unknown';
                 const lastDate = new Date(formData.last_period_date);
                 const cycle = parseInt(formData.cycle_length.split('-')[1]) || 28;
                 const nextDate = new Date(lastDate);
                 nextDate.setDate(lastDate.getDate() + cycle);
                 return nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
               })()}
             </span>
          </p>
          <p><strong>Symptoms:</strong> {formData.symptoms}</p>
          <p><strong>Goals:</strong> {formData.goals}</p>
          <p><strong>PCOS Risk Score:</strong> {
            (() => {
              let score = 0;
              const bmi = parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2);
              if (formData.cycle_length === 'irregular' || formData.cycle_length === '36+') score += 2;
              if (bmi > 25) score += 2;
              if (formData.symptoms.toLowerCase().includes('acne')) score += 1;
              if (formData.symptoms.toLowerCase().includes('hair')) score += 1;
              if (formData.symptoms.toLowerCase().includes('pigmentation')) score += 1;
              return Math.min(score, 6);
            })()
          }/6</p>
          <Button onClick={() => setViewMode(false)} className="w-full h-12 bg-purple-500 text-white mt-4">
            <Edit className="w-5 h-5 mr-2" /> Edit Profile
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl border border-purple-50 p-2.5">
          <img 
                  src="/images/logo.png" 
                  alt="GYNORA Logo" 
                  className="w-full h-full object-contain"
                />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Your Profile</h2>
        <p className="text-gray-600 mt-2">Help us personalize your wellness journey</p>
      </div>

      {/* Basic Information */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="font-semibold mb-4 flex items-center text-lg">
          <User className="w-5 h-5 mr-2 text-purple-600" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              id="full_name"
              placeholder="Your full name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
              <Input
                id="age"
                placeholder="25"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight (kg)</Label>
              <Input
                id="weight"
                placeholder="60"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height (cm)</Label>
            <Input
              id="height"
              placeholder="165"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Menstruation History */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="font-semibold mb-4 flex items-center text-lg">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
          Menstruation History
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="menstruation-age" className="text-sm font-medium text-gray-700">Age when menstruation started</Label>
            <Input
              id="menstruation-age"
              placeholder="13"
              value={formData.menstruation_age}
              onChange={(e) => handleInputChange('menstruation_age', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cycle-length" className="text-sm font-medium text-gray-700">Average cycle length</Label>
            <Select value={formData.cycle_length} onValueChange={(value) => handleInputChange('cycle_length', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select cycle length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="21-25">21-25 days</SelectItem>
                <SelectItem value="26-30">26-30 days</SelectItem>
                <SelectItem value="31-35">31-35 days</SelectItem>
                <SelectItem value="36+">36+ days</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="last_period" className="text-sm font-medium text-gray-700">First day of last period</Label>
            <Input
              id="last_period"
              type="date"
              value={formData.last_period_date}
              onChange={(e) => handleInputChange('last_period_date', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Symptoms */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="font-semibold mb-4 text-lg">Current Symptoms</h3>
        <Textarea
          placeholder="Describe any symptoms you're experiencing (acne, irregular periods, weight gain, etc.)"
          value={formData.symptoms}
          onChange={(e) => handleInputChange('symptoms', e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </Card>

      {/* Goals */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="font-semibold mb-4 flex items-center text-lg">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          Your Goals
        </h3>
        <Textarea
          placeholder="What do you hope to achieve? (better skin, regular periods, weight management, etc.)"
          value={formData.goals}
          onChange={(e) => handleInputChange('goals', e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </Card>

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        disabled={saving}
        className="w-full h-14 gradient-wellness text-white shadow-lg border-0 text-lg font-medium"
      >
        {saving ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Saving...
          </div>
        ) : (
          <div className="flex items-center">
            <Save className="w-5 h-5 mr-2" />
            Save Profile
          </div>
        )}
      </Button>

      {formData.weight && formData.height && (
  <div className="text-center text-sm text-gray-600 mt-4">
    Baseline Profile Risk: <strong>
  {
    (() => {
      let score = 0;
      const bmi = parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2);
      if (formData.cycle_length === 'irregular' || formData.cycle_length === '36+') score += 2;
      if (bmi > 25) score += 2;
      if (formData.symptoms.toLowerCase().includes('acne')) score += 1;
      if (formData.symptoms.toLowerCase().includes('hair')) score += 1;
      if (formData.symptoms.toLowerCase().includes('pigmentation')) score += 1;
      const percentage = (Math.min(score, 6) / 6) * 100;
      return `${percentage.toFixed(0)}%`;
    })()
  }
</strong>
  </div>
)}
    </div>
  );
};

export default ProfilePage;


