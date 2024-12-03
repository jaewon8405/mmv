import React, { useEffect, useRef, useState} from 'react';

const Home = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const steps = [
    {
      title: "무료 상담",
      description: "간편하게 상담 신청 ."
    },
    {
      title: "정보 입력",
      description: "필요한 정보를 입력하여 서비스 세부 설정을 진행하세요."
    },
    {
      title: "맞춤형 서비스 확인",
      description: "제공된 서비스 옵션을 검토하세요."
    },
    {
      title: "결제 진행",
      description: "선택한 서비스에 대해 결제를 완료하세요."
    },
    {
      title: "서비스 시작",
      description: "최적화된 광고 서비스를 바로 시작하세요!"
    },
  ];

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.firstChild.offsetWidth + 20; // 아이템 너비 + 간격
      const scrollAmount = direction === "left" ? -itemWidth : itemWidth;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e) => {
    if (containerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 드래그 거리
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const services = [
    {
      title: "영상의 카테고리 파악",
      description: "영상의 카테고리를 스스로 파악.",
      image: "./images/categories.png",
    },
    {
      title: "가장 적합한 광고",
      description: "영상의 가장 어울리는 광고 제공.",
      image: "./images/recommend.png",
    },
    {
      title: "불편한 광고 시청 시간 감소",
      description: "영상 중간에 광고가 필요없음.",
      image: "./images/view.png",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          } else {
            entry.target.classList.remove('animate');
          }
        });
      },
      { threshold: 0.5 } // 50% 이상 보일 때 애니메이션 시작
    );

    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => observer.observe(section));

    // Observer 해제
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };

    
  }, []);
  return (
    <div className="home">
      {/* Hero 섹션 */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">맞춤형 광고 서비스</h1>
          <p className="hero-description">
            영상에 가장 적합한 광고를 제공해주는<br />
            MMV의 최적화된 광고 서비스를 만나보세요.
          </p>
          <button className="cta-button">무료 상담 받기</button>
        </div>
        <div className="hero-image">
          <img src="./images/main-section1.png" alt="MMV 절세 이미지" />
        </div>
      </header>

      {/* 변경된 두 번째 섹션 */}
      <section className="features-section section">
        <h2 className="section-title">MMV의 서비스</h2>
        <div className="features-container">
          <div className="feature-card">
            <h3>영상 카테고리 분석</h3>
            <p>영상에 가장 어울리는 광고를 찾아줍니다.</p>
          </div>
          <div className="feature-card">
            <h3>가장 적합한 광고 추천</h3>
            <p>영상에 가장 적합한 광고를 선택해줍니다.</p>
          </div>
          <div className="feature-card">
            <h3>광고 삽입</h3>
            <p>영상에 광고를 추가시킵니다.</p>
          </div>
        </div>
        </section>

        {/* 3번째 섹션 */}
        <section className="how-to-use-section section">
          <h2 className="section-title">이용 방법</h2>
          <div className="slider-container">
            <div
              className="slider"
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {steps.map((step, index) => (
                <div className="step-item" key={index}>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="slider-controls">
              <button className="arrow-button left" onClick={() => handleScroll("left")}>
                <img src="./images/arrow-left.png" alt="이전" />
              </button>
              <button className="arrow-button right" onClick={() => handleScroll("right")}>
                <img src="./images/arrow-right.png" alt="다음" />
              </button>
            </div>
          </div>
        </section>
      {/* 주요 섹션 4 */}
        <section className="employee-management section">
          <div className="employee-management-header">
            <h2 className="employee-management-title">서비스 비교</h2>
            <p className="employee-management-description">
              MMV는 다른 광고와 무엇이 다를까요?
            </p>
          </div>
          <div className="employee-management-cards">
            {services.map((service, index) => (
              <div className="employee-management-card" key={index}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="employee-management-icon"
                />
                <h3 className="employee-management-card-title">{service.title}</h3>
                <p className="employee-management-card-description">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
};

export default Home;
