import React from 'react';
import './ContactSupport.css'; // Import file CSS tương ứng

const ContactSupport = () => {
  return (
    <div className="contact-section">
      <div className="contact-divider">
        {/* Một đường line mỏng hoặc icon nhỏ để phân cách nhẹ nhàng với card phía trên */}
        <span>✧</span>
      </div>
      
      <h3 className="contact-title">Thông tin liên hệ hỗ trợ</h3>
      <p className="contact-subtitle">
        Nếu bạn cần hỗ trợ tìm đường hoặc có bất kỳ câu hỏi nào trong ngày cưới, vui lòng liên hệ:
      </p>

      <div className="contact-container">
        {/* Khối thông tin nhà gái */}
        <div className="contact-box">
          <p className="contact-role">Đại diện Nhà Gái</p>
          <p className="contact-name">Nguyễn Văn A</p>
          <a href="tel:0987654321" className="contact-phone">
            0987 654 321
          </a>
        </div>

        {/* Khối phân cách dọc (chỉ hiển thị trên màn hình lớn) */}
        <div className="contact-vertical-divider"></div>

        {/* Khối thông tin nhà trai */}
        <div className="contact-box">
          <p className="contact-role">Đại diện Nhà Trai</p>
          <p className="contact-name">Trần Văn B</p>
          <a href="tel:0123456789" className="contact-phone">
            0123 456 789
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;