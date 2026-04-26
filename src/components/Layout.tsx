
import {
  Home,
  User,
  Activity,
  MessageCircle,
  FileText,
  Bell,
  LogOut,
  Droplets,
  BookOpen,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { FloatingCoachWidget } from '@/components/FloatingCoachWidget';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({ children, currentPage, onPageChange }: LayoutProps) => {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'scan', label: 'Scan', icon: Activity },
    { id: 'sweat-analysis', label: 'Sweat', icon: Droplets },        // ✅ Added
    { id: 'education', label: 'Education', icon: BookOpen },         // ✅ Added
    { id: 'coach', label: 'Coach', icon: MessageCircle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'buy-kit', label: 'Buy Kit', icon: Package },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Sidebar for Desktop */}
      <aside className="sidebar-container hidden lg:flex w-64 border-r border-purple-100/50 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-purple-50 p-1.5 overflow-hidden">
             <img src="/images/logo.png" alt="GYNORA" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">GYNORA</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "sidebar-item w-full py-3 px-4 rounded-xl",
                  isActive ? "sidebar-item-active" : "sidebar-item-inactive"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-purple-500")} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-purple-50">
           <div className="flex items-center space-x-3 mb-5 px-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                 <User className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                 <p className="text-[11px] font-black text-slate-800 leading-none">{profile?.full_name?.split(' ')[0] || 'User'}</p>
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Health ID: Active</p>
              </div>
           </div>
           <button 
             onClick={handleSignOut}
             className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-all font-bold text-xs"
           >
             <LogOut className="w-4 h-4" />
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      <div className="content-wrapper">
        {/* Header */}
        <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 border-b border-purple-50/50 lg:bg-white/50 lg:backdrop-blur-md">
          {/* Mobile Logo Only */}
          <div className="flex items-center lg:hidden space-x-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-md border border-purple-50 p-1.5 overflow-hidden">
              <img src="/images/logo.png" alt="GYNORA" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight">GYNORA</h1>
          </div>

          <div className="hidden lg:block">
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Portal / <span className="text-purple-600 font-black">{navItems.find(i => i.id === currentPage)?.label}</span></h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end mr-3">
               <span className="text-[11px] font-black text-slate-800 tracking-tight leading-none">{profile?.full_name || 'Wellness User'}</span>
               <button 
                 onClick={() => onPageChange('buy-kit')}
                 className="text-[8px] text-pink-500 font-black uppercase tracking-[0.1em] mt-1.5 hover:underline transition-all"
               >
                 Buy the kit
               </button>
            </div>
            <button className="w-9 h-9 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 hover:shadow-md transition-all">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8 pb-32 lg:pb-10">
          {children}
        </main>

        {/* Floating Bottom Navigation (Mobile Only) */}
        <div className="bottom-nav-container lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn("nav-item", isActive ? "nav-item-active" : "nav-item-inactive")}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-white/10" : ""
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
        <FloatingCoachWidget />
      </div>
    </div>
  );
};

export default Layout;
