import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Users, 
  Award, 
  Heart, 
  Target, 
  Users2, 
  User, 
  Trophy, 
  Shield, 
  Mail, 
  Database,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import ParaSportsIcons from '../components/ParaSportsIcons';
import { ScreenReaderContext } from '../components/ScreenReader';
import logo1 from '../assets/logo1.png';
import backgroundVideo from '../assets/backgroundVideo.mp4';  

const Home = () => {
  const { speak, isAudioEnabled } = useContext(ScreenReaderContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);
  const [isVideoMuted, setIsVideoMuted] = React.useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
    if (isAudioEnabled && speak) {
      speak(isVideoPlaying ? 'Video paused' : 'Video playing');
    }
  };

  const handleMuteToggle = () => {
    setIsVideoMuted(!isVideoMuted);
    if (isAudioEnabled && speak) {
      speak(isVideoMuted ? 'Video unmuted' : 'Video muted');
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Para Sports Decorative Background */}
      <ParaSportsIcons />
      
      {/* Background Video */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          muted={isVideoMuted}
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={handleVideoToggle}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
          >
            {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={handleMuteToggle}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
          >
            {isVideoMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/50 to-white"></div> */}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden py-16">
        <div className="container-responsive page-padding">
          <div className="text-center">
            {/* Hero Icon */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-200">
                  <img 
                    src={logo1}
                    alt="Para Sports Logo"
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <User size={48} className="text-blue-600 hidden" />
                </div>
                {/* <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                  <Star size={16} className="text-white" />
                </div> */}
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="responsive-heading font-bold text-gray-900 mb-8">
              <span className="block text-gray-600">Welcome to</span>
              <span className="block text-blue-600">Para Sports ID Card System</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="responsive-text text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
              Empowering para athletes through official identification and recognition. 
              Join our inclusive sports community and get your professional ID card today!
            </p>

            {/* Hero Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                <UserPlus size={24} />
                Register New Player
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-white/95 relative z-10 py-20">
        <div className="container-responsive">
          <div className="text-center mb-20">
            <h2 className="responsive-heading font-bold text-gray-900 mb-8 flex items-center justify-center gap-3">
              <Star size={40} className="text-blue-600" />
              Our Services
            </h2>
            <p className="responsive-text text-gray-600 max-w-2xl mx-auto">
              Comprehensive para sports management system designed for inclusivity and excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: UserPlus,
                title: "Player Registration",
                description: "Complete registration form for para sports athletes with comprehensive information collection and accessibility features.",
                color: "bg-blue-600",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600"
              },
              {
                icon: Shield,
                title: "ID Card Generation",
                description: "Automatically generate professional ID cards with player photos, QR codes, and official para sports branding.",
                color: "bg-green-600",
                bgColor: "bg-green-50",
                iconColor: "text-green-600"
              },
              {
                icon: Mail,
                title: "Email Delivery",
                description: "Instantly send generated ID cards to players' email addresses for easy access and secure storage.",
                color: "bg-purple-600",
                bgColor: "bg-purple-50",
                iconColor: "text-purple-600"
              },
              {
                icon: Database,
                title: "Player Management",
                description: "Comprehensive database management for tracking, updating, and managing player information efficiently.",
                color: "bg-orange-600",
                bgColor: "bg-orange-50",
                iconColor: "text-orange-600"
              }
            ].map((feature, index) => (
              <div key={index} className="card-hover p-8 group">
                <div className={`w-16 h-16 ${feature.color} rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="section-spacing bg-gray-50/95 relative z-10 py-20">
        <div className="container-responsive">
          <div className="text-center mb-20">
            <h2 className="responsive-heading font-bold text-gray-900 mb-8 flex items-center justify-center gap-3">
              <Trophy size={40} className="text-green-600" />
              Supported Para Sports
            </h2>
            <p className="responsive-text text-gray-600 max-w-2xl mx-auto">
              We support a wide range of para sports disciplines and classifications
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: User,
                title: "Wheelchair Sports",
                sports: ["Wheelchair Basketball", "Wheelchair Tennis", "Wheelchair Rugby"],
                color: "bg-blue-600",
                bgColor: "bg-blue-50"
              },
              {
                icon: Target,
                title: "Athletics & Swimming",
                sports: ["Para Athletics", "Para Swimming", "Para Powerlifting"],
                color: "bg-green-600",
                bgColor: "bg-green-50"
              },
              {
                icon: Target,
                title: "Racket Sports",
                sports: ["Para Table Tennis", "Para Badminton", "Para Tennis"],
                color: "bg-purple-600",
                bgColor: "bg-purple-50"
              }
            ].map((category, index) => (
              <div key={index} className={`card-hover p-8 ${category.bgColor}`}>
                <div className={`w-20 h-20 ${category.color} rounded-2xl shadow-sm flex items-center justify-center mb-6`}>
                  <category.icon size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">{category.title}</h3>
                <ul className="space-y-3">
                  {category.sports.map((sport, sportIndex) => (
                    <li key={sportIndex} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                      {sport}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-spacing bg-blue-600/95 relative z-10 py-20">
        <div className="container-responsive">
          <div className="text-center">
            <h2 className="responsive-heading font-bold text-white mb-8">
              Ready to Get Started?
            </h2>
            <p className="responsive-text text-blue-100 max-w-2xl mx-auto mb-12">
              Join thousands of para athletes who trust our system for their official identification needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                <UserPlus size={24} />
                Register Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 