
import React from 'react';
import { Product } from '../types';

interface SidebarProps {
  products: Product[];
  activeId: string;
  onProductSelect: (p: Product) => void;
  activeProduct: Product;
}

const Sidebar: React.FC<SidebarProps> = ({ products, activeId, onProductSelect, activeProduct }) => {
  return (
    <div className="w-full md:w-[420px] h-full bg-[#0b1d26] border-r border-white/10 flex flex-col overflow-y-auto z-20 shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-white/10 bg-[#08161d]">
        <h1 className="text-[#ffd369] font-industrial text-2xl mb-1 tracking-tight leading-none">
          DHRUVANSH
        </h1>
        <div className="text-white text-sm font-semibold tracking-tighter uppercase mb-4 opacity-80">
          Steel Exports & Imports
        </div>
        <p className="text-white/60 text-xs italic leading-snug">
          "Trusted Source for Premium Steel and Metal Products"
        </p>
      </div>

      <div className="p-8 space-y-10">
        {/* About Section */}
        <section>
          <h2 className="text-[#ffd369] text-sm font-bold uppercase tracking-widest mb-4 flex items-center">
            <span className="w-6 h-[1px] bg-[#ffd369] mr-3"></span>
            About Our Legacy
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            South India's leading industrial supplier, headquartered in 
            <span className="text-white font-medium"> Vishakhapatnam, Vijayawada, and Hyderabad</span>. 
            Led by Chairman <span className="text-white font-bold">Sagar</span>, we are an award-winning organization 
            certified by Vishakhapatnam Steel Exports.
          </p>
        </section>

        {/* Product Selector */}
        <section>
          <h2 className="text-[#ffd369] text-sm font-bold uppercase tracking-widest mb-4 flex items-center">
            <span className="w-6 h-[1px] bg-[#ffd369] mr-3"></span>
            Interactive Showcase
          </h2>
          
          {/* Active Product Stats */}
          <div className="bg-white/5 rounded-lg p-5 mb-6 border border-white/5">
            <h3 className="text-white font-bold text-xl mb-1">{activeProduct.name}</h3>
            <div className="text-[#ffd369] font-industrial text-lg">{activeProduct.price}</div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => onProductSelect(p)}
                className={`w-full text-left p-4 transition-all duration-300 rounded-md border flex items-center justify-between group ${
                  activeId === p.id 
                  ? 'bg-[#ffd369] border-[#ffd369] text-black shadow-[0_0_20px_rgba(255,211,105,0.2)]' 
                  : 'bg-transparent border-white/10 text-white hover:border-[#ffd369] hover:bg-white/5'
                }`}
              >
                <span className="font-semibold text-sm tracking-wide">{p.name}</span>
                <span className={`text-xs opacity-50 transform group-hover:translate-x-1 transition-transform ${activeId === p.id ? 'opacity-100' : ''}`}>
                  VIEW MODEL →
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Key Strengths */}
        <section className="bg-white/5 rounded-xl p-6 border border-white/5">
          <ul className="space-y-4">
            {[
              { icon: "✓", label: "Certified Global Supplier" },
              { icon: "₹", label: "Competitive Market Pricing" },
              { icon: "⚓", label: "Bulk Orders & Custom Sizes" },
              { icon: "✈", label: "Fast & Reliable Shipping" },
              { icon: "★", label: "Award-Winning Excellence" }
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4 text-xs font-semibold text-white/80 uppercase tracking-tighter">
                <span className="text-[#ffd369]">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact Section */}
        <section className="pb-8">
          <h2 className="text-[#ffd369] text-sm font-bold uppercase tracking-widest mb-4 flex items-center">
            <span className="w-6 h-[1px] bg-[#ffd369] mr-3"></span>
            Contact Support
          </h2>
          <div className="text-white/70 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-[#ffd369] font-bold">📞</span>
              <span>90000 70993 | 98858 59959</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#ffd369] font-bold">✉</span>
              <span className="hover:text-[#ffd369] transition-colors">Dhruvanshexports@gmail.com</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            {['VISHAKHAPATNAM', 'VIJAYAWADA', 'HYDERABAD'].map(loc => (
              <span key={loc} className="text-[10px] bg-white/10 text-white/50 px-2 py-1 rounded">
                {loc}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sidebar;
