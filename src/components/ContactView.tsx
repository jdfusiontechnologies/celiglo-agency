import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { CeligloStorage } from '../data/storage';

export const ContactView: React.FC = () => {
  const settings = CeligloStorage.getSettings();
  const areas = CeligloStorage.getServiceAreas(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errs.name = 'Full name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email is required.';
    if (!phone.trim() || phone.trim().length < 9) errs.phone = 'Valid phone number is required.';
    if (!subject.trim()) errs.subject = 'Subject is required.';
    if (!message.trim() || message.trim().length < 10) errs.message = 'Please provide details in your message (at least 10 characters).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      CeligloStorage.createMessage(name, email, phone, subject, message);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setErrors({});
    } catch {
      setErrors({ form: 'Could not send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C] bg-[#EAF5ED] px-3 py-1 rounded-md">
            Customer Inquiries &amp; Operations Support
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight">
            Contact Celiglo Agency Limited
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
            Have questions about regular residential collection, setting up commercial bins, or recycling partnerships in your area? Speak directly with our operations dispatch team.
          </p>
        </div>

        {/* Contact Info Cards & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-2xl space-y-6 border border-neutral-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#16803C]" />
                Dispatch &amp; Operations
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-neutral-400 block uppercase tracking-wider font-semibold">
                    Customer Service Hotline
                  </span>
                  <a
                    href={`tel:${settings.phone_primary}`}
                    className="text-base font-bold font-mono text-[#FFD42A] hover:underline"
                  >
                    {settings.phone_primary}
                  </a>
                </div>

                <div>
                  <span className="text-neutral-400 block uppercase tracking-wider font-semibold">
                    Alternate Line
                  </span>
                  <p className="text-sm font-semibold font-mono text-white">
                    {settings.phone_secondary}
                  </p>
                </div>

                <div>
                  <span className="text-neutral-400 block uppercase tracking-wider font-semibold">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${settings.email_primary}`}
                    className="text-sm font-medium text-white hover:underline truncate block"
                  >
                    {settings.email_primary}
                  </a>
                </div>

                <div>
                  <span className="text-neutral-400 block uppercase tracking-wider font-semibold">
                    Operational Hours
                  </span>
                  <p className="text-sm text-neutral-200">
                    {settings.service_hours}
                  </p>
                </div>

                <div>
                  <span className="text-neutral-400 block uppercase tracking-wider font-semibold">
                    Kenya Operational Hub
                  </span>
                  <p className="text-sm text-neutral-200 flex items-start gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
                    <span>{settings.physical_address}</span>
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4 border-t border-neutral-800">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\+/g, '')}?text=Hello%20Celiglo%20Agency%20Limited,%20I%20have%20an%20inquiry%20regarding%20waste%20management%20services.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#FFD42A]" />
                  Chat on WhatsApp Dispatch
                </a>
              </div>
            </div>

            {/* Active Coverage List */}
            <div className="bg-[#F3F4F3] border border-[#E5E7EB] p-6 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Current Active Coverage Zones
              </h4>
              <p className="text-xs text-[#6B7280]">
                Trucks run scheduled daily and weekly routes in the following confirmed zones:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {areas.map((a) => (
                  <span
                    key={a.id}
                    className="text-[11px] bg-white border border-[#E5E7EB] px-2 py-1 rounded text-[#252525] font-medium"
                  >
                    {a.area_name} ({a.county})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Functional Inquiry Form */}
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[#111111]">
                Send an Inquiry or Message
              </h3>
              <p className="text-xs text-[#6B7280] mt-1">
                Fill in the details below and an operations officer will respond via phone or email promptly.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-[#EAF5ED] border border-[#16803C]/30 text-[#0f5c2b] text-xs rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#16803C] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-sm">Message Sent Successfully!</strong>
                  <span>
                    Thank you. We have received your inquiry. Our support team will get in touch shortly.
                  </span>
                </div>
              </div>
            )}

            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Grace Mwangi"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 700 000 000"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Subject / Area of Interest <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Residential Collection in Kilimani"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                  />
                  {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Message Details <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide your location, volume of waste, or any specific questions..."
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending Message...' : 'Send Inquiry Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
