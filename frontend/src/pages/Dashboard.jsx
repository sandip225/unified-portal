import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Zap, Briefcase, Gift, ArrowRight, FileText, 
  CheckCircle, Clock, User,
  MapPin, Phone, Mail, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react';

// Utility functions to mask user information
const maskMobile = (mobile) => {
  if (!mobile) return '';
  const mobileStr = mobile.toString();
  if (mobileStr.length >= 4) {
    return '***' + mobileStr.slice(-4);
  }
  return '***' + mobileStr;
};

const maskEmail = (email) => {
  if (!email) return '';
  const atIndex = email.indexOf('@');
  if (atIndex > 0) {
    return '***' + email.substring(atIndex);
  }
  return '***@gmail.com';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    pending: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState(null); // Track which service is expanded

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const appsRes = await api.get('/applications/');
      const applications = appsRes.data || [];
      const pending = applications.filter(a => ['pending', 'draft', 'processing'].includes(a.status)).length;
      const completed = applications.filter(a => a.status === 'completed').length;
      
      setStats({
        applications: applications.length,
        pending: pending,
        completed: completed
      });
    } catch (error) {
      console.error('Failed to fetch stats');
      setStats({
        applications: 0,
        pending: 0,
        completed: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Main service categories
  const mainServices = [
    {
      id: 'utility-name-change',
      title: 'Utility Name Change',
      titleHindi: 'उपयोगिता नाम परिवर्तन',
      description: 'Change name in utility bills',
      descriptionHindi: 'उपयोगिता बिलों में नाम बदलें',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      services: [
        { name: 'Electricity', count: 5, icon: '⚡' },
        { name: 'Gas', count: 2, icon: '🔥' },
        { name: 'Water', count: 1, icon: '💧' },
        { name: 'Property', count: 1, icon: '🏢' }
      ],
      route: '/utility-services'
    },
    {
      id: 'company-formation',
      title: 'New Company Formation',
      titleHindi: 'नई कंपनी गठन',
      description: 'Register your business',
      descriptionHindi: 'अपना व्यवसाय पंजीकृत करें',
      icon: Briefcase,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      services: [
        { name: 'GST Registration', icon: '📋' },
        { name: 'TAN', icon: '🔢' },
        { name: 'PAN', icon: '🆔' },
        { name: 'DSC', icon: '🔐' }
      ],
      route: '/company-formation'
    },
    {
      id: 'govt-grants',
      title: 'Government Grants',
      titleHindi: 'सरकारी अनुदान',
      description: 'Find grants for your business',
      descriptionHindi: 'अपने व्यवसाय के लिए अनुदान खोजें',
      icon: Gift,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      services: [
        { name: 'Find Grant for Me', icon: '🔍' },
        { name: 'Startup Grants', icon: '🚀' },
        { name: 'MSME Grants', icon: '🏭' },
        { name: 'Export Grants', icon: '🌍' }
      ],
      route: '/government-grants'
    }
  ];

  const features = [
    {
      icon: FileText,
      title: 'Document Upload',
      description: 'Upload documents once, use for multiple services'
    },
    {
      icon: CheckCircle,
      title: 'AI Auto-fill',
      description: 'AI extracts data from documents automatically'
    },
    {
      icon: Zap,
      title: 'Quick Processing',
      description: 'Complete applications in 5-10 minutes'
    }
  ];

  return (
    <div className="space-y-6 w-full">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-blue-200 text-sm">Welcome back</p>
              <h1 className="text-2xl font-bold">{user?.full_name || 'Citizen'}</h1>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20 text-sm">
            {user?.city && (
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-4 h-4" />
                <span>{user.city}</span>
              </div>
            )}
            {user?.mobile && (
              <div className="flex items-center gap-2 text-slate-200">
                <Phone className="w-4 h-4" />
                <span>{maskMobile(user.mobile)}</span>
              </div>
            )}
            {user?.email && (
              <div className="flex items-center gap-2 text-slate-200">
                <Mail className="w-4 h-4" />
                <span>{maskEmail(user.email)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.applications}</p>
                <p className="text-xs text-gray-500">Total Applications</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg text-white">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{loading ? '...' : stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg text-white">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-lg text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <Link
          to="/applications"
          className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-800">My Applications</p>
                <p className="text-xs text-gray-500">Track your submissions</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-lg text-white">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Services Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Service</h2>
          <p className="text-gray-600">अपनी सेवा चुनें</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainServices.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                to={service.route}
                className={`${service.bgColor} border-2 ${service.borderColor} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group`}
              >
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-1">{service.titleHindi}</p>
                
                {/* Description */}
                <p className="text-gray-700 mb-1">{service.description}</p>
                <p className="text-sm text-gray-500 mb-6">{service.descriptionHindi}</p>

                {/* Services List */}
                <div className="space-y-2 mb-6">
                  {service.services.slice(0, 4).map((subService, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-lg">{subService.icon}</span>
                      <span>{subService.name}</span>
                      {subService.count && (
                        <span className="text-xs text-gray-500">({subService.count})</span>
                      )}
                    </div>
                  ))}
                  {service.services.length > 4 && (
                    <p className="text-sm text-gray-500 italic">
                      +{service.services.length - 4} more services
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${service.color} font-semibold`}>
                    Get Started
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Flow */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Simple 4-Step Process
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Upload Documents', desc: 'Upload required documents' },
            { step: '2', title: 'AI Extraction', desc: 'AI extracts data automatically' },
            { step: '3', title: 'Fill Remaining', desc: 'Fill only missing details' },
            { step: '4', title: 'Submit', desc: 'Application auto-submitted' }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
