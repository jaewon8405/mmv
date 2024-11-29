import React, { useState, useEffect } from 'react';

const Home = () => {
  const [status, setStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const videos = [
    { src: './videos/test.mp4', title: '원본' },
    { src: './videos/output.mp4', title: '변환' },
  ];

  const updateStatus = (message) => setStatus(message);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    updateStatus(`${file.name} 선택됨.`);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      updateStatus('업로드할 파일을 선택해주세요.');
      return;
    }

    const apiUrl = 'https://fipoc9b835.execute-api.ap-northeast-2.amazonaws.com/Prod/';

    const reader = new FileReader();
    reader.onloadend = async function () {
      const base64File = reader.result.split(',')[1];
      const requestBody = {
        file_name: selectedFile.name,
        file_content: base64File,
      };

      try {
        updateStatus('업로드 중...');
        setUploadProgress(50);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          updateStatus('업로드 완료!');
          setUploadProgress(100);
          fetchFileList();
          removeSelectedFile(); // 업로드 후 초기화
        } else {
          const errorText = await response.text();
          updateStatus(`오류 발생: ${errorText}`);
        }
      } catch (error) {
        updateStatus(`오류 발생: ${error.message}`);
      } finally {
        setTimeout(() => {
          setUploadProgress(0);
        }, 3000);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const fetchFileList = async () => {
    const apiUrl = 'https://fipoc9b835.execute-api.ap-northeast-2.amazonaws.com/Prod/files';

    try {
      const response = await fetch(apiUrl);
      const files = await response.json();
      setFileList(files);
    } catch (error) {
      console.error('파일 목록 가져오기 오류:', error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };


  useEffect(() => {
    fetchFileList();
  }, []);

  return (
    <div className="home-container">
      {/* 메인 배너 섹션 */}
      <section className="main-banner">
        <h2>동영상 변환하기</h2>
        <div
          className={`upload-section ${isDragging ? 'dragging' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <p>
            {selectedFile ? (
              <>
                {selectedFile.name}{' '}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile();
                  }}
                  className="remove-button"
                >
                  삭제
                </button>
              </>
            ) : (
              '여기를 클릭하거나 파일을 드래그하세요.'
            )}
          </p>
        </div>
        <div className="upload-button-container">
          <button onClick={uploadFile} disabled={!selectedFile} className="upload-button">
            업로드
          </button>
        </div>
        <p>{status}</p>
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </section>

      <div className="content-layout">
        {/* 주요 기능 소개 섹션 */}
        <section className="features">
          <div className="feature">
            <h3>변화된 파일 목록</h3>
            <ul>
              {fileList.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.url}
                    className="file-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="additional-sections">
          {/* 동영상 섹션 */}
          <div className="video-container">
            <div className="video-item">
              <h3>{videos[0].title}</h3>
              <video
                src={videos[0].src}
                controls
                autoPlay
                muted
                loop
                className="video-player"
              />
            </div>
            <div className="video-item">
              <h3>{videos[1].title}</h3>
              <video
                src={videos[1].src}
                controls
                autoPlay
                muted
                loop
                className="video-player"
              />
            </div>
          </div>

          {/* 가이드라인 섹션 */}
          <div className="guideline-box">
            <h3>가이드라인</h3>
            <ul>
              <li>동영상 파일은 MP4 형식만 지원됩니다.</li>
              <li>파일 크기는 최대 50MB까지 업로드 가능합니다.</li>
              <li>업로드가 완료되면 파일 목록에서 확인하세요.</li>
              <li>기타 문의 사항은 문의 페이지를 이용하세요.</li>
            </ul>
          </div>
      </section>
      </div>
    </div>
  );
};

export default Home;
