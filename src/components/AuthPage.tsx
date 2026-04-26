
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your account.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border border-purple-50 shadow-[0_30px_90px_rgba(124,58,237,0.1)] bg-white/90 backdrop-blur-xl rounded-3xl relative">
        <div className="text-center mb-10">
          <button
            onClick={onBack}
            className="absolute top-8 left-8 p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all border border-purple-100/50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl p-2.5 border border-purple-50">
            <img 
              src="/images/logo.png" 
              alt="GYNORA Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter">Welcome back</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            {isLogin ? "Access your dashboard" : "Join the ecosystem"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="mt-1 h-12"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 h-12"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 gradient-wellness text-white shadow-lg border-0 text-lg font-medium"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
