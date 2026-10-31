import React from 'react';
import { CeligloStorage } from '../data/storage';
import { SiteSettings } from '../types';

interface LogoProps {
  variant?: 'light' | 'dark';
  showSlogan?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  overrideSettings?: SiteSettings;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  showSlogan = false,
  className = '',
  size = 'md',
  overrideSettings,
}) => {
  const isDark = variant === 'dark';
  const settings = overrideSettings || CeligloStorage.getSettings();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const imgSizes = {
    sm: 'h-7 max-w-[120px]',
    md: 'h-9 max-w-[150px]',
    lg: 'h-12 max-w-[190px]',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  // If a custom image logo has been provided by the admin
  if (settings.logo_mode === 'custom_image' && settings.custom_logo_url) {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-center gap-2">
          <img
            src={settings.custom_logo_url}
            alt={settings.company_name}
            className={`${imgSizes[size]} object-contain`}
            onError={(e) => {
              // Fallback to text if image URL fails
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span
              className={`font-extrabold tracking-tight ${textSizes[size]} ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}
            >
              {settings.company_name}
            </span>
          </div>
        </div>
        {showSlogan && (
          <span
            className={`text-[11px] font-medium tracking-wide mt-1 ${
              isDark ? 'text-[#FFD42A]' : 'text-[#16803C]'
            }`}
          >
            &ldquo;{settings.official_slogan}&rdquo;
          </span>
        )}
      </div>
    );
  }

  // Built-in Emblem with configurable symbols
  const symbol = settings.logo_symbol || 'recycling_arrows';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* Celiglo Environmental Emblem */}
        <div
          className={`${iconSizes[size]} relative rounded-lg bg-[#16803C] flex items-center justify-center p-1.5 shadow-sm shrink-0`}
          aria-hidden="true"
        >
          {symbol === 'eco_leaf' ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-white"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="#FFD42A" strokeWidth="2.4" />
            </svg>
          ) : symbol === 'modern_clean' ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 15h4v4" stroke="#FFD42A" />
              <path d="m15 9-6 6" />
              <path d="M17 9h-4V5" stroke="#FFD42A" />
            </svg>
          ) : (
            /* Default recycling arrows */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-white"
            >
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0 0-1.8L16.5 9" />
              <path d="m11 16 3 3-3 3" />
              <path d="m17 12-4-7-4 7" stroke="#FFD42A" strokeWidth="2.4" />
            </svg>
          )}
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#FFD42A] rounded-full border-2 border-white" />
        </div>

        {/* Company Wordmark */}
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none">
            <span
              className={`font-extrabold tracking-tight ${textSizes[size]} ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}
            >
              Celiglo
            </span>
            <span
              className={`font-semibold ml-1.5 tracking-normal text-xs uppercase ${
                isDark ? 'text-[#FFD42A]' : 'text-[#16803C]'
              }`}
            >
              Agency Ltd
            </span>
          </div>
        </div>
      </div>

      {showSlogan && (
        <span
          className={`text-[11px] font-medium tracking-wide mt-1 ${
            isDark ? 'text-[#FFD42A]' : 'text-[#16803C]'
          }`}
        >
          &ldquo;{settings.official_slogan}&rdquo;
        </span>
      )}
    </div>
  );
};
