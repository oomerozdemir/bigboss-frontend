import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const stores = [
    {
      id: 1,
      name: t('contact.osmanbey_store'),
      address: "Halaskargazi Cad. No:92-D, Osmanbey, İstanbul",
      phone: "530 642 53 43",
      hours: `${t('contact.weekdays')}: 10:00 - 20:00\n${t('contact.sunday')}: 11:00 - 19:00`,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.3856282842146!2d28.98446!3d41.05361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8163287d85a4c6b1!2sHalaskargazi%20Cd.%20No%3A92%2C%2034371%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1234567890"
    },
    {
      id: 2,
      name: t('contact.sisli_store'),
      address: "Halaskargazi Cad. No:150-B, Şişli, İstanbul",
      phone: "530 774 99 86",
      hours: `${t('contact.weekdays')}: 10:00 - 20:00\n${t('contact.sunday')}: 11:00 - 19:00`,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.2856282842146!2d28.98746!3d41.05661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8163287d85a4c6b1!2sHalaskargazi%20Cd.%20No%3A150%2C%2034371%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1234567891"
    },
    {
      id: 3,
      name: t('contact.nisantasi_store'),
      address: "Rumeli Cad. No:72-74, Nişantaşı, İstanbul",
      phone: "530 072 16 99",
      hours: `${t('contact.weekdays')}: 10:00 - 20:00\n${t('contact.sunday')}: 11:00 - 19:00`,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1856282842146!2d28.99446!3d41.05861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8163287d85a4c6b1!2sRumeli%20Cd.%20No%3A72%2C%2034367%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1234567892"
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form gönderildi:', formData);
    alert(t('contact.success_msg'));
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const faqItems = [
    { q: t('contact.faq_q1'), a: t('contact.faq_a1') },
    { q: t('contact.faq_q2'), a: t('contact.faq_a2') },
    { q: t('contact.faq_q3'), a: t('contact.faq_a3') },
    { q: t('contact.faq_q4'), a: t('contact.faq_a4') },
    { q: t('contact.faq_q5'), a: t('contact.faq_a5') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Phone className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('contact.phone')}</h3>
            <p className="text-gray-600 text-sm mb-2">Osmanbey: 530 642 53 43</p>
            <p className="text-gray-600 text-sm mb-2">Şişli: 530 774 99 86</p>
            <p className="text-gray-600 text-sm">Nişantaşı: 530 072 16 99</p>
          </div>

          <div className="bg-white p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Mail className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('contact.email')}</h3>
            <a href="mailto:bigbosstekstil1972@gmail.com" className="text-gray-600 text-sm hover:text-black transition-colors">
              bigbosstekstil1972@gmail.com
            </a>
          </div>

          <div className="bg-white p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Clock className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('contact.working_hours')}</h3>
            <p className="text-gray-600 text-sm mb-1">{t('contact.weekdays')}</p>
            <p className="text-gray-600 text-sm mb-2">10:00 - 20:00</p>
            <p className="text-gray-600 text-sm mb-1">{t('contact.sunday')}</p>
            <p className="text-gray-600 text-sm">11:00 - 19:00</p>
          </div>
        </div>
      </div>

      {/* Contact Form & FAQ Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
              {t('contact.write_to_us')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('contact.write_desc')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                  {t('contact.full_name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  placeholder={t('contact.full_name_placeholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                    {t('contact.email_label')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    placeholder={t('contact.email_placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                    {t('contact.phone_label')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    placeholder={t('contact.phone_placeholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  placeholder={t('contact.subject_placeholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                  placeholder={t('contact.message_placeholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 px-8 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {t('contact.send')}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
              {t('contact.faq_title')}
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className={`border-b border-gray-200 pb-6 ${index === faqItems.length - 1 ? '' : ''}`}>
                  <h3 className="font-bold mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Store Locations */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              {t('contact.our_stores')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('contact.stores_desc')}
            </p>
          </div>

          <div className="space-y-12">
            {stores.map((store) => (
              <div key={store.id} className="bg-white overflow-hidden shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">
                      {store.name}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-sm uppercase tracking-wider mb-1">{t('contact.address_label')}</p>
                          <p className="text-gray-600">{store.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Phone className="shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-sm uppercase tracking-wider mb-1">{t('contact.phone_label_short')}</p>
                          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-black transition-colors">
                            {store.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Clock className="shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-sm uppercase tracking-wider mb-1">{t('contact.hours_label')}</p>
                          <p className="text-gray-600 whitespace-pre-line">{store.hours}</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors duration-300 w-fit"
                    >
                      <MapPin size={18} />
                      {t('contact.get_directions')}
                    </a>
                  </div>

                  <div className="h-[400px] lg:h-full">
                    <iframe
                      src={store.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${store.name} ${t('contact.map')}`}
                    ></iframe>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
