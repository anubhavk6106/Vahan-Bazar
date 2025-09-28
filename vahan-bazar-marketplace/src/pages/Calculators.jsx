import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Fuel, TrendingUp, Calendar, Percent, Info, ChevronRight } from 'lucide-react';

const Calculators = () => {
  // EMI Calculator State
  const [emiCalculator, setEmiCalculator] = useState({
    vehiclePrice: 150000,
    downPayment: 30000,
    loanTenure: 24,
    interestRate: 12.5,
    emi: 0,
    totalInterest: 0,
    totalAmount: 0,
    processingFee: 2500
  });

  // Fuel Cost Calculator State
  const [fuelCalculator, setFuelCalculator] = useState({
    vehicleType: 'petrol', // petrol, electric, hybrid
    dailyDistance: 30,
    fuelPrice: 105, // per liter for petrol, per kWh for electric
    mileage: 45, // kmpl for petrol, km/kWh for electric
    monthlyCost: 0,
    annualCost: 0,
    fiveYearCost: 0,
    co2Emissions: 0 // kg/year
  });

  // Active calculator tab
  const [activeTab, setActiveTab] = useState('emi');

  // EMI Calculation
  useEffect(() => {
    const principal = emiCalculator.vehiclePrice - emiCalculator.downPayment;
    const monthlyRate = emiCalculator.interestRate / (12 * 100);
    const months = emiCalculator.loanTenure;

    if (principal > 0 && monthlyRate > 0 && months > 0) {
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
      const totalAmount = emi * months;
      const totalInterest = totalAmount - principal;

      setEmiCalculator(prev => ({
        ...prev,
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest)
      }));
    }
  }, [emiCalculator.vehiclePrice, emiCalculator.downPayment, emiCalculator.loanTenure, emiCalculator.interestRate]);

  // Fuel Cost Calculation
  useEffect(() => {
    const monthlyDistance = fuelCalculator.dailyDistance * 30;
    const annualDistance = fuelCalculator.dailyDistance * 365;
    
    let monthlyCost, annualCost, co2Emissions;

    if (fuelCalculator.vehicleType === 'electric') {
      // Electric vehicle calculations (kWh consumption)
      const monthlyConsumption = monthlyDistance / fuelCalculator.mileage; // kWh
      const annualConsumption = annualDistance / fuelCalculator.mileage; // kWh
      monthlyCost = monthlyConsumption * fuelCalculator.fuelPrice;
      annualCost = annualConsumption * fuelCalculator.fuelPrice;
      co2Emissions = annualConsumption * 0.82; // kg CO2/kWh (India grid average)
    } else {
      // Petrol/Hybrid calculations
      const monthlyFuelConsumption = monthlyDistance / fuelCalculator.mileage; // liters
      const annualFuelConsumption = annualDistance / fuelCalculator.mileage; // liters
      monthlyCost = monthlyFuelConsumption * fuelCalculator.fuelPrice;
      annualCost = annualFuelConsumption * fuelCalculator.fuelPrice;
      co2Emissions = annualFuelConsumption * 2.3; // kg CO2/liter of petrol
    }

    const fiveYearCost = annualCost * 5;

    setFuelCalculator(prev => ({
      ...prev,
      monthlyCost: Math.round(monthlyCost),
      annualCost: Math.round(annualCost),
      fiveYearCost: Math.round(fiveYearCost),
      co2Emissions: Math.round(co2Emissions)
    }));
  }, [fuelCalculator.dailyDistance, fuelCalculator.fuelPrice, fuelCalculator.mileage, fuelCalculator.vehicleType]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const SliderInput = ({ label, value, onChange, min, max, step, suffix, icon: Icon }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-gray-700 font-medium">
            <Icon className="h-4 w-4 text-blue-600" />
            <span>{label}</span>
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold text-lg">
              {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </span>
            <span className="text-gray-500 text-sm">{suffix}</span>
          </div>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
          />
        </div>
      </div>
    );
  };

  const EMICalculator = () => (
    <div className="space-y-8">
      {/* EMI Input Controls */}
      <div className="card p-8 space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center space-x-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          <span>EMI Calculator Settings</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SliderInput
              label="Vehicle Price"
              value={emiCalculator.vehiclePrice}
              onChange={(val) => setEmiCalculator(prev => ({ ...prev, vehiclePrice: val }))}
              min={50000}
              max={2000000}
              step={5000}
              suffix="₹"
              icon={DollarSign}
            />
            
            <SliderInput
              label="Down Payment"
              value={emiCalculator.downPayment}
              onChange={(val) => setEmiCalculator(prev => ({ ...prev, downPayment: val }))}
              min={0}
              max={emiCalculator.vehiclePrice * 0.8}
              step={1000}
              suffix="₹"
              icon={DollarSign}
            />
          </div>
          
          <div className="space-y-6">
            <SliderInput
              label="Loan Tenure"
              value={emiCalculator.loanTenure}
              onChange={(val) => setEmiCalculator(prev => ({ ...prev, loanTenure: val }))}
              min={6}
              max={84}
              step={6}
              suffix="months"
              icon={Calendar}
            />
            
            <SliderInput
              label="Interest Rate"
              value={emiCalculator.interestRate}
              onChange={(val) => setEmiCalculator(prev => ({ ...prev, interestRate: val }))}
              min={8.5}
              max={18}
              step={0.1}
              suffix="% p.a."
              icon={Percent}
            />
          </div>
        </div>
      </div>

      {/* EMI Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly EMI */}
        <div className="card p-6 text-center space-y-4">
          <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">Monthly EMI</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(emiCalculator.emi)}</p>
            <p className="text-sm text-gray-500">for {emiCalculator.loanTenure} months</p>
          </div>
        </div>

        {/* Total Interest */}
        <div className="card p-6 text-center space-y-4">
          <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto">
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">Total Interest</p>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(emiCalculator.totalInterest)}</p>
            <p className="text-sm text-gray-500">over entire tenure</p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="card p-6 text-center space-y-4">
          <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(emiCalculator.totalAmount + emiCalculator.downPayment)}</p>
            <p className="text-sm text-gray-500">principal + interest + down payment</p>
          </div>
        </div>
      </div>

      {/* EMI Breakdown Chart */}
      <div className="card p-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Loan Breakdown</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Loan Amount</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(emiCalculator.vehiclePrice - emiCalculator.downPayment)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Down Payment</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(emiCalculator.downPayment)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Processing Fee (Est.)</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(emiCalculator.processingFee)}
            </span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-gray-900">Total Payable</span>
            <span className="font-bold text-blue-600">
              {formatCurrency(emiCalculator.totalAmount + emiCalculator.downPayment + emiCalculator.processingFee)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const FuelCalculator = () => (
    <div className="space-y-8">
      {/* Fuel Calculator Controls */}
      <div className="card p-8 space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center space-x-2">
          <Fuel className="h-6 w-6 text-green-600" />
          <span>Fuel Cost Calculator</span>
        </h3>
        
        {/* Vehicle Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { type: 'petrol', label: 'Petrol', icon: '⛽', desc: 'Traditional fuel' },
            { type: 'electric', label: 'Electric', icon: '⚡', desc: 'Battery powered' },
            { type: 'hybrid', label: 'Hybrid', icon: '🔋', desc: 'Petrol + Electric' }
          ].map(({ type, label, icon, desc }) => (
            <button
              key={type}
              onClick={() => setFuelCalculator(prev => ({ ...prev, vehicleType: type }))}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                fuelCalculator.vehicleType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-semibold">{label}</div>
              <div className="text-sm">{desc}</div>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SliderInput
              label="Daily Distance"
              value={fuelCalculator.dailyDistance}
              onChange={(val) => setFuelCalculator(prev => ({ ...prev, dailyDistance: val }))}
              min={5}
              max={200}
              step={5}
              suffix="km"
              icon={TrendingUp}
            />
            
            <SliderInput
              label={fuelCalculator.vehicleType === 'electric' ? 'Electricity Rate' : 'Fuel Price'}
              value={fuelCalculator.fuelPrice}
              onChange={(val) => setFuelCalculator(prev => ({ ...prev, fuelPrice: val }))}
              min={fuelCalculator.vehicleType === 'electric' ? 3 : 80}
              max={fuelCalculator.vehicleType === 'electric' ? 15 : 130}
              step={fuelCalculator.vehicleType === 'electric' ? 0.5 : 1}
              suffix={fuelCalculator.vehicleType === 'electric' ? '₹/kWh' : '₹/liter'}
              icon={DollarSign}
            />
          </div>
          
          <div className="space-y-6">
            <SliderInput
              label={fuelCalculator.vehicleType === 'electric' ? 'Energy Efficiency' : 'Fuel Efficiency'}
              value={fuelCalculator.mileage}
              onChange={(val) => setFuelCalculator(prev => ({ ...prev, mileage: val }))}
              min={fuelCalculator.vehicleType === 'electric' ? 3 : 25}
              max={fuelCalculator.vehicleType === 'electric' ? 8 : 70}
              step={fuelCalculator.vehicleType === 'electric' ? 0.1 : 1}
              suffix={fuelCalculator.vehicleType === 'electric' ? 'km/kWh' : 'kmpl'}
              icon={Fuel}
            />
            
            {/* Information Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Calculation Note:</p>
                  <p>
                    {fuelCalculator.vehicleType === 'electric' 
                      ? 'Electric vehicles typically offer 3-8 km/kWh efficiency and electricity costs ₹3-15/kWh.'
                      : 'Two-wheelers typically offer 25-70 kmpl efficiency with current fuel prices around ₹80-130/liter.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Cost Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Cost */}
        <div className="card p-6 text-center space-y-4">
          <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">Monthly Cost</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(fuelCalculator.monthlyCost)}</p>
            <p className="text-sm text-gray-500">based on daily usage</p>
          </div>
        </div>

        {/* Annual Cost */}
        <div className="card p-6 text-center space-y-4">
          <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto">
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">Annual Cost</p>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(fuelCalculator.annualCost)}</p>
            <p className="text-sm text-gray-500">yearly fuel expense</p>
          </div>
        </div>

        {/* 5-Year Cost */}
        <div className="card p-6 text-center space-y-4">
          <div className="p-3 bg-red-100 rounded-full w-fit mx-auto">
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">5-Year Cost</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(fuelCalculator.fiveYearCost)}</p>
            <p className="text-sm text-gray-500">total fuel cost projection</p>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="card p-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Environmental Impact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {fuelCalculator.co2Emissions.toLocaleString()}
            </div>
            <p className="text-gray-600">kg CO₂ emissions per year</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {Math.round(fuelCalculator.co2Emissions / 22).toLocaleString()}
            </div>
            <p className="text-gray-600">equivalent trees needed to offset</p>
          </div>
        </div>
        
        {fuelCalculator.vehicleType === 'electric' && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Great choice!</strong> Electric vehicles produce significantly lower emissions compared to petrol vehicles, 
              especially when charged with renewable energy sources.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Calculators
          </h1>
          <p className="text-xl text-gray-600">
            Plan your purchase with our EMI and fuel cost calculators
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('emi')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'emi'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>EMI Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('fuel')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'fuel'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Fuel className="h-4 w-4" />
              <span>Fuel Calculator</span>
            </button>
          </div>
        </div>

        {/* Calculator Content */}
        <div className="tab-content">
          {activeTab === 'emi' && <EMICalculator />}
          {activeTab === 'fuel' && <FuelCalculator />}
        </div>

        {/* Tips Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 EMI Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Higher down payment reduces EMI and total interest</span>
              </li>
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Shorter tenure saves interest but increases EMI</span>
              </li>
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Compare rates from different lenders</span>
              </li>
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Consider processing fees and insurance costs</span>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🌱 Fuel Savings Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Maintain steady speed to improve fuel efficiency</span>
              </li>
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Regular maintenance keeps mileage optimal</span>
              </li>
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Consider electric vehicles for daily commuting</span>
              </li>
              <li className="flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Plan routes to minimize travel distance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;