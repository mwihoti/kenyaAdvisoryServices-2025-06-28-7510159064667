import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthClient } from '@dfinity/auth-client';
import '/index.css';
import Agribot from './agriBot';
import Legalbot from './legalBot';
import { ChatProvider } from './ChatManager';


const App = () => {
  const [activeBot, setActiveBot] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);

  // Initialize auth client on component mount
  useEffect(() => {
    async function initAuth() {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      if (await client.isAuthenticated()) {
        setIsAuthenticated(true);
        setIdentity(client.getIdentity());
      }
    }
    initAuth();
  }, []);

  const handleLogin = async () => {
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === 'ic' 
        ? 'https://identity.ic0.app' 
        : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943',
      onSuccess: () => {
        setIsAuthenticated(true);
        setIdentity(authClient.getIdentity());
      }
    });
  };

  const handleLogout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setActiveBot(null);
  };

  const handleBotSelect = (botType) => {
    setActiveBot(botType);
  };

  const handleBackToHome = () => {
    setActiveBot(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-blue-600/5"></div>
          <div className="relative flex flex-col min-h-screen items-center justify-center p-4">
            <div className="w-full container max-w-md rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-2xl border border-white/20 mb-8">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                  <span className="text-3xl">🔒</span>
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-800">Kenyan Advisory Services</h1>
                <p className="mb-8 text-gray-600 leading-relaxed">
                  Please sign in with Internet Identity to access agricultural and legal advisory services.
                </p>
                <button
                  onClick={handleLogin}
                  className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300"
                >
                  Sign In with Internet Identity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/70 backdrop-blur-sm py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-4">Why You'll Love Our Services</h2>
            <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Empowering Kenyan farmers and citizens with cutting-edge AI technology
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Smart Farming Advice</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Get personalized crop recommendations, planting schedules, and pest control solutions for Kenyan conditions.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Legal Guidance</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Understand your rights, navigate legal processes, and get help with documents - all specific to Kenyan law.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Secure & Private</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Your data stays private with blockchain-powered Internet Identity. No passwords, no tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-4">Trusted by Kenyan Farmers & Citizens</h2>
            <p className="text-lg text-gray-600 text-center mb-16">Real stories from real users</p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                    <span className="text-xl">👩‍🌾</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Mary Wanjiku</h4>
                    <p className="text-sm text-gray-500">Smallholder Farmer, Nakuru</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "AgriBot helped me double my maize yield with simple tips tailored for our region. Now I can support my family better!"
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                    <span className="text-xl">👨‍⚖️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">James Mwangi</h4>
                    <p className="text-sm text-gray-500">Business Owner, Nairobi</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "LegalBot guided me through land title processing that would have cost me thousands in lawyer fees. Incredible service!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Kenyans who are making better decisions with our AI advisors.
            </p>
            <button
              onClick={handleLogin}
              className="group inline-flex items-center px-10 py-5 bg-white text-green-600 font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              <span className="mr-3">Sign Up Free with Internet Identity</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="py-8 bg-gray-900 text-white text-center">
          <p className="text-gray-300">© {new Date().getFullYear()} Kenyan Advisory Services. All rights reserved.</p>
        </div>
      </div>
    );
  }

  if (activeBot) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-5xl mx-auto'>
            {/* Header */}
            <div className='bg-white rounded-3xl shadow-2xl mb-8 overflow-hidden border border-gray-100'>
              <div className='bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white p-8'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                      <span className='text-2xl'>{activeBot === 'agri' ? '🌾' : '⚖️'}</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-1">
                        {activeBot === 'agri' ? 'AgriBot' : 'LegalBot'}
                      </h1>
                      <p className='text-white/80 text-sm'>
                        {activeBot === 'agri' ? "Agricultural Assistant" : "Legal Advisory Assistant"}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleBackToHome}
                    className='bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Home</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bot Content */}
            <div className='bg-white rounded-3xl shadow-2xl h-[75vh] border border-gray-100 overflow-hidden'>
              {activeBot === 'agri' ? <Agribot /> : <Legalbot />}
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className='bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white p-8'>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <span className="text-3xl">🤖</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">🌾 Kenyan Agriculture and Legal Advisor</h1>
              <p className='text-white/80'>
                Your AI-powered assistant for agricultural guidance and legal advice in Kenya
              </p>
            </div>
          </div>

          {/* Bot Selection Cards */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* AgriBot Card */}
              <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 p-8 hover:-translate-y-1">
                <div className="bg-green-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🌾</span>
                  </div>
                  <h2 className="text-xl font-bold mt-2">AgriBot</h2>
                  <p className="text-green-700 text-sm">Agricultural Intelligence Assistant</p>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  Get expert advice on farming practices, crop management, and agricultural techniques specifically tailored for Kenyan conditions.
                </p>
                
                <button
                  onClick={() => handleBotSelect('agri')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                >
                  Start with AgriBot
                </button>
              </div>

              {/* LegalBot Card */}
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-8 hover:-translate-y-1">
                <div className="bg-blue-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <h2 className="text-xl font-bold mt-2">LegalBot</h2>
                  <p className="text-blue-700 text-sm">Legal Advisory Assistant</p>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  Navigate Kenyan laws and regulations with confidence. Get guidance on legal procedures, rights, and documentation.
                </p>
                
                <button
                  onClick={() => handleBotSelect('legal')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                >
                  Start with LegalBot
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center text-gray-500 text-sm border-t">
            <p>Authenticated as: {identity?.getPrincipal().toText()}</p>
            <button 
              onClick={handleLogout}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
            <p className="mt-2">Powered by Internet Identity • Built for Kenya</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <ChatProvider>
    <App />
    </ChatProvider>
  </React.StrictMode>
);