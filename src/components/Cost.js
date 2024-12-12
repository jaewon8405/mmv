import React from 'react';

const Cost = () => {
  return (
    <div className="pricing-container">
      {/* 위쪽 섹션 */}
      <section className="pricing-header">
        <div className="header-content">
          <h1>합리적인 광고 서비스</h1>
          <p>
            다양한 사용자와 기업의 요구를 충족시키기 위해 경쟁력 있는 요금 체계를 제공합니다.
            아래에서 세부 요금을 확인하세요.
          </p>
        </div>
        <div className="header-image">
          <img src="/images/cost.png" alt="요금 안내 헤더 이미지" />
        </div>
      </section>

      {/* 아래쪽 섹션 */}
      <section className="pricing-details">
        <h2 className="main-banner">요금 문의</h2>
        <div className="pricing-section">
          {/* 광고 문의 */}
          <div className="pricing-category">
            <h3>광고주 문의</h3>
            <img src="/images/advert.png" alt="광고 문의" className="pricing-image" />
            <button className="consult-button">상담하기</button>
          </div>
          {/* 사용자 문의 */}
          <div className="pricing-category">
            <h3>사용자 문의</h3>
            <img src="/images/user.png" alt="사용자 문의" className="pricing-image" />
            <button className="consult-button">상담하기</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cost;
