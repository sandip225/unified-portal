import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, ArrowRight, CheckCircle, Home } from 'lucide-react';

const CompanyFormation = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 'gst',
      name: 'GST Registration',
      nameHindi: 'जीएसटी पंजीकरण',
      icon: '📋',
      description: 'Goods and Services Tax Registration',
      processingTime: '7-10 days',
      fees: '₹2,000 - ₹5,000',
      documents: ['PAN Card', 'Aadhaar', 'Address Proof', 'Bank Statement'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'tan',
      name: 'TAN',
      nameHindi: 'टैन',
      icon: '🔢',
      description: 'Tax Deduction Account Number',
      processingTime: '10-15 days',
      fees: '₹1,500 - ₹3,000',
      documents: ['PAN Card', 'Address Proof', 'Identity Proof'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'pan',
      name: 'PAN Card',
      nameHindi: 'पैन कार्ड',
      icon: '🆔',
      description: 'Permanent Account Number',
      processingTime: '15-20 days',
      fees: '₹1,000 - ₹2,000',
      documents: ['Aadhaar', 'Photo', 'Address Proof'],
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'dsc',
      name: 'DSC',
      nameHindi: 'डीएससी',
      icon: '🔐',
      description: 'Digital Signature Certificate',
      processingTime: '3-5 days',
      fees: '₹1,500 - ₹3,500',
      documents: ['PAN Card', 'Aadhaar', 'Photo'],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'din',
      name: 'DIN',
      nameHindi: 'डीआईएन',
      icon: '👤',
      description: 'Director Identification Number',
      processingTime: '7-10 days',
      fees: '₹1,000 - ₹2,000',
      documents: ['PAN Card', 'Aadhaar', 'Photo', 'Address Proof'],
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'shop-est',
      name: 'Shop Establishment',
      nameHindi: 'दुकान स्थापना',
      icon: '🏪',
      description: 'Shop & Establishment Registration',
      processingTime: '10-15 days',
      fees: '₹2,000 - ₹4,000',
      documents: ['Rent Agreement', 'Owner ID', 'Address Proof'],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'msme',
      name: 'MSME/Udyam',
      nameHindi: 'एमएसएमई/उद्यम',
      icon: '🏭',
      description: 'MSME/Udyam Registration',
      processingTime: '1-3 days',
      fees: 'Free',
      documents: ['Aadhaar', 'PAN', 'Business Details'],
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'coi',
      name: 'COI',
      nameHindi: 'सीओआई',
      icon: '📜',
      description: 'Certificate of Incorporation',
      processingTime: '15-20 days',
      fees: '₹10,000 - ₹20,000',
      documents: ['MOA', 'AOA', 'Director Details', 'Address Proof'],
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const packages = [
    {
      id: 'startup',
      name: 'Startup Package',
      nameHindi: 'स्टार्टअप पैकेज',
      services: ['GST', 'PAN', 'MSME'],
      price: '₹5,999',
      savings: 'Save ₹2,000',
      popular: false
    },
    {
      id: 'business',
      name: 'Business Package',
      nameHindi: 'व्यवसाय पैकेज',
      services: ['GST', 'TAN', 'PAN', 'Shop Est', 'MSME'],
      price: '₹12,999',
      savings: 'Save ₹5,000',
      popular: true
    },
    {
      id: 'complete',
      name: 'Complete Package',
      nameHindi: 'पूर्ण पैकेज',
      services: ['All 8 Services'],
      price: '₹24,999',
      savings: 'Save ₹10,000',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-white hover:text-blue-100 mb-4 transition-colors bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-blue-100 mb-4">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3 h-3" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Company Formation</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">New Company Formation</h1>
              <p className="text-xl text-blue-100">नई कंपनी गठन</p>
            </div>
          </div>
          <p className="text-lg text-blue-100">
            Register your business with all required licenses and certificates
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Packages Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Popular Packages</h2>
          <p className="text-gray-600 text-center mb-8">Save time and money with bundled services</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white border-2 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative ${
                  pkg.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.nameHindi}</p>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{pkg.price}</div>
                  <div className="text-sm text-green-600 font-semibold">{pkg.savings}</div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {pkg.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
                
                <Link
                  to={`/company-formation/${pkg.id}/document-upload`}
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Services */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Individual Services</h2>
          <p className="text-gray-600 text-center mb-8">Choose specific services as per your need</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/company-formation/${service.id}/document-upload`}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-3xl mb-4`}>
                  {service.icon}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.nameHindi}</p>
                <p className="text-xs text-gray-500 mb-4">{service.description}</p>
                
                <div className="space-y-1 text-xs text-gray-600 mb-4">
                  <p>⏱️ {service.processingTime}</p>
                  <p>💰 {service.fees}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 font-semibold">Apply Now</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why Choose Our Service?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📄</div>
              <h4 className="font-semibold text-gray-800 mb-2">Document Upload</h4>
              <p className="text-sm text-gray-600">Upload once, use for multiple services</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h4 className="font-semibold text-gray-800 mb-2">AI Auto-fill</h4>
              <p className="text-sm text-gray-600">AI extracts data automatically</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-800 mb-2">Fast Processing</h4>
              <p className="text-sm text-gray-600">Quick application submission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormation;
