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
          <img src="/images/costImage.png" alt="요금 안내 헤더 이미지" />
        </div>
      </section>

      {/* 아래쪽 섹션 */}
      <section className="pricing-details">
        <h2 className="main-banner">요금 안내</h2>
        <div className="pricing-section">
          {/* 광고 요금 */}
          <div className="pricing-category">
            <img src="/images/costImage.png" alt="광고 요금" className="pricing-image" />
            <h3>광고 요금</h3>
            <ul>
              <li>소셜 미디어 광고: 100,000원/월</li>
              <li>검색 엔진 광고: 200,000원/월</li>
              <li>배너 광고: 150,000원/월</li>
            </ul>
          </div>
          {/* 사용자 요금 */}
          <div className="pricing-category">
            <img src="/images/costImage.png" alt="사용자 요금" className="pricing-image" />
            <h3>사용자 요금</h3>
            <ul>
              <li>개인 사용자: 50,000원/월</li>
              <li>소규모 기업: 100,000원/월</li>
              <li>대기업: 300,000원/월</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cost;
