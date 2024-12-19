import React, { useState, useEffect, useCallback } from 'react';

const Transform = () => {
  const [fileList, setFileList] = useState([]);
  const [status, setStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadTriggered, setIsUploadTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false); // 초기 상태 false
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태

  // 파일 목록 가져오기 함수
  const fetchFileList = useCallback(async () => {
    const apiUrl = 'https://it8syip8u6.execute-api.ap-northeast-2.amazonaws.com/dev/files';
    try {
      const response = await fetch(apiUrl);
      const files = await response.json();
      if (Array.isArray(files)) {
        setFileList(files);
        return files; // 파일 목록 반환
      } else {
        console.error('Invalid file list format:', files);
        setFileList([]);
        return [];
      }
    } catch (error) {
      console.error('파일 목록 가져오기 오류:', error);
      setFileList([]);
      return [];
    }
  }, []);

  useEffect(() => {
    if (isUploadTriggered) {
      fetchFileList();
    }
  }, [isUploadTriggered, fetchFileList]);

  const videos = [
    { src: './videos/n.mp4', title: '원본' },
    { src: './videos/output.mp4', title: '변환' },
  ];

  const updateStatus = (message) => setStatus(message);

  const handleFileChange = (file) => {
    if (!file || typeof file.name === 'undefined') {
      // 파일이 없거나 파일 이름이 없는 경우
      updateStatus('파일이 선택되지 않았습니다.');
      return;
    }
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
  
    setIsUploading(true); // 업로드 시작
    setIsLoading(true); // 로딩 상태 시작
  
    const apiUrl = 'https://it8syip8u6.execute-api.ap-northeast-2.amazonaws.com/dev/';
    const reader = new FileReader();
  
    reader.onloadend = async function () {
      const base64File = reader.result.split(',')[1];
      const requestBody = {
        file_name: selectedFile.name,
        file_content: base64File,
      };
  

      try {
        setStatus('업로드 중...');
        setUploadProgress(50);
  
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          setStatus('업로드 완료!');
          setUploadProgress(100);
          setSelectedFile(null);
  
          // 10초 간격으로 파일 목록을 확인
          const intervalId = setInterval(async () => {
            const updatedFileList = await fetchFileList(); // 파일 목록을 서버에서 가져오는 함수 호출
            const isUploadedFileIncluded = updatedFileList.some(
              (file) => file.filename.includes(selectedFile.name)
            );
  
            if (isUploadedFileIncluded) {
              setStatus('업로드된 파일이 확인되었습니다.');
              setIsLoading(false); // 로딩 종료
              clearInterval(intervalId); // 주기적 호출 중단
              setIsListVisible(true);
            }
          }, 10000); // 10초 간격으로 실행
        } else {
          const errorText = await response.text();
          setStatus(`오류 발생: ${errorText}`);
        }
      } catch (error) {
        setStatus(`오류 발생: ${error.message}`);
      } finally {
        setUploadProgress(0);
        setIsUploading(false);
      }
    };
  
    reader.readAsDataURL(selectedFile);
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
    } else {
      updateStatus('파일 드래그가 실패했습니다.');
    }
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

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
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file) {
                handleFileChange(file);
              } else {
                updateStatus('파일이 선택되지 않았습니다.');
              }
            }}
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
            {isUploading || isLoading ? ( // 로딩 중일 때 스피너 표시
            <div className="spinner"></div>
          ) : isListVisible ? (
              <ul>
                {fileList.length > 0 ? (
                  fileList.map((file, index) => (
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
                  ))
                ) : (
                  <p>업로드가 완료되면 목록이 표시됩니다.</p>
                )}
              </ul>
            ) : (
                <p>업로드가 완료되면 목록이 표시됩니다.</p>
          )}
          </div>
        </section>

        <section className="additi onal-sections">
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

export default Transform;
