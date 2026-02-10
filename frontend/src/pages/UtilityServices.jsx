import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Flame, Droplets, Building, ArrowRight, Home } from 'lucide-react';

const UtilityServices = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: 'electricity',
      name: 'Electricity',
      nameHindi: 'बिजली',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      providers: [
        { id: 'pgvcl', name: 'PGVCL', type: 'Government' },
        { id: 'ugvcl', name: 'UGVCL', type: 'Government' },
        { id: 'mgvcl', name: 'MGVCL', type: 'Government' },
        { id: 'dgvcl', name: 'DGVCL', type: 'Government' },
        { id: 'torrent-power', name: 'Torrent Power', type: 'Private', featured: true }
      ]
    },
    {
      id: 'gas',
      name: 'Gas',
      nameHindi: 'गैस',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      providers: [
        { id: 'gujarat-gas', name: 'Gujarat Gas Ltd', type: 'Government' },
        { id: 'adani-gas', name: 'Adani Total Gas', type: 'Private' }
      ]
    },
    {
      id: 'water',
      name: 'Water',
      nameHindi: 'पानी',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      providers: [
        { id: 'amc-water', name: 'AMC Water', type: 'Government' }
      ]
    },
    {
      id: 'property',
      name: 'Property',
      nameHindi: 'संपत्ति',
      icon: Building,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      providers: [
        { id: 'anyror', name: 'AnyRoR (Revenue Dept)', type: 'Government' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-white hover:text-yellow-100 mb-4 transition-colors bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-yellow-100 mb-4">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3 h-3" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Utility Services</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Utility Name Change</h1>
              <p className="text-xl text-yellow-100">उपयोगिता नाम परिवर्तन</p>
            </div>
          </div>
          <p className="text-lg text-yellow-100">
            Change your name in utility bills - Electricity, Gas, Water, Property
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className={`${category.bgColor} border-2 border-gray-200 rounded-2xl p-8`}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                    <p className="text-gray-600">{category.nameHindi}</p>
                  </div>
                </div>

                {/* Providers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.providers.map((provider) => (
                    <Link
                      key={provider.id}
                      to={`/utility-services/${category.id}/${provider.id}/document-upload`}
                      className={`bg-white border-2 ${provider.featured ? 'border-blue-300 shadow-lg' : 'border-gray-200'} rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative`}
                    >
                      {provider.featured && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                            AI Enabled
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {provider.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          provider.type === 'Government' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {provider.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Apply for Name Change
                        </span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">📋 Documents Required</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Identity Proof</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Aadhaar Card</li>
                <li>• PAN Card</li>
                <li>• Passport</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Address Proof</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Current Utility Bill</li>
                <li>• Ration Card</li>
                <li>• Bank Statement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Name Change Proof</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Marriage Certificate</li>
                <li>• Gazette Notification</li>
                <li>• Affidavit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityServices;
