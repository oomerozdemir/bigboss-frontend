// pages/CheckOutPage.jsx - COMPLETE FIX FOR PAYTR VALIDATION

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Tag, ArrowLeft, Loader } from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm';
import PayTRPayment from '../components/PayTRPayment';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const cartContext = useCart();
  const {
    cartItems,
    subTotal,
    discountAmount,
    shippingCost,
    finalTotal,
    appliedCoupon,
    setAppliedCoupon,
    clearCart
  } = cartContext || {};

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: 'INDIVIDUAL',
    tcNo: '',
    companyName: '',
    taxOffice: '',
    taxNumber: '',
    invoiceAddress: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const addressList = Array.isArray(data) ? data : [];
        setAddresses(addressList);
        if (addressList.length > 0) setSelectedAddress(addressList[0]);
      }
    } catch (error) {
      console.error('Adres hatası:', error);
      setAddresses([]);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error(t('checkout.coupon_enter'));
    setCouponLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: subTotal || 0 })
      });
      const data = await response.json();
      if (response.ok) {
        if (setAppliedCoupon) setAppliedCoupon(data);
        toast.success(t('checkout.coupon_success'));
        setCouponCode('');
      } else {
        toast.error(data.error || t('checkout.coupon_invalid'));
      }
    } catch (error) {
      toast.error(t('checkout.error_occurred'));
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!safeCartItems || safeCartItems.length === 0) {
      return toast.error(t('checkout.cart_empty_err'));
    }

    if (!selectedAddress) {
      return toast.error(t('checkout.select_address'));
    }

    if (!user.email || user.email.trim() === '') {
      return toast.error(t('checkout.email_missing_err'));
    }

    if (invoiceData.invoiceType === 'INDIVIDUAL') {
      if (!invoiceData.tcNo || invoiceData.tcNo.length !== 11) {
        return toast.error(t('checkout.valid_tc'));
      }
    } else if (invoiceData.invoiceType === 'CORPORATE') {
      if (!invoiceData.companyName || !invoiceData.taxOffice || !invoiceData.taxNumber) {
        return toast.error(t('checkout.fill_corporate'));
      }
    }

    setLoading(true);

    try {
      const orderData = {
        items: safeCartItems.map(item => ({
          productId: item.id,
          price: item.price,
          quantity: item.quantity,
          variant: item.selectedVariant
            ? `${item.selectedVariant.size} / ${item.selectedVariant.color}`
            : 'Standart'
        })),
        total: finalTotal || 0,
        address: `${selectedAddress.title}\n${selectedAddress.address}\n${selectedAddress.city}\nTelefon: ${selectedAddress.phone}`,
        couponCode: appliedCoupon?.code || null,
        couponId: appliedCoupon?.id || null,
        discountAmount: discountAmount || 0,
        paymentMethod: 'PAYTR',
        paymentStatus: 'PENDING',

        invoiceType: invoiceData.invoiceType,
        tcNo: invoiceData.invoiceType === 'INDIVIDUAL' ? invoiceData.tcNo : null,
        companyName: invoiceData.invoiceType === 'CORPORATE' ? invoiceData.companyName : null,
        taxOffice: invoiceData.invoiceType === 'CORPORATE' ? invoiceData.taxOffice : null,
        taxNumber: invoiceData.invoiceType === 'CORPORATE' ? invoiceData.taxNumber : null,
        invoiceAddress: invoiceData.invoiceAddress || null
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        setCreatedOrderId(result.id);
        setShowPayment(true);
        toast.success(t('checkout.order_success'));
      } else {
        toast.error(result.error || t('checkout.order_failed'));
      }
    } catch (error) {
      toast.error(t('checkout.general_error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (data) => {
    if (clearCart) clearCart();
  };

  const handlePaymentFail = (reason) => {
    console.error("❌ Callback: Ödeme başarısız", reason);
  };

  const getPayTRData = () => {
    if (!createdOrderId || !safeCartItems || safeCartItems.length === 0) {
      return null;
    }

    if (!user.email || user.email.trim() === '') {
      toast.error(t('checkout.email_missing_err'));
      return null;
    }

    const paymentAmountInKurus = Math.round((finalTotal || 0) * 100);

    const paytrData = {
      merchant_oid: createdOrderId.toString(),
      orderId: createdOrderId,
      totalAmount: finalTotal || 0,
      payment_amount: paymentAmountInKurus,
      items: safeCartItems.map(item => ({
        name: (item.name || 'Ürün').substring(0, 50),
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1
      })),
      user_name: user.name || 'Misafir',
      user_email: user.email,
      user_phone: selectedAddress?.phone || '05555555555',
      user_address: selectedAddress
        ? `${selectedAddress.address}, ${selectedAddress.city}`
        : 'Adres belirtilmemiş',
      user_ip: '0.0.0.0'
    };

    return paytrData;
  };

  if (!cartContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {showPayment && createdOrderId ? (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setShowPayment(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-semibold"
              >
                <ArrowLeft size={20}/> {t('checkout.go_back')}
              </button>

              {getPayTRData() ? (
                <PayTRPayment
                  orderData={getPayTRData()}
                  onSuccess={handlePaymentSuccess}
                  onFail={handlePaymentFail}
                />
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 font-semibold mb-4">
                    {t('checkout.payment_data_error')}
                  </p>
                  <ul className="text-sm text-red-600 mb-4 list-disc list-inside">
                    {!user.email && <li>{t('checkout.email_missing_item')}</li>}
                    {!createdOrderId && <li>{t('checkout.order_id_missing')}</li>}
                    {safeCartItems.length === 0 && <li>{t('checkout.cart_empty_item')}</li>}
                  </ul>
                  <button
                    onClick={() => {
                      setShowPayment(false);
                      if (!user.email) {
                        navigate('/hesabim');
                      } else {
                        navigate('/sepet');
                      }
                    }}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    {!user.email ? t('checkout.go_to_account') : t('checkout.go_to_cart')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                  {t('checkout.title')}
                </h1>
                <p className="text-gray-600">{t('checkout.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                  {/* Teslimat Adresi */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
                      <MapPin className="text-blue-600" size={24} /> {t('checkout.delivery_address')}
                    </h2>

                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">{t('checkout.no_address')}</p>
                        <button
                          onClick={() => navigate('/adreslerim')}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                          {t('checkout.add_address')}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedAddress?.id === addr.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                checked={selectedAddress?.id === addr.id}
                                onChange={() => setSelectedAddress(addr)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <span className="font-bold text-gray-900 block">{addr.title}</span>
                                <span className="text-sm text-gray-600 mt-1 block">{addr.address}</span>
                                <span className="text-sm text-gray-600">{addr.city}</span>
                                <span className="text-sm text-gray-600 block mt-1">{t('checkout.phone')} {addr.phone}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <InvoiceForm
                    invoiceData={invoiceData}
                    setInvoiceData={setInvoiceData}
                  />

                  {/* Kupon */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
                      <Tag className="text-blue-600" size={24} /> {t('checkout.discount_coupon')}
                    </h2>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder={t('checkout.coupon_placeholder')}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!appliedCoupon}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading || !!appliedCoupon}
                        className="bg-black text-white px-6 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? t('checkout.applying') : appliedCoupon ? t('checkout.coupon_applied') : t('checkout.apply')}
                      </button>
                    </div>

                    {appliedCoupon && (
                      <div className="mt-3 bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-green-700">
                          🎉 <strong>{appliedCoupon.code}</strong> {t('checkout.coupon_applied_msg')}
                        </span>
                        <button
                          onClick={() => {
                            if (setAppliedCoupon) setAppliedCoupon(null);
                            setCouponCode('');
                            toast.success(t('checkout.coupon_removed'));
                          }}
                          className="text-red-600 text-sm hover:underline font-semibold"
                        >
                          {t('checkout.remove_coupon')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sipariş Özeti */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 sticky top-24">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
                      <ShoppingBag className="text-blue-600" size={24} /> {t('checkout.order_summary')}
                    </h2>

                    <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
                      {safeCartItems.length > 0 ? (
                        safeCartItems.map((item, idx) => (
                          <div key={idx} className="flex gap-3 text-sm border-b pb-3">
                            <img
                              src={item.imageUrl || '/placeholder.png'}
                              className="w-12 h-16 object-cover rounded"
                              alt={item.name}
                            />
                            <div className="flex-1">
                              <p className="font-bold text-gray-900">{item.name || 'Ürün'}</p>
                              <p className="text-gray-500 text-xs">
                                {item.selectedVariant?.size || t('cart.standard')}
                                {item.selectedVariant?.color && ` / ${item.selectedVariant.color}`}
                              </p>
                              <p className="mt-1 text-gray-900">
                                {item.quantity} x {formatPrice(item.price || 0)} TL
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">{t('checkout.empty_cart')}</p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                      <div className="flex justify-between">
                        <span>{t('checkout.subtotal')}</span>
                        <span className="font-bold text-gray-900">{formatPrice(subTotal || 0)} TL</span>
                      </div>

                      {appliedCoupon && discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>{t('checkout.discount')}</span>
                          <span className="font-bold">-{formatPrice(discountAmount || 0)} TL</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>{t('checkout.shipping')}</span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600 font-bold">{t('checkout.free')}</span>
                        ) : (
                          <span className="font-bold">{formatPrice(shippingCost || 0)} TL</span>
                        )}
                      </div>

                      <div className="flex justify-between text-lg font-black text-black pt-2 border-t mt-2">
                        <span>{t('checkout.total')}</span>
                        <span className="text-2xl">{formatPrice(finalTotal || 0)} TL</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateOrder}
                      disabled={loading || safeCartItems.length === 0 || !selectedAddress || !user.email}
                      className="w-full bg-green-600 text-white py-4 rounded-lg font-bold mt-6 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          {t('checkout.processing')}
                        </>
                      ) : (
                        <>
                          <CreditCard size={20}/>
                          {t('checkout.proceed_payment')}
                        </>
                      )}
                    </button>

                    {!user.email && (
                      <p className="text-xs text-red-600 mt-2 text-center">
                        {t('checkout.email_missing')}
                      </p>
                    )}

                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">{t('checkout.secure_payment')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
