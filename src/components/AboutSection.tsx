import React from 'react';
import { Award, ThumbsUp, Truck, Users, Compass, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main About Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#FAF8F5] text-[#B45309] border border-[#E7E5E4] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Established Timber Dealer
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] tracking-tight uppercase font-['Plus_Jakarta_Sans']">
              About Toysn Wood and Super Cakes
            </h2>

            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed">
              Toysn Wood and Super Cakes is a multi-specialty business dedicated to supplying quality roofing wood, planks, bansaw wood and building timber, alongside delicious custom cakes and fresh event bakes through Super Cakes. We also offer convenient site and doorstep delivery with dependable, friendly service.
            </p>

            {/* Mission Box */}
            <div className="bg-[#FAF8F5] border-l-4 border-[#B45309] p-5 rounded-r-2xl space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#92400E]">
                <Compass className="w-4 h-4" />
                Our Mission
              </div>
              <p className="text-sm sm:text-base text-[#44403C] leading-relaxed font-medium">
                To provide quality wood materials, dependable service and convenient delivery for customers working on construction and building projects.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-md h-52 sm:h-64 bg-stone-100">
                <img
                  src="/images/wood_timber_stack.jpg"
                  alt="Timber planks in warehouse"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md h-52 sm:h-64 bg-stone-100 mt-6">
                <img
                  src="/images/wood_planks_stack.jpg"
                  alt="Roofing wood construction project"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Why Choose Us Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight uppercase font-['Plus_Jakarta_Sans']">
            Why Choose Us
          </h3>
          <p className="text-sm sm:text-base text-[#78716C] mt-2">
            Built on integrity, dimensional precision, and dependable client relationships.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E7E5E4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-[#1C1917] mb-2">Quality Materials</h4>
              <p className="text-sm text-[#57534E] leading-relaxed">
                We provide carefully selected wood for construction and roofing needs.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E7E5E4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-[#1C1917] mb-2">Reliable Service</h4>
              <p className="text-sm text-[#57534E] leading-relaxed">
                We aim to make ordering simple and convenient.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E7E5E4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-[#1C1917] mb-2">Delivery Available</h4>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Get your wood delivered to your preferred location.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E7E5E4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-[#1C1917] mb-2">Customer Satisfaction</h4>
              <p className="text-sm text-[#57534E] leading-relaxed">
                We focus on providing helpful and dependable customer service.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
