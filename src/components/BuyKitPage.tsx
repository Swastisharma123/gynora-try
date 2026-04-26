import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle, Package, Star } from 'lucide-react';

const BuyKitPage = () => {
  const features = [
    "10x Health Testing Strips (Hormone & Sweat)",
    "Color-coded results scheme integrated with box",
    "Full-time advanced AI Coach access",
    "Digital Health Report & Tracking",
    "Priority App Feature Access"
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          <Package className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-3">Gynora Early Screening Kit</h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">“A low-cost, non-invasive early screening kit for hormonal imbalance in women of all ages using biochemical strip indicators + guided assessment”</p>
      </div>

      {/* Main Kit Card */}
      <Card className="max-w-4xl mx-auto p-6 lg:p-8 glass-card animate-fade-in-up border-2 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
          EARLY BIRD
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src="/images/kit.png" 
              alt="Gynora Kit" 
              className="relative rounded-2xl shadow-2xl border border-white w-full h-auto object-cover aspect-[4/3]"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Advanced Wellness Kit</h3>
              <div className="flex items-center space-x-1 mt-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-gray-500 ml-2">(48 reviews)</span>
              </div>
            </div>
            
            <div className="py-6 border-y border-purple-50">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500 tracking-tighter">₹399</span>
                <span className="text-base text-slate-300 line-through font-bold">₹500</span>
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ml-2">20% OFF</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Affordable Hormone Screening for Everyone</p>
            </div>
 
            <div className="space-y-4">
              <Button className="w-full h-16 bg-gradient-to-br from-purple-600 to-pink-500 text-white text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-200 hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 border-0">
                <ShoppingCart className="w-5 h-5 mr-3" />
                Checkout Now
              </Button>
              <div className="flex items-center justify-center space-x-4 opacity-60">
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1.5 text-green-500" /> Free Shipping
                 </p>
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1.5 text-green-500" /> Secure Checkout
                 </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Features List */}
      <div className="max-w-2xl mx-auto">
        <h3 className="font-semibold text-lg mb-4 text-center">What's inside the box?</h3>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-4 flex items-center hover:shadow-md transition border-0 bg-white">
              <CheckCircle className="w-5 h-5 text-purple-500 mr-4 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyKitPage;
