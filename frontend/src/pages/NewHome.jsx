import { Link, useNavigate } from 'react-router-dom';
import { Zap, Briefcase, Gift, ArrowRight, FileText, CheckCircle, ArrowLeft, Home } from 'lucide-react';

const NewHome = () => {
  const navigate = useNavigate();
  
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
        { name: 'DSC', icon: '🔐' },
        { name: 'DIN', icon: '👤' },
        { name: 'Shop Est & Reg', icon: '🏪' },
        { name: 'MSME/Udyam', icon: '🏭' },
        { name: 'COI', icon: '📜' }
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
        { name: 'Export Grants', icon: '🌍' },
        { name: 'Technology Grants', icon: '💻' },
        { name: 'Women Entrepreneur', icon: '👩‍💼' }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Back Button & Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-3 h-3" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Choose Service</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unified Services Portal
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2">
              एकीकृत सेवा पोर्टल
            </p>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Upload documents, AI auto-fills forms, submit applications - all in one place
            </p>
          </div>
        </div>
      </div>

      {/* Main Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Service</h2>
          <p className="text-gray-600">अपनी सेवा चुनें</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
                  <ArrowRight className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r ${service.color} group-hover:translate-x-2 transition-transform`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
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
    </div>
  );
};

export default NewHome;
