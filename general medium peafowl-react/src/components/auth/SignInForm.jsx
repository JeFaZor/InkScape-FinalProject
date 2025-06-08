import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const SignInForm = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-gray-300 text-sm mb-2">{t('auth.email')}</label>
        <div className="relative group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white rounded-lg py-3 pr-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors"
            placeholder={t('auth.email')}
            style={{ textAlign: 'left', direction: 'ltr' }}
          />
<Mail className="absolute left-3 top-3 text-gray-400" size={20} /></div>
      </div>

      <div className="relative">
        <label className="block text-gray-300 text-sm mb-2">{t('auth.password')}</label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white rounded-lg py-3 pr-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors"
            placeholder={t('auth.password')}
            style={{ textAlign: 'left', direction: 'ltr' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-3 text-gray-400 hover:text-gray-300 focus:outline-none"          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-600 focus:ring-offset-gray-900"
          />
              <span className="text-sm text-gray-300">{t('auth.rememberMe')}</span>
        </label>
        <button type="button" className="text-sm text-purple-400 hover:text-purple-300">
          {t('auth.forgotPassword')}
        </button>
      </div>
    </div>
  );
};

export default SignInForm;