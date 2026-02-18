import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Zap, Flame, Droplets, Building, ArrowLeft, Upload,
  User, Phone, Mail, MapPin, FileText, Calendar,
  AlertCircle, CheckCircle, Info, Sparkles, Play
} from 'lucide-react';
import axios from '../api/axios';

const NameChangeApplication = () => {
  const { serviceType } = useParams();
  const [searchParams] = useSearchParams();
  const providerId = searchParams.get('provider');

  const [formData, setFormData] = useState({
    // Torrent Power Specific Fields (only for torrent-power)
    city: 'Ahmedabad',
    serviceNumber: '',
    tNumber: '',
    mobile: '',
    email: '',
    confirmEmail: '',

    // Original fields for other providers
    currentName: '',
    newName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    pincode: '',
    connectionNumber: '',
    connectionType: '',
    registeredAddress: '',
    identityProof: null,
    addressProof: null,
    nameChangeProof: null,
    connectionBill: null,
    applicationNumber: '',
    subdivisionCode: '',
    consumerCategory: '',
    loadSanctioned: '',
    aadhaarNumber: '',
    rationCardNumber: '',
    customerID: '',
    accountNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [automationInProgress, setAutomationInProgress] = useState(false);
  const [automationCompleted, setAutomationCompleted] = useState(false);
  const [automationResult, setAutomationResult] = useState(null);
  const [statusLogs, setStatusLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fieldsFilledCount, setFieldsFilledCount] = useState(0);

  const serviceConfig = {
    electricity: {
      name: 'Electricity',
      nameHindi: 'बिजली',
      icon: Zap,
      color: 'bg-yellow-500'
    },
    gas: {
      name: 'Gas',
      nameHindi: 'गैस',
      icon: Flame,
      color: 'bg-orange-500'
    },
    water: {
      name: 'Water',
      nameHindi: 'पानी',
      icon: Droplets,
      color: 'bg-blue-500'
    },
    property: {
      name: 'Property',
      nameHindi: 'संपत्ति',
      icon: Building,
      color: 'bg-green-500'
    }
  };

  // Provider configurations with specific requirements
  const providerConfig = {
    // Electricity Providers
    'pgvcl': {
      name: 'PGVCL',
      nameHindi: 'पीजीवीसीएल',
      type: 'Government',
      service: 'electricity',
      requiredFields: ['currentName', 'newName', 'connectionNumber', 'aadhaarNumber', 'mobile', 'email'],
      specificFields: ['subdivisionCode', 'consumerCategory'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'connectionBill'],
      processingTime: '7-15 days',
      fees: 'As per GERC tariff'
    },
    'ugvcl': {
      name: 'UGVCL',
      nameHindi: 'यूजीवीसीएल',
      type: 'Government',
      service: 'electricity',
      requiredFields: ['currentName', 'newName', 'connectionNumber', 'aadhaarNumber', 'mobile'],
      specificFields: ['subdivisionCode', 'loadSanctioned'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'connectionBill'],
      processingTime: '10-20 days',
      fees: 'Government prescribed fees'
    },
    'mgvcl': {
      name: 'MGVCL',
      nameHindi: 'एमजीवीसीएल',
      type: 'Government',
      service: 'electricity',
      requiredFields: ['currentName', 'newName', 'connectionNumber', 'aadhaarNumber', 'mobile'],
      specificFields: ['subdivisionCode', 'consumerCategory'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'connectionBill'],
      processingTime: '7-15 days',
      fees: 'As per GERC tariff'
    },
    'dgvcl': {
      name: 'DGVCL',
      nameHindi: 'डीजीवीसीएल',
      type: 'Government',
      service: 'electricity',
      requiredFields: ['currentName', 'newName', 'connectionNumber', 'aadhaarNumber', 'mobile'],
      specificFields: ['subdivisionCode', 'consumerCategory'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'connectionBill'],
      processingTime: '7-15 days',
      fees: 'Government prescribed fees'
    },
    'torrent-power': {
      name: 'Torrent Power',
      nameHindi: 'टॉरेंट पावर',
      type: 'Private',
      service: 'electricity',
      requiredFields: ['serviceNumber', 'tNumber', 'mobile', 'email', 'confirmEmail'],
      specificFields: ['city'],
      documents: [], // No documents required for online application
      processingTime: '5-10 days',
      fees: 'Rs. 100 + taxes',
      aiSupported: true,
      portalUrl: 'https://connect.torrentpower.com/tplcp/application/namechangerequest'
    },

    // Gas Providers
    'gujarat-gas': {
      name: 'Gujarat Gas Ltd',
      nameHindi: 'गुजरात गैस लिमिटेड',
      type: 'Government',
      service: 'gas',
      requiredFields: ['currentName', 'newName', 'connectionNumber', 'aadhaarNumber', 'mobile'],
      specificFields: ['consumerCategory', 'registeredAddress'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'connectionBill'],
      processingTime: '10-20 days',
      fees: 'Government prescribed fees'
    },
    'adani-gas': {
      name: 'Adani Total Gas Ltd',
      nameHindi: 'अदानी टोटल गैस लिमिटेड',
      type: 'Private',
      service: 'gas',
      requiredFields: ['currentName', 'newName', 'customerID', 'mobile', 'email'],
      specificFields: ['accountNumber', 'connectionType'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'connectionBill'],
      processingTime: '3-7 days',
      fees: 'Rs. 200 + taxes'
    },

    // Water Providers
    'amc-water': {
      name: 'AMC Water',
      nameHindi: 'एएमसी जल विभाग',
      type: 'Government',
      service: 'water',
      requiredFields: ['currentName', 'newName', 'connectionNumber', 'aadhaarNumber', 'mobile'],
      specificFields: ['wardNumber', 'propertyNumber'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'connectionBill'],
      processingTime: '15-30 days',
      fees: 'Municipal prescribed fees'
    },

    // Property Providers
    'anyror': {
      name: 'AnyRoR (Revenue Dept)',
      nameHindi: 'एनीआरओआर (राजस्व विभाग)',
      type: 'Government',
      service: 'property',
      requiredFields: ['currentName', 'newName', 'aadhaarNumber', 'mobile', 'fatherName'],
      specificFields: ['surveyNumber', 'villageCode', 'talukaCode'],
      documents: ['identityProof', 'addressProof', 'nameChangeProof', 'propertyDocuments'],
      processingTime: '30-60 days',
      fees: 'Revenue department fees'
    }
  };

  const provider = providerConfig[providerId];
  const service = serviceConfig[serviceType];
  const Icon = service?.icon;

  if (!provider || !service) {
    return <div>Provider or service not found</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (providerId === 'torrent-power') {
      // Torrent Power specific validation
      const requiredFields = ['serviceNumber', 'tNumber', 'mobile', 'email', 'confirmEmail'];

      requiredFields.forEach(field => {
        const value = formData[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field] = 'This field is required';
        }
      });

      // Email validation
      if (formData.email && formData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }
      }

      // Email confirmation validation
      if (formData.email && formData.confirmEmail) {
        if (formData.email.trim() !== formData.confirmEmail.trim()) {
          newErrors.confirmEmail = 'Email addresses do not match';
        }
      }

      // Mobile validation
      if (formData.mobile && formData.mobile.trim()) {
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile.trim())) {
          newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }
      }
    } else {
      // Original validation for other providers
      provider.requiredFields.forEach(field => {
        const value = formData[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field] = 'This field is required';
        }
      });

      provider.documents.forEach(doc => {
        if (!formData[doc]) {
          newErrors[doc] = 'This document is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Provider ID:', providerId);

    if (!validateForm()) {
      console.log('Validation failed with errors:', errors);
      return;
    }

    console.log('Validation passed, proceeding...');

    // Check if this is Torrent Power with AI automation
    if (providerId === 'torrent-power' && provider.aiSupported) {
      console.log('Opening automation modal...');
      setShowAutomation(true);
      return;
    }

    // Traditional submission for other providers
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`Application submitted successfully for ${provider.name}! You will receive a confirmation email shortly.`);

      // Reset form or redirect
      // navigate('/applications');

    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutomationComplete = (result) => {
    console.log('Automation completed:', result);
    setAutomationResult(result);
    setAutomationCompleted(true);
    setShowAutomation(false);
    
    if (result.success) {
      // Show success message
      setTimeout(() => {
        alert(`🎉 Application Submitted Successfully!\n\nYour name change request has been submitted to Torrent Power.\n\n✅ What happened:\n• Chrome browser opened automatically\n• Form was filled with your data\n• Application was submitted successfully\n\n📧 Next Steps:\n• You will receive a confirmation email shortly\n• Track your application on Torrent Power portal\n• Keep your reference number safe`);
      }, 500);
    } else {
      alert(`❌ Automation Failed!\n\n${result.error || result.message}\n\nPlease try the manual option or contact support.`);
    }
  };

  const handleCloseAutomation = () => {
    setShowAutomation(false);
  };

  const handleAutoFill = async () => {
    setAutomationInProgress(true);
    setStatusLogs([]);
    setProgress(0);
    setFieldsFilledCount(0);

    const addLog = (message) => {
      setStatusLogs(prev => [...prev, message]);
    };

    try {
      // Simulate automation steps with progress updates
      addLog('🚀 Starting RPA automation...');
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog('🌐 Launching browser...');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog('📍 Navigating to Torrent Power portal...');
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1500));

      addLog('📝 Filling form fields...');
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate field filling
      addLog('✓ City: Ahmedabad');
      setFieldsFilledCount(1);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 300));

      addLog('✓ Service Number: ' + formData.serviceNumber);
      setFieldsFilledCount(2);
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));

      addLog('✓ T No: ' + formData.tNumber);
      setFieldsFilledCount(3);
      setProgress(70);
      await new Promise(resolve => setTimeout(resolve, 300));

      addLog('✓ Mobile: ' + formData.mobile);
      setFieldsFilledCount(4);
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 300));

      addLog('✓ Email: ' + formData.email);
      setFieldsFilledCount(5);
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 300));

      addLog('📤 Submitting application...');
      setProgress(95);
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog('✅ Application submitted successfully!');
      setProgress(100);

      setAutomationResult({
        success: true,
        message: 'Application submitted successfully',
        total_fields: 5,
        total_filled: 5
      });
      setAutomationInProgress(false);
      setAutomationCompleted(true);

    } catch (error) {
      console.error('Automation failed:', error);
      addLog('❌ Automation failed: ' + (error.message || 'Unknown error'));
      setAutomationResult({
        success: false,
        message: error.response?.data?.detail?.message || error.message || 'Automation failed'
      });
      setAutomationInProgress(false);
      setAutomationCompleted(true);
    }
  };

  const renderField = (fieldName, label, type = 'text', required = false) => {
    const isRequired = provider.requiredFields.includes(fieldName) || required;

    return (
      <div key={fieldName}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={fieldName}
          value={formData[fieldName]}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        {errors[fieldName] && (
          <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
        )}
      </div>
    );
  };

  const renderFileUpload = (fieldName, label, accept = '.pdf,.jpg,.jpeg,.png') => {
    const isRequired = provider.documents.includes(fieldName);

    return (
      <div key={fieldName}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'
          }`}>
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <input
            type="file"
            name={fieldName}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            id={fieldName}
          />
          <label
            htmlFor={fieldName}
            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
          >
            Click to upload {label.toLowerCase()}
          </label>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
          {formData[fieldName] && (
            <p className="text-green-600 text-sm mt-2">✓ {formData[fieldName].name}</p>
          )}
        </div>
        {errors[fieldName] && (
          <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Banner - Shows after automation completes */}
      {automationCompleted && automationResult?.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Application Submitted Successfully!</h3>
              <p className="text-green-700 mb-4">
                Your name change request has been successfully submitted to Torrent Power through our AI automation system.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Completed Actions:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Chrome browser opened automatically</li>
                    <li>• Navigated to Torrent Power website</li>
                    <li>• Form fields filled with your data</li>
                    <li>• Application submitted successfully</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 What's Next:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Check your email for confirmation</li>
                    <li>• Track status on Torrent Power portal</li>
                    <li>• Processing time: {provider.processingTime}</li>
                    <li>• Keep your reference number safe</li>
                  </ul>
                </div>
              </div>

              {automationResult.total_filled && (
                <div className="bg-green-100 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    📊 <strong>Automation Stats:</strong> {automationResult.total_filled}/{automationResult.total_fields || 6} fields filled successfully
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Banner - Shows if automation fails */}
      {automationCompleted && automationResult && !automationResult.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-800 mb-2">❌ Automation Failed</h3>
              <p className="text-red-700 mb-4">
                {automationResult.message || automationResult.error || 'The automation process encountered an error.'}
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Alternative Options:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Try the automation again</li>
                  <li>• Use the "Open Manually" option</li>
                  <li>• Contact Torrent Power directly</li>
                  <li>• Visit their office for assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <Link
            to={`/service-providers/${serviceType}/name-change`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{service.name} Name Change Application</h1>
            <p className="text-gray-600 text-lg">{service.nameHindi} नाम परिवर्तन आवेदन</p>
            <p className="text-gray-500 text-sm mt-1">Provider: {provider.name} ({provider.type})</p>
          </div>
        </div>
      </div>

      {/* Provider Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Application Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Processing Time:</span>
                <p className="text-blue-700">{provider.processingTime}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Application Fees:</span>
                <p className="text-blue-700">{provider.fees}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Provider Type:</span>
                <p className="text-blue-700">{provider.type}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Application Form</h2>

        {/* Torrent Power Specific Fields - Only for Torrent Power */}
        {providerId === 'torrent-power' ? (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Torrent Power Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* City Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city || 'Ahmedabad'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                </select>
              </div>

              {/* Service Number */}
              {renderField('serviceNumber', 'Service Number', 'text', true)}

              {/* T No (Transaction/Token Number) */}
              {renderField('tNumber', 'T No (Transaction Number)', 'text', true)}

              {/* Mobile Number */}
              {renderField('mobile', 'Mobile Number', 'tel', true)}

              {/* Email */}
              {renderField('email', 'Email Address', 'email', true)}

              {/* Confirm Email */}
              {renderField('confirmEmail', 'Confirm Email Address', 'email', true)}
            </div>
          </div>
        ) : (
          // Original form for all other providers
          <>
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('currentName', 'Current Name (as per connection)')}
                {renderField('newName', 'New Name (as per documents)')}
                {renderField('fatherName', "Father's Name")}
                {renderField('motherName', "Mother's Name")}
                {renderField('dateOfBirth', 'Date of Birth', 'date')}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('mobile', 'Mobile Number', 'tel')}
                {renderField('email', 'Email Address', 'email')}
                {renderField('address', 'Current Address')}
                {renderField('pincode', 'PIN Code')}
              </div>
            </div>

            {/* Connection Details */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Connection Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('connectionNumber', 'Connection/Consumer Number')}
                {renderField('registeredAddress', 'Registered Address')}

                {/* Provider Specific Fields */}
                {provider.type === 'Government' && (
                  <>
                    {renderField('aadhaarNumber', 'Aadhaar Number')}
                    {renderField('rationCardNumber', 'Ration Card Number')}
                  </>
                )}

                {provider.type === 'Private' && provider.name !== 'Torrent Power' && (
                  <>
                    {renderField('customerID', 'Customer ID')}
                    {renderField('accountNumber', 'Account Number')}
                  </>
                )}

                {/* Service Specific Fields */}
                {provider.specificFields.includes('subdivisionCode') &&
                  renderField('subdivisionCode', 'Subdivision Code')}
                {provider.specificFields.includes('consumerCategory') &&
                  renderField('consumerCategory', 'Consumer Category')}
                {provider.specificFields.includes('loadSanctioned') &&
                  renderField('loadSanctioned', 'Load Sanctioned (KW)')}
                {provider.specificFields.includes('wardNumber') &&
                  renderField('wardNumber', 'Ward Number')}
                {provider.specificFields.includes('propertyNumber') &&
                  renderField('propertyNumber', 'Property Number')}
                {provider.specificFields.includes('surveyNumber') &&
                  renderField('surveyNumber', 'Survey Number')}
              </div>
            </div>

            {/* Document Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Required Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {provider.documents.includes('identityProof') &&
                  renderFileUpload('identityProof', 'Identity Proof (Aadhaar/PAN/Passport)')}
                {provider.documents.includes('addressProof') &&
                  renderFileUpload('addressProof', 'Address Proof')}
                {provider.documents.includes('nameChangeProof') &&
                  renderFileUpload('nameChangeProof', 'Name Change Proof (Marriage Certificate/Gazette/Affidavit)')}
                {provider.documents.includes('connectionBill') &&
                  renderFileUpload('connectionBill', 'Latest Connection Bill')}
                {provider.documents.includes('propertyDocuments') &&
                  renderFileUpload('propertyDocuments', 'Property Documents')}
              </div>
            </div>
          </>
        )}

        {/* Submit or Auto-Fill Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            to={`/service-providers/${serviceType}/name-change`}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Providers
          </Link>

          <div className="flex items-center gap-4">
            {providerId === 'torrent-power' && provider.aiSupported ? (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" />
                Start
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Automation Modal */}
      {showAutomation && !automationInProgress && !automationCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">AI-Powered Automation</h2>
                  <p className="text-gray-600">Torrent Power Name Change Application</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">How it works:</h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li>1. We'll open Torrent Power's website in a new browser window</li>
                  <li>2. Our AI will automatically fill in your application form</li>
                  <li>3. You'll review and submit the form manually for security</li>
                  <li>4. Your application will be submitted successfully</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Important:</strong> Please keep the browser window open and don't close it during the automation process. You may need to log in manually if required.
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Your Information:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Service Number</p>
                    <p className="font-semibold text-gray-800">{formData.serviceNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">T No</p>
                    <p className="font-semibold text-gray-800">{formData.tNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Mobile</p>
                    <p className="font-semibold text-gray-800">{formData.mobile}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800 truncate">{formData.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleCloseAutomation}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAutoFill}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Automation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal - Shows during automation */}
      {automationInProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Torrent Power | Name Change Application</h2>
                </div>
              </div>
              <button
                disabled
                className="text-white opacity-50 cursor-not-allowed"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1">
              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
                  <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Fields Filled */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-center text-gray-600 mb-2">Fields Filled</h3>
                <p className="text-center text-3xl font-bold text-blue-600">{fieldsFilledCount}/5</p>
              </div>

              {/* Status Logs */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Real-time Status Log</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                  {statusLogs.length === 0 ? (
                    <p className="text-gray-500 text-sm">Waiting to start...</p>
                  ) : (
                    statusLogs.map((log, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 flex-shrink-0">•</span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal - Shows after automation completes */}
      {automationCompleted && automationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <h2 className="text-xl font-bold">Torrent Power | Name Change Application</h2>
              </div>
              <button
                onClick={handleCloseAutomation}
                className="text-white hover:opacity-80 transition-opacity text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {automationResult.success ? (
                <>
                  {/* Success State */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Application Submitted Successfully</h3>

                  {/* Checklist */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">City</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Service Number</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">T Number</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Mobile Number</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Email</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded">Form filled successfully</span>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <div className="flex gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-green-800 mb-1">Application Submitted Successfully</h4>
                        <p className="text-green-700 text-sm">Your name change request has been submitted to Torrent Power. You will receive a confirmation email shortly.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Error State */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Application Submission Failed</h3>

                  {/* Checklist with some items checked */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">City</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Service Number</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">T Number</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Mobile Number</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Email</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded">Form filled successfully</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-800 mb-1">Application has not been submitted due to incorrect data.</h4>
                        <p className="text-red-700 text-sm">{automationResult.message}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* OK Button */}
              <button
                onClick={() => {
                  setShowAutomation(false);
                  setAutomationCompleted(false);
                  setAutomationInProgress(false);
                  setStatusLogs([]);
                  setProgress(0);
                  setFieldsFilledCount(0);
                }}
                className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NameChangeApplication;