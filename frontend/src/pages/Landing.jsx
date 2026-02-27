import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, CheckCircle2, Zap, TrendingUp, BookOpen, Target, Briefcase } from 'lucide-react';

const SkillBridgeLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#2B2A2A] text-[#F0FFDF]" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#2B2A2A] bg-opacity-95 backdrop-blur-md border-b border-[#237227] border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo.jpg" alt="SkillBridge Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-[#F0FFDF] hidden sm:inline">SkillBridge</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['About', 'Problem', 'Solution', 'How It Works'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-[#F0FFDF] hover:text-[#237227] transition-colors duration-300 font-medium text-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="hidden md:flex space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-[#237227] border border-[#237227] rounded-lg hover:bg-[#237227] hover:text-[#F0FFDF] transition-all duration-300 font-medium text-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2 bg-[#237227] text-[#F0FFDF] rounded-lg hover:bg-opacity-80 transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#F0FFDF]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top">
              <div className="flex flex-col space-y-3">
                {['About', 'Problem', 'Solution', 'How It Works'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                    className="text-[#F0FFDF] hover:text-[#237227] transition-colors text-left font-medium py-2"
                  >
                    {item}
                  </button>
                ))}
                <div className="flex flex-col space-y-2 pt-2 border-t border-[#237227] border-opacity-20">
                  <button onClick={() => navigate('/login')} className="px-4 py-2 text-[#237227] border border-[#237227] rounded-lg text-sm font-medium">
                    Login
                  </button>
                  <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-[#237227] text-[#F0FFDF] rounded-lg text-sm font-medium">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Animated gradient background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-96 h-96 bg-[#237227] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
              style={{ animation: 'float 6s ease-in-out infinite', top: '10%', left: '10%' }}
            />
            <div
              className="absolute w-96 h-96 bg-[#237227] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
              style={{ animation: 'float 8s ease-in-out infinite reverse', bottom: '10%', right: '10%' }}
            />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-up">
              <h1 className="text-4xl md:text-6xl font-bold text-[#F0FFDF] mb-6 leading-tight">
                Bridge Your <span className="text-[#237227]">Skills Gap</span>
              </h1>
              <p className="text-lg text-[#F0FFDF] text-opacity-90 mb-8 leading-relaxed">
                Discover exactly what skills you need to master for your dream IT career. Get personalized roadmaps powered by AI-driven assessments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-[#237227] text-[#F0FFDF] px-8 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 group"
                >
                  Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="border-2 border-[#237227] text-[#237227] px-8 py-4 rounded-lg font-bold hover:bg-[#237227] hover:text-[#F0FFDF] transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden md:block">
              <div className="animate-float">
                <div className="bg-gradient-to-br from-[#252525] to-[#1F1F1F] rounded-2xl p-6 border border-[#237227] border-opacity-40 shadow-glow-lg">

                  {/* Mock UI Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-[#237227] border-opacity-20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#237227] to-[#A8E063] flex items-center justify-center text-[#1F1F1F] font-bold text-sm">
                        JD
                      </div>
                      <div>
                        <div className="text-[#F0FFDF] font-bold text-sm">John Doe</div>
                        <div className="text-[#A8E063] text-xs">Full Stack Developer</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#F0FFDF] font-mono font-bold text-xl">84%</div>
                      <div className="text-xs text-[#F0FFDF] text-opacity-50">Skill Match Score</div>
                    </div>
                  </div>

                  {/* Mock Skills Focus */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-[#F0FFDF] text-opacity-60 uppercase tracking-wider">Top Recommended Skills</p>

                    <div className="space-y-3">
                      {/* Skill 1 */}
                      <div className="bg-[#2B2A2A] rounded-lg p-3 border border-[#237227] border-opacity-20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#237227] bg-opacity-20 flex items-center justify-center">
                            <span className="text-xs text-[#A8E063] font-mono">⚛️</span>
                          </div>
                          <span className="text-sm font-medium text-[#F0FFDF]">React.js Advanced</span>
                        </div>
                        <span className="text-xs font-bold text-[#A8E063]">+12%</span>
                      </div>

                      {/* Skill 2 */}
                      <div className="bg-[#2B2A2A] rounded-lg p-3 border border-[#237227] border-opacity-20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#237227] bg-opacity-20 flex items-center justify-center">
                            <span className="text-xs text-[#A8E063] font-mono">🐍</span>
                          </div>
                          <span className="text-sm font-medium text-[#F0FFDF]">Python FastAPI</span>
                        </div>
                        <span className="text-xs font-bold text-[#A8E063]">+8%</span>
                      </div>

                      {/* Timeline Mock */}
                      <div className="mt-4 pt-4 border-t border-[#237227] border-opacity-20">
                        <div className="h-2 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#237227] to-[#A8E063] w-[65%] rounded-full relative">
                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white opacity-20 animate-pulse"></div>
                          </div>
                        </div>
                        <p className="text-right text-[10px] text-[#F0FFDF] text-opacity-40 mt-1 uppercase tracking-widest">Roadmap Progress</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fade-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-up {
            animation: fade-up 0.8s ease-out forwards;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1F1F1F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#F0FFDF] mb-4">About SkillBridge</h2>
            <p className="text-lg text-[#F0FFDF] text-opacity-80 max-w-2xl mx-auto">
              Revolutionizing how IT and Computer Science students understand and develop their professional skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Precise Assessment', desc: 'AI-powered skill detection from your resume and GitHub' },
              { icon: TrendingUp, title: 'Data-Driven Insights', desc: 'Real proficiency scores based on industry standards' },
              { icon: BookOpen, title: 'Custom Learning', desc: 'Personalized roadmaps aligned with your career goals' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#2B2A2A] border border-[#237227] border-opacity-30 rounded-xl p-8 hover:border-opacity-60 transition-all duration-300 hover:shadow-xl group"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="bg-[#237227] bg-opacity-20 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-opacity-40 transition-all">
                  <item.icon size={28} className="text-[#237227]" />
                </div>
                <h3 className="text-xl font-bold text-[#F0FFDF] mb-3">{item.title}</h3>
                <p className="text-[#F0FFDF] text-opacity-75">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#F0FFDF] mb-4">The Problem</h2>
            <p className="text-lg text-[#F0FFDF] text-opacity-80">Why most IT students struggle in their careers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  'Unclear skill gaps between academic knowledge and industry requirements',
                  'No data-driven career guidance tailored to individual strengths',
                  'Lack of structured learning paths for skill development',
                  'Resume and portfolio underutilization in career planning',
                  'Generic job recommendations without skill-match analysis',
                ].map((problem, idx) => (
                  <div key={idx} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#237227] bg-opacity-20">
                        <span className="text-[#237227] font-bold">!</span>
                      </div>
                    </div>
                    <p className="text-[#F0FFDF] text-opacity-90">{problem}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="bg-gradient-to-br from-[#237227] to-[#1a5a1a] rounded-2xl p-12 border border-[#237227] border-opacity-30 shadow-2xl">
                <div className="text-center">
                  <TrendingUp size={64} className="text-[#F0FFDF] mx-auto mb-4 opacity-50" />
                  <p className="text-[#F0FFDF] text-opacity-60">Career growth without direction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1F1F1F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#F0FFDF] mb-4">Our Solution</h2>
            <p className="text-lg text-[#F0FFDF] text-opacity-80">Intelligent skill assessment and career planning platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative hidden md:block order-2">
              <div className="bg-gradient-to-br from-[#237227] to-[#1a5a1a] rounded-2xl p-12 border border-[#237227] border-opacity-30 shadow-2xl">
                <div className="text-center">
                  <Briefcase size={64} className="text-[#F0FFDF] mx-auto mb-4" />
                  <p className="text-[#F0FFDF]">Precision Career Mapping</p>
                </div>
              </div>
            </div>

            <div className="order-1">
              <div className="space-y-6">
                {[
                  { title: 'Smart Skill Extraction', desc: 'NLP-powered analysis of your resume and GitHub profile' },
                  { title: 'Adaptive Testing', desc: 'Real-time skill assessments with proficiency scoring' },
                  { title: 'AI-Driven Matching', desc: 'Industry-aligned role recommendations using RAG' },
                  { title: 'Gap Analysis', desc: 'Clear visualization of skills you need to acquire' },
                  { title: 'Personalized Roadmap', desc: 'Custom learning plans with specific resources' },
                ].map((solution, idx) => (
                  <div key={idx} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 size={24} className="text-[#237227]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#F0FFDF] mb-1">{solution.title}</h3>
                      <p className="text-[#F0FFDF] text-opacity-75">{solution.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#F0FFDF] mb-4">How It Works</h2>
            <p className="text-lg text-[#F0FFDF] text-opacity-80">9 steps to your perfect career path</p>
          </div>

          <div className="relative">
            {/* The Road Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#237227] bg-opacity-20 transform -translate-x-1/2 rounded-full"></div>

            <div className="space-y-12 relative z-10">
              {[
                { step: 1, title: 'Auth & Profile Setup', desc: 'Securely create your account and fill out your baseline candidate details to start your journey.', icon: '🔐' },
                { step: 2, title: 'Data Ingestion Dashboard', desc: 'Securely link and extract data from your Resume and your GitHub Profile directly into our system.', icon: '📊' },
                { step: 3, title: 'AI Driven Assessment', desc: 'Take a personalized skill assessment featuring adaptive MCQs and hands-on coding questions inside an AI Proctored environment.', icon: '🤖' },
                { step: 4, title: 'Gap Analysis', desc: 'Our engine visualizes the delta between your current capabilities and industry standards via detailed interactive charts.', icon: '📈' },
                { step: 5, title: 'SWOT Analysis', desc: 'Get a clear, automated breakdown of your Strengths, Weaknesses, Opportunities, and Threats.', icon: '⚖️' },
                { step: 6, title: 'Career Matching (RAG)', desc: 'We utilize advanced RAG AI algorithms to pinpoint the exact real-world career roles that fit your profile.', icon: '🎯' },
                { step: 7, title: '12-Week Roadmap', desc: 'Your final destination: a customized, week-by-week learning roadmap designed to bridge your exact gap.', icon: '🗺️' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} animate-fade-up`}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  {/* Content Box */}
                  <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-[#1F1F1F] border border-[#237227] border-opacity-30 rounded-2xl p-8 hover:border-[#A8E063] hover:border-opacity-50 transition-all duration-300 hover:-translate-y-1 shadow-lg group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#237227] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                      <h3 className="text-2xl font-bold text-[#F0FFDF] mb-3 flex items-center gap-3 justify-center md:justify-start" style={{ flexDirection: idx % 2 === 0 ? 'row-reverse' : 'row' }}>
                        <span className="text-3xl">{item.icon}</span>
                        {item.title}
                      </h3>
                      <p className="text-[#F0FFDF] text-opacity-70 leading-relaxed text-sm lg:text-base">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center Node on the Road */}
                  <div className="hidden md:flex flex-col items-center justify-center w-2/12 relative">
                    <div className="w-12 h-12 bg-[#2B2A2A] border-4 border-[#237227] rounded-full flex items-center justify-center text-[#A8E063] font-bold text-lg shadow-[0_0_15px_rgba(35,114,39,0.5)] z-10 transition-transform duration-300 hover:scale-125">
                      {item.step}
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-[#237227] text-[#F0FFDF] px-12 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-2 group"
            >
              Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1F1F] border-t border-[#237227] border-opacity-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src="/logo.jpg" alt="SkillBridge Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-bold text-[#F0FFDF]">SkillBridge</span>
              </div>
              <p className="text-[#F0FFDF] text-opacity-70 text-sm">Bridge your skills gap with AI-powered career guidance.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#F0FFDF] font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-[#F0FFDF] text-opacity-70">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-[#237227] transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('problem')} className="hover:text-[#237227] transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#237227] transition-colors">How It Works</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[#F0FFDF] font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#F0FFDF] text-opacity-70">
                <li><a href="#/" className="hover:text-[#237227] transition-colors">Privacy Policy</a></li>
                <li><a href="#/" className="hover:text-[#237227] transition-colors">Terms of Service</a></li>
                <li><a href="#/" className="hover:text-[#237227] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[#F0FFDF] font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-[#F0FFDF] text-opacity-70">
                <li><a href="#/" className="hover:text-[#237227] transition-colors">Twitter</a></li>
                <li><a href="#/" className="hover:text-[#237227] transition-colors">LinkedIn</a></li>
                <li><a href="#/" className="hover:text-[#237227] transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#237227] border-opacity-20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#F0FFDF] text-opacity-60">
            <p>&copy; 2024 SkillBridge. All rights reserved.</p>
            <p>Empowering the next generation of IT professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SkillBridgeLanding;
