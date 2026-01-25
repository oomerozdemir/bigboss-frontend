import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
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
      name: "Osmanbey Mağazası",
      address: "Halaskargazi Cad. No:92-D, Osmanbey, İstanbul",
      phone: "530 642 53 43",
      hours: "Pazartesi - Cumartesi: 10:00 - 20:00\nPazar: 11:00 - 19:00",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.3856282842146!2d28.98446!3d41.05361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8163287d85a4c6b1!2sHalaskargazi%20Cd.%20No%3A92%2C%2034371%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1234567890"
    },
    {
      id: 2,
      name: "Şişli Mağazası",
      address: "Halaskargazi Cad. No:150-B, Şişli, İstanbul",
      phone: "530 774 99 86",
      hours: "Pazartesi - Cumartesi: 10:00 - 20:00\nPazar: 11:00 - 19:00",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.2856282842146!2d28.98746!3d41.05661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8163287d85a4c6b1!2sHalaskargazi%20Cd.%20No%3A150%2C%2034371%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1234567891"
    },
    {
      id: 3,
      name: "Nişantaşı-Ömür Inn Mağazası",
      address: "Rumeli Cad. No:72-74, Nişantaşı, İstanbul",
      phone: "530 072 16 99",
      hours: "Pazartesi - Cumartesi: 10:00 - 20:00\nPazar: 11:00 - 19:00",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1856282842146!2d28.99446!3d41.05861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8163287d85a4c6b1!2sRumeli%20Cd.%20No%3A72%2C%2034367%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1234567892"
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log('Form gönderildi:', formData);
    alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            İletişim
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. 
            Size yardımcı olmaktan mutluluk duyarız.
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
            <h3 className="text-lg font-bold mb-2">Telefon</h3>
            <p className="text-gray-600 text-sm mb-2">Osmanbey: 530 642 53 43</p>
            <p className="text-gray-600 text-sm mb-2">Şişli: 530 774 99 86</p>
            <p className="text-gray-600 text-sm">Nişantaşı: 530 072 16 99</p>
          </div>

          <div className="bg-white p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Mail className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">E-posta</h3>
            <a href="mailto:bigbosstekstil1972@gmail.com" className="text-gray-600 text-sm hover:text-black transition-colors">
              bigbosstekstil1972@gmail.com
            </a>
          </div>

          <div className="bg-white p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Clock className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">Çalışma Saatleri</h3>
            <p className="text-gray-600 text-sm mb-1">Pazartesi - Cumartesi</p>
            <p className="text-gray-600 text-sm mb-2">10:00 - 20:00</p>
            <p className="text-gray-600 text-sm mb-1">Pazar</p>
            <p className="text-gray-600 text-sm">11:00 - 19:00</p>
          </div>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
              Bize Yazın
            </h2>
            <p className="text-gray-600 mb-8">
              Aşağıdaki formu doldurarak bize mesaj gönderebilirsiniz. 
              En kısa sürede size dönüş yapacağız.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                  Adınız Soyadınız *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  placeholder="Adınızı ve soyadınızı girin"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    placeholder="0555 555 55 55"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                  Konu *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  placeholder="Mesajınızın konusu"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2 uppercase tracking-wider">
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 px-8 font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Mesaj Gönder
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold mb-2">Siparişlerim ne kadar sürede teslim edilir?</h3>
                <p className="text-gray-600 text-sm">
                  İstanbul içi siparişleriniz 1-2 iş günü, İstanbul dışı siparişleriniz ise 2-5 iş günü içinde kargoya teslim edilir.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold mb-2">İade politikanız nedir?</h3>
                <p className="text-gray-600 text-sm">
                  Ürünlerimizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Ürün kullanılmamış ve etiketli olmalıdır.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold mb-2">Hangi ödeme yöntemlerini kabul ediyorsunuz?</h3>
                <p className="text-gray-600 text-sm">
                  Kredi kartı, banka kartı ve kapıda ödeme seçeneklerini kullanabilirsiniz. Tüm ödemeleriniz güvenli altyapı ile korunmaktadır.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold mb-2">Beden konusunda yardım alabilir miyim?</h3>
                <p className="text-gray-600 text-sm">
                  Elbette! Mağazalarımızı arayarak veya e-posta göndererek beden konusunda profesyonel destek alabilirsiniz.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="font-bold mb-2">Toplu alımlarda indirim var mı?</h3>
                <p className="text-gray-600 text-sm">
                  Toplu alımlarınız için özel fiyat teklifi almak üzere bizimle iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Locations with Maps */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Mağazalarımız
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İstanbul'un en prestijli lokasyonlarında sizlere hizmet veriyoruz. 
              Mağazalarımıza uğrayarak koleksiyonumuzu yakından inceleyebilirsiniz.
            </p>
          </div>

          <div className="space-y-12">
            {stores.map((store) => (
              <div key={store.id} className="bg-white overflow-hidden shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Store Info */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">
                      {store.name}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-sm uppercase tracking-wider mb-1">Adres</p>
                          <p className="text-gray-600">{store.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Phone className="shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-sm uppercase tracking-wider mb-1">Telefon</p>
                          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-black transition-colors">
                            {store.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Clock className="shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-sm uppercase tracking-wider mb-1">Çalışma Saatleri</p>
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
                      Yol Tarifi Al
                    </a>
                  </div>

                  {/* Google Map */}
                  <div className="h-[400px] lg:h-full">
                    <iframe
                      src={store.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${store.name} Haritası`}
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