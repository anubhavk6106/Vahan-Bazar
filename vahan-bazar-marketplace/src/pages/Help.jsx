import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Clock,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Shield,
  CreditCard,
  Truck,
  Settings,
  Users,
  Star,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'account', name: 'Account & Profile', icon: Users },
    { id: 'vehicles', name: 'Vehicles & Search', icon: Truck },
    { id: 'booking', name: 'Bookings & Test Rides', icon: Calendar },
    { id: 'payments', name: 'Payments & Financing', icon: CreditCard },
    { id: 'security', name: 'Safety & Security', icon: Shield },
    { id: 'technical', name: 'Technical Issues', icon: Settings }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I create an account on Vahan Bazar?',
      answer: 'Creating an account is simple! Click on the "Register" button in the top right corner, fill in your details including name, email, phone number, and create a secure password. You\'ll receive a verification email to confirm your account.'
    },
    {
      id: 2,
      category: 'account',
      question: 'I forgot my password. How can I reset it?',
      answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      id: 3,
      category: 'vehicles',
      question: 'How do I search for specific vehicles?',
      answer: 'Use our advanced search filters on the Browse page. You can filter by category (bikes, scooters, EVs), brand, price range, fuel type, and more. You can also use the search bar to find specific models.'
    },
    {
      id: 4,
      category: 'vehicles',
      question: 'Are the vehicle prices accurate and up-to-date?',
      answer: 'Yes! Our prices are updated regularly and sourced directly from authorized dealers. Prices shown are ex-showroom prices, and on-road prices may vary by location due to taxes and registration fees.'
    },
    {
      id: 5,
      category: 'booking',
      question: 'How can I book a test ride?',
      answer: 'Simply go to any vehicle detail page and click "Book Test Ride". Fill in your details, preferred date and time, and submit. The dealer will contact you within 24 hours to confirm your test ride appointment.'
    },
    {
      id: 6,
      category: 'booking',
      question: 'Is test riding free?',
      answer: 'Yes! Test rides are completely free. You just need a valid driving license and need to be above 18 years of age. Some dealers may require a refundable security deposit.'
    },
    {
      id: 7,
      category: 'payments',
      question: 'What financing options are available?',
      answer: 'We partner with leading banks and NBFCs to offer competitive loan rates starting from 8.5% per annum. You can get loans for up to 85% of the vehicle value with flexible tenure options from 12 to 60 months.'
    },
    {
      id: 8,
      category: 'payments',
      question: 'How do I use the EMI calculator?',
      answer: 'Go to our EMI Calculator page, enter the vehicle price, down payment amount, interest rate, and loan tenure. The calculator will instantly show your monthly EMI amount and total interest payable.'
    },
    {
      id: 9,
      category: 'security',
      question: 'Is my personal information safe?',
      answer: 'Absolutely! We use bank-grade encryption to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for more details.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'The website is loading slowly. What should I do?',
      answer: 'Try refreshing the page or clearing your browser cache. Make sure you have a stable internet connection. If the issue persists, try using a different browser or contact our technical support team.'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Vehicles',
      description: 'Explore our wide range of two-wheelers',
      icon: Truck,
      link: '/browse',
      color: 'bg-blue-500'
    },
    {
      title: 'Book Test Ride',
      description: 'Schedule a free test ride today',
      icon: Calendar,
      link: '/test-ride',
      color: 'bg-green-500'
    },
    {
      title: 'EMI Calculator',
      description: 'Calculate your monthly payments',
      icon: CreditCard,
      link: '/calculators',
      color: 'bg-purple-500'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageSquare,
      link: '/contact',
      color: 'bg-orange-500'
    }
  ];

  const contactMethods = [
    {
      title: 'Phone Support',
      description: 'Mon-Sun, 9 AM - 9 PM',
      contact: '1800-123-4567',
      icon: Phone,
      color: 'text-blue-600'
    },
    {
      title: 'Email Support',
      description: 'Response within 24 hours',
      contact: 'support@vahanbazar.com',
      icon: Mail,
      color: 'text-green-600'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our AI assistant',
      contact: 'Available 24/7',
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'Visit Us',
      description: 'Find our nearest showroom',
      contact: '500+ locations across India',
      icon: MapPin,
      color: 'text-orange-600'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions, get support, and learn how to make the most of Vahan Bazar
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
              <ChevronRight className="h-4 w-4 text-gray-400 mt-2 group-hover:text-blue-600 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Contact Methods */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Our Support Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                <div className={`${method.color} mx-auto mb-3`}>
                  <method.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                <p className="text-sm font-medium text-gray-900">{method.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {helpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <div className="border-t pt-4">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching questions found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or browse different categories</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mt-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </Link>
            <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              Start Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;