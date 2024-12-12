import React, { useEffect, useRef, useState} from 'react';

const Home = () => {
  const stepsRef = useRef(null);
  const reviewsRef = useRef(null);
  
  const [isDraggingSteps, setIsDraggingSteps] = useState(false);
  const [startXSteps, setStartXSteps] = useState(0);
  const [scrollLeftSteps, setScrollLeftSteps] = useState(0);

  const [isDraggingReviews, setIsDraggingReviews] = useState(false);
  const [startXReviews, setStartXReviews] = useState(0);
  const [scrollLeftReviews, setScrollLeftReviews] = useState(0);

  const steps = [
    {
      title: "무료 상담",
      description: "간편하게 상담 신청"
    },
    {
      title: "영상 분석",
      description: "영상에 카테고리를 분석"
    },
    {
      title: "광고 추천",
      description: "영상과 가장 적합한 광고 추천"
    },
    {
      title: "광고 삽입",
      description: "영상에 광고를 삽입합니다."
    },
    {
      title: "서비스 시작",
      description: "최적화된 광고 서비스를 바로 시작하세요!"
    },
  ];

  const stepsHandlers = {
    onMouseDown: (e) => {
      e.preventDefault()
      if (!stepsRef.current) return;
      setIsDraggingSteps(true);
      setStartXSteps(e.pageX - stepsRef.current.offsetLeft);
      setScrollLeftSteps(stepsRef.current.scrollLeft);
    },
    onMouseMove: (e) => {
      if (!isDraggingSteps || !stepsRef.current) return;
      e.preventDefault();
      const x = e.pageX - stepsRef.current.offsetLeft;
      const walk = (x - startXSteps) * 2; // 드래그 이동 거리
      stepsRef.current.scrollLeft = scrollLeftSteps - walk;
    },
    onMouseUp: () => setIsDraggingSteps(false),
    onMouseLeave: () => setIsDraggingSteps(false),
  };

  const reviewsHandlers = {
    onMouseDown: (e) => {
      e.preventDefault()
      if (!reviewsRef.current) return;
      setIsDraggingReviews(true);
      setStartXReviews(e.pageX - reviewsRef.current.offsetLeft);
      setScrollLeftReviews(reviewsRef.current.scrollLeft);
    },
    onMouseMove: (e) => {
      if (!isDraggingReviews || !reviewsRef.current) return;
      e.preventDefault();
      const x = e.pageX - reviewsRef.current.offsetLeft;
      const walk = (x - startXReviews) * 2; // 드래그 이동 거리
      reviewsRef.current.scrollLeft = scrollLeftReviews - walk;
    },
    onMouseUp: () => setIsDraggingReviews(false),
    onMouseLeave: () => setIsDraggingReviews(false),
  };

  const handleScroll = (ref, direction) => {
    if (!ref.current || isDraggingSteps) return;
    const container = ref.current;
    const itemWidth = container.firstChild.offsetWidth + 20; // 아이템 너비 + 간격
    const scrollAmount = direction === "left" ? -itemWidth : itemWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
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
            // 애니메이션 실행 후 더 이상 관찰하지 않음
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 } // 50% 이상 보일 때 애니메이션 시작
    );
  
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => observer.observe(section));;

    // Observer 해제
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };

    
  }, []);
  return (
    <div className="home">
      {/* Hero 섹션 */}
      <header className="hero-section">
        <div className='hero-wrapper'>
          <div className="hero-content">
            <span className="hero-title">자연스러운 광고 추가</span>
            <h1 className="hero-description">
              <p>맞춤형 광고</p>
              <p>자연스러운 광고</p>
              <p>
                <span>MMV</span>
              </p>
            </h1>
            <button className="cta-button">무료 상담 받기</button>
          </div>
          <div className="hero-image">
            <img src="./images/main-section1.png" alt="MMV 절세 이미지" />
          </div>
        </div>
      </header>

      {/* 변경된 두 번째 섹션 */}
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
        {/* 3번째 섹션 */}
      <section className="how-to-use-section section">
        <h2 className="section-title">이용 방법</h2>
        <div className="slider-container">
          <div
            className="slider"
            ref={stepsRef}
            {...stepsHandlers} // 드래그 핸들러 추가
          >
            {steps.map((step, index) => (
              <div className="step-item" key={index}>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="slider-controls">
            <button
              className="arrow-button left"
              onClick={() => handleScroll(stepsRef, "left")}
            >
              <img src="./images/arrow-left.png" alt="이전" />
            </button>
            <button
              className="arrow-button right"
              onClick={() => handleScroll(stepsRef, "right")}
            >
              <img src="./images/arrow-right.png" alt="다음" />
            </button>
          </div>
        </div>
      </section>
      {/* 주요 섹션 4 */}
      <section className="customer-reviews-section section">
        <div className='main-wrapper'>
          <div className='content'>
            <div className='main-title'>고객후기</div>
            <span>
              {"고객들의"}<br/>
              {"기대"}
            </span>
          </div>
          <div  className='slider-style'
                ref={reviewsRef}
                {...reviewsHandlers} // 드래그 핸들러 추가
                >
            <div className='swiper'>
              <div className='swiper-wrapper'>
                <div className='swiper-slider'>
                  <div className='review1'>
                    <div className='review-title'>강OO</div>
                    <div className='review-content'>
                      <p>영상 시청을 방해하지 않음과 동시에, 사용자의 알고리즘까지 자연스럽게 고려할 수 있는
                        좋은 시스템인 것 같아요!
                      </p>
                    </div>
                  </div>
                </div>
                <div className='swiper-slider'>
                  <div className='review2'>
                    <div className='review-title'>서OO</div>
                    <div className='review-content'>
                      <p>영상 속에서의 여유 공간이나 빈 곳을 이용해 시청도 방해하지 않으면서 동시에
                        홍보도 할 수 있게 한다는 것이 시청자에게, 광고주에게 모두 좋은 영향을 줄 것
                        같아요!
                      </p>
                    </div>
                  </div>
                </div>
                <div className='swiper-slider'>
                  <div className='review3'>
                    <div className='review-title'>고OO</div>
                    <div className='review-content'>
                      <p>비디오 분석 기술이 있으면 영상 내 조금 더 효율적인 방식으로
                        PPL를 삽일할 수 있어 시청자에게도 PPL를 제공하는 업체에도
                        좋은 방식이 될 거 같아요!
                      </p>
                    </div>
                  </div>
                </div>
                <div className='swiper-slider'>
                  <div className='review4'>
                    <div className='review-title'>김OO</div>
                    <div className='review-content'>
                      <p>비디오 분석 기술로 광고를 사용자들이 불편하지 않게 광고를
                        풀어냈고 중간중간 나오면 오히려 더 시선이 가서 좋은 거 같아요!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='body-footeer'>
        <div className='body-footer-wrapper'>
            <div className='ul-list'>
              <ul className='ul-service'>
                <li className='ul-service-title title-style'>
                  <span>서비스</span>
                </li>
                <li>
                  <p>홈</p>
                </li>
                <li>
                  <p>요금 안내</p>
                </li>
                <li>
                  <p>오시는길</p>
                </li>
              </ul>
              <ul className='ul-company'>
                <li className='ul-company-title title-style'>
                  <span>회사</span>
                </li>
                <li>
                  <p>블로그</p>
                </li>
              </ul>
              <ul className='ul-customer-support'>
                <li className='ul-customer-support-title title-style'>
                  <span>고객지원</span>
                </li>
                <li>
                  <p>이용약관</p>
                </li>
                <li>
                  <p>개인정보처리방침</p>
                </li>
              </ul>
              <ul className='ul-qna'>
                <li className='ul-qna-title title-style'>
                  <span>문의</span>
                </li>
                <li>
                  <p>고객센터</p>
                </li>
                <li>
                  <p>무료상담 신청하기</p>
                </li>
                <li>
                  <p>제휴 문의</p>
                </li>
              </ul>
            </div>
            <div className='footer-contact'>
              <ul className='contact-address'>
                <li>
                  <strong>위치</strong>
                </li>
                <p>상명대학교</p>
              </ul>
              <ul className='contact-telephone'>
                <li>
                  <strong>무료 상담전화</strong>
                </li>
                <li>
                  <p>
                    대표: 변재현<br/> 
                    010-2909-7931<br/>
                    평일 오전 9시 ~  오후 5시, 주말 • 공휴일 제외
                  </p>
                </li>
              </ul>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
