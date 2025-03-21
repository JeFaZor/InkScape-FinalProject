import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, User, MapPin } from 'lucide-react';

const SignUpForm = ({ formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const tattooStyles = [
    'Traditional', 'New School', 'Anime', 'Fineline', 'Geometric',
    'Micro Realism', 'Realism', 'Dot Work', 'Dark Art', 'Flowers',
    'Surrealism', 'Trash Polka'
  ];

  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStyleChange = (style) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };

  const PasswordStrengthIndicator = () => (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all ${index < passwordStrength
                ? 'bg-purple-600'
                : 'bg-gray-700'
              }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        {passwordStrength === 0 && 'Enter password'}
        {passwordStrength === 1 && 'Weak'}
        {passwordStrength === 2 && 'Fair'}
        {passwordStrength === 3 && 'Good'}
        {passwordStrength === 4 && 'Strong'}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-gray-300 text-sm mb-4">I am a...</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserType('artist')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${userType === 'artist'
                ? 'border-purple-600 bg-purple-600/20'
                : 'border-gray-700 hover:border-purple-600/50'
              }`}
          >
            <h3 className="text-white font-medium mb-1">Tattoo Artist</h3>
            <p className="text-gray-400 text-sm">I own or work at a tattoo studio</p>
          </button>
          <button
            type="button"
            onClick={() => setUserType('client')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${userType === 'client'
                ? 'border-purple-600 bg-purple-600/20'
                : 'border-gray-700 hover:border-purple-600/50'
              }`}
          >
            <h3 className="text-white font-medium mb-1">Looking for an Artist</h3>
            <p className="text-gray-400 text-sm">I want to get a tattoo</p>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-gray-300 text-sm mb-2">Username</label>
          <div className="relative group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors focus-visible:outline-none"
              placeholder="Choose a username"
            />
            <User className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div className="relative">
          <label className="block text-gray-300 text-sm mb-2">Email</label>
          <div className="relative group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors focus-visible:outline-none"
              placeholder="Enter your email"
            />
            <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div className="relative">
          <label className="block text-gray-300 text-sm mb-2">Password</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors"
              placeholder="Choose a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <PasswordStrengthIndicator />
        </div>
      </div>

      {userType === 'artist' && (
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">Studio Location</label>
            <div className="relative group">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors focus-visible:outline-none"
                placeholder="Enter your studio location"
              />
              <MapPin className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-3">Tattoo Styles</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {tattooStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleStyleChange(style)}
                  className={`p-2 rounded-lg text-sm transition-all duration-200 ${formData.styles.includes(style)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;