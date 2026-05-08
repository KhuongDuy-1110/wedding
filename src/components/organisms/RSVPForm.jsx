import React, { useState, useEffect } from 'react';

const RSVPForm = ({guestName}) => {
  const [formData, setFormData] = useState({
    name: guestName || '',
    message: '',
    attendance: 'Sẽ đến dự tiệc'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guestName) {
      setFormData(prev => ({ ...prev, name: guestName }));
    }
  }, [guestName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzot0LvbltqOMrPWDdc8v06hify_63VtomlU4gHry_RczfU6kOdDrc1KB3eP_TeZ06t/exec'; 
    
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        alert('Cảm ơn bạn đã gửi lời chúc!');
        setFormData({ name: '', message: '', attendance: 'Sẽ đến dự tiệc' });
      } else {
        alert('Có lỗi khi lưu dữ liệu, vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Có lỗi kết nối, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 font-sans text-gray-800">
    <h2 className={`text-center text-[48px] text-[#222] font-couple tracking-[3px] mb-s15`} style={{ textTransform: "unset", marginBottom: "30px" }}>
          Gửi lời chúc
        </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Input Tên */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tên hoặc nickname của bạn"
            disabled={!!guestName} // Disable nếu guestName có giá trị (truthy)
            className={`w-full border border-gray-400 rounded-full px-5 py-3 transition-colors 
              ${guestName 
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed border-gray-300' // Styling khi bị disable
                : 'bg-white focus:outline-none focus:border-gray-600' // Styling khi cho phép nhập
              }
            `}
            required
          />
        </div>

        {/* Textarea Lời chúc */}
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Viết lời chúc ở đây ..."
            rows="5"
            className="w-full border border-gray-400 rounded-2xl px-5 py-3 focus:outline-none focus:border-gray-600 resize-none transition-colors"
            required
          ></textarea>
        </div>

        {/* Radio buttons Xác nhận tham dự */}
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium mt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" name="attendance" value="Sẽ đến dự tiệc" 
              checked={formData.attendance === 'Sẽ đến dự tiệc'} 
              onChange={handleChange} className="w-4 h-4 accent-gray-800" 
            />
            <span>Sẽ đến dự tiệc</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" name="attendance" value="Không thể đến dự" 
              checked={formData.attendance === 'Không thể đến dự'} 
              onChange={handleChange} className="w-4 h-4 accent-gray-800" 
            />
            <span>Không thể đến dự</span>
          </label>
        </div>

        {/* Cảnh báo trình duyệt */}
        <p className="text-xs text-center text-gray-500 italic px-4">
          Nếu không thể gửi lời nhắn bằng trình duyệt trong Messenger, hãy thử mở trình duyệt bên ngoài (Chrome, Safari,...)
        </p>

        {/* Nút Submit & Xem lời chúc */}
        <div className="space-y-3 pt-2">
          <button
  type="submit"
  disabled={loading} // Disable nút khi đang loading
  className={`w-full border border-gray-700 rounded-full py-3 font-semibold transition-colors flex justify-center items-center 
    ${loading 
      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300' // Trạng thái khi bị disable
      : 'bg-white hover:bg-gray-100' // Trạng thái bình thường
    }`}
>
  {loading ? (
    <>
      <svg 
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Đang gửi...
    </>
  ) : (
    'Gửi lời nhắn'
  )}
</button>
          
          {/* <button
            type="button"
            className="w-full border border-gray-700 rounded-full py-3 font-semibold hover:bg-gray-100 transition-colors"
          >
            Xem lời chúc
          </button> */}
        </div>

      </form>
    </div>
  );
};

export default RSVPForm;