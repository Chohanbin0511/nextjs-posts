'use client'

import { useState, useEffect, useRef } from 'react'

interface FileItem {
  name: string
  size: number
  file: File
}

interface InquiryData {
  id: number
  title: string
  category: string
  categoryClass: string
  date: string
  content: string
  author: string
  answers: Array<{
    label: string
    content: string
  }>
}

export default function ContactPage() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<'write' | 'history' | 'detail'>('write')
  
  // 폼 상태
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: ''
  })
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([])
  const [charCount, setCharCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 에디터 상태
  const [activeToolbar, setActiveToolbar] = useState<string[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  
  // 상세 페이지 상태
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null)
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  
  // 스크롤 투 톱 상태
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // 정렬 상태
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // 더미 문의 데이터
  const inquiryData: InquiryData[] = [
    {
      id: 1,
      title: "키워드 검색에서 라이브하고 어떻게 안 나타납니다",
      category: "문의분류",
      categoryClass: "",
      date: "2025-03-05 11:54",
      author: "심승찬",
      content: "키워드 검색 관련 문의입니다. 검색 결과가 정상적으로 나타나지 않는 문제가 있습니다.",
      answers: [
        { label: "답변1", content: "검색 인덱스를 확인하겠습니다." },
        { label: "답변2", content: "추가 조치사항을 안내드리겠습니다." }
      ]
    },
    {
      id: 2,
      title: "본원 텍스트 보고 찾고 있어요.",
      category: "지역문의",
      categoryClass: "location",
      date: "2025-03-03 14:54",
      author: "조유리",
      content: "본원 관련 텍스트 검색에 대한 문의입니다.",
      answers: [
        { label: "답변1", content: "지역별 검색 기능을 확인해보겠습니다." }
      ]
    },
    {
      id: 3,
      title: "서비스 및 이용자가 질면의 개선향상을 좀 좋군을 좀 놓았어 관련이 어느 귀잠 문의에 되는... 지시...",
      category: "시스템개선",
      categoryClass: "system",
      date: "2025-02-22 08:32",
      author: "김민석",
      content: "시스템 개선 관련 문의입니다. 전반적인 사용성 향상을 위한 제안사항입니다.",
      answers: [
        { label: "답변1", content: "제안해주신 내용을 검토하겠습니다." },
        { label: "답변2", content: "개발팀과 협의 후 답변드리겠습니다." }
      ]
    },
    {
      id: 4,
      title: "기능 문의 내용입니다.",
      category: "기능",
      categoryClass: "feature",
      date: "2025-02-05 11:13",
      author: "신영수",
      content: "새로운 기능에 대한 문의입니다.",
      answers: [
        { label: "답변1", content: "해당 기능에 대해 안내드리겠습니다." }
      ]
    },
    {
      id: 5,
      title: "이런 부분에서 개선되었으면 좋겠어요.",
      category: "기능요청",
      categoryClass: "feature",
      date: "2025-02-03 07:25",
      author: "박지민",
      content: "안녕하세요\n고객 voc 상담 내역을 검색할때 고객 이름이 이름께 저장할 게 신속정으로 출처하니다.",
      answers: [
        { label: "답변1", content: "오류를 확인했습니다." },
        { label: "답변2", content: "기타 문의 사항이 있다면." }
      ]
    }
  ]

  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 에디터 내용 변경 처리
  const handleEditorChange = () => {
    if (editorRef.current) {
      const text = editorRef.current.textContent || ''
      setCharCount(text.length)
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }))
    }
  }

  // 툴바 버튼 클릭 처리
  const handleToolbarClick = (command: string) => {
    document.execCommand(command, false, undefined)
    editorRef.current?.focus()
    
    if (['bold', 'italic', 'underline', 'strikeThrough'].includes(command)) {
      setActiveToolbar(prev => 
        prev.includes(command) 
          ? prev.filter(c => c !== command)
          : [...prev, command]
      )
    }
  }

  // 파일 선택 처리
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    const maxSize = 7 * 1024 * 1024 // 7MB

    files.forEach(file => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.\nJPG, PNG, PDF 파일만 업로드 가능합니다.`)
        return
      }

      if (file.size > maxSize) {
        alert(`${file.name}의 크기가 7MB를 초과합니다.`)
        return
      }

      if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        alert(`${file.name}은(는) 이미 선택된 파일입니다.`)
        return
      }

      setSelectedFiles(prev => [...prev, { name: file.name, size: file.size, file }])
    })

    e.target.value = ''
  }

  // 파일 삭제
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category) {
      alert('문의 분류를 선택해 주세요.')
      return
    }

    if (!formData.title.trim()) {
      alert('제목을 입력해 주세요.')
      return
    }

    if (!formData.content.trim()) {
      alert('내용을 입력해 주세요.')
      return
    }

    if (charCount > 1000) {
      alert('내용은 1000자를 초과할 수 없습니다.')
      return
    }

    const confirmSubmit = confirm('문의를 등록하시겠습니까?')
    if (!confirmSubmit) return

    setIsSubmitting(true)

    // 실제 제출 로직 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('문의가 성공적으로 등록되었습니다.\n마이페이지에서 답변을 확인하실 수 있습니다.')
    
    // 폼 초기화
    setFormData({ category: '', title: '', content: '' })
    setSelectedFiles([])
    setCharCount(0)
    setActiveToolbar([])
    if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }
    setIsSubmitting(false)
  }

  // 문의 상세 보기
  const showInquiryDetail = (inquiry: InquiryData) => {
    setSelectedInquiry(inquiry)
    setActiveTab('detail')
  }

  // 목록으로 돌아가기
  const backToHistory = () => {
    setSelectedInquiry(null)
    setActiveTab('history')
  }

  // 위로가기
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 정렬 토글
  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  return (
    <>
      {/* 헤더 */}
      {/* <header className="header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="logo">Chohbin</h1>
            <nav className="main-nav">
              <span className="nav-item">문의하기</span>
              <span className="nav-item">협업하기</span>
              <span className="nav-item">G VOC</span>
              <span className="nav-item">채팅문의</span>
              <span className="nav-item">시스템점검</span>
              <span className="nav-item">통합 NPS <span className="new-badge">N</span></span>
              <span className="nav-item">VOC LAB <span className="new-badge">N</span></span>
            </nav>
          </div>
          <div className="header-right">
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-count">2</span>
            </div>
            <div className="notifications">
              <span className="notification-icon">💬</span>
              <span className="notification-count">1</span>
            </div>
            <div className="user-info">
              <span className="user-name">관리자</span>
              <span className="toggle-switch">🌙</span>
            </div>
          </div>
        </div>
      </header> */}

      {/* 메인 컨테이너 */}
      <main className="main-container">
        {/* 브레드크럼 */}
        <div className="breadcrumb">
          <span>문의하기</span>
          {activeTab === 'detail' && (
            <>
              <span> &gt; </span>
              <span>문의상세</span>
            </>
          )}
        </div>

        {/* 페이지 헤더 */}
        <div className="page-header">
          <h1 className="page-title">
            {activeTab === 'detail' ? '문의 상세' : '문의하기'}
          </h1>
          {activeTab !== 'detail' && (
            <p className="page-description">
              고객을 위해서 최선을 다하고 언제나 진심으로 경청하겠습니다.<br />
              문의하신 내역 및 답변은 마이페이지에서 확인하실 수 있습니다.
            </p>
          )}
        </div>

        {/* 탭 메뉴 */}
        {activeTab !== 'detail' && (
          <div className="tab-container">
            <div className="tab-menu">
              <button 
                className={`tab-button ${activeTab === 'write' ? 'active' : ''}`}
                onClick={() => setActiveTab('write')}
              >
                문의 작성
              </button>
              <button 
                className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                내 문의 내역
              </button>
            </div>
          </div>
        )}

        {/* 문의 작성 탭 */}
        {activeTab === 'write' && (
          <div className="content-container">
            <form className="inquiry-form" onSubmit={handleSubmit}>
              {/* 문의 유형 */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-number">*</span>
                  <span className="section-title">문의 유형</span>
                  <span className="section-subtitle">최종 / CX제휴채널</span>
                </div>
              </div>

              {/* 문의 분류 */}
              <div className="form-group">
                <label htmlFor="inquiryCategory" className="form-label">
                  <span className="required">*</span>
                  문의 분류
                </label>
                <div className="select-wrapper">
                  <select 
                    id="inquiryCategory" 
                    className="form-select" 
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">문의 분류를 선택해 주세요</option>
                    <option value="기술문의">기술문의</option>
                    <option value="서비스문의">서비스문의</option>
                    <option value="계정문의">계정문의</option>
                    <option value="기타문의">기타문의</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              {/* 제목 */}
              <div className="form-group">
                <label htmlFor="inquiryTitle" className="form-label">
                  <span className="required">*</span>
                  제목
                </label>
                <input 
                  type="text" 
                  id="inquiryTitle" 
                  className="form-input" 
                  placeholder="제목을 입력해 주세요"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              {/* 내용 */}
              <div className="form-group">
                <label htmlFor="inquiryContent" className="form-label">
                  <span className="required">*</span>
                  내용
                </label>
                <div className="editor-toolbar">
                  <select className="font-family">
                    <option>Normal</option>
                  </select>
                  <button type="button" className={`toolbar-btn bold ${activeToolbar.includes('bold') ? 'active' : ''}`} onClick={() => handleToolbarClick('bold')} title="굵게">
                    <strong>B</strong>
                  </button>
                  <button type="button" className={`toolbar-btn italic ${activeToolbar.includes('italic') ? 'active' : ''}`} onClick={() => handleToolbarClick('italic')} title="기울임">
                    <em>I</em>
                  </button>
                  <button type="button" className={`toolbar-btn underline ${activeToolbar.includes('underline') ? 'active' : ''}`} onClick={() => handleToolbarClick('underline')} title="밑줄">
                    <u>U</u>
                  </button>
                  <button type="button" className="toolbar-btn strikethrough" onClick={() => handleToolbarClick('strikeThrough')} title="취소선">
                    <s>S</s>
                  </button>
                  <button type="button" className="toolbar-btn align-left" onClick={() => handleToolbarClick('justifyLeft')} title="왼쪽 정렬">≡</button>
                  <button type="button" className="toolbar-btn align-center" onClick={() => handleToolbarClick('justifyCenter')} title="가운데 정렬">≣</button>
                  <button type="button" className="toolbar-btn bullet-list" onClick={() => handleToolbarClick('insertUnorderedList')} title="목록">• • •</button>
                  <button type="button" className="toolbar-btn number-list" onClick={() => handleToolbarClick('insertOrderedList')} title="번호 목록">1. 2. 3.</button>
                  <button type="button" className="toolbar-btn indent" onClick={() => handleToolbarClick('indent')} title="들여쓰기">⇥</button>
                  <button type="button" className="toolbar-btn outdent" onClick={() => handleToolbarClick('outdent')} title="내어쓰기">⇤</button>
                  <button type="button" className="toolbar-btn link" onClick={() => {
                    const url = prompt('링크 URL을 입력하세요:')
                    if (url) handleToolbarClick('createLink')
                  }} title="링크">🔗</button>
                  <button type="button" className="toolbar-btn image" title="이미지">🖼</button>
                </div>
                <div 
                  ref={editorRef}
                  className="form-editor" 
                  contentEditable="true" 
                  data-placeholder="내용을 입력해 주세요"
                  onInput={handleEditorChange}
                />
                <div className="character-count">
                  <span style={{ color: charCount > 1000 ? '#ff6b6b' : '#666' }}>
                    {charCount}
                  </span>/1000
                </div>
              </div>

              {/* 파일 첨부 */}
              <div className="form-group">
                <div className="file-upload-section">
                  <div className="file-upload-left">
                    <span className="upload-icon">📎</span>
                    <span className="upload-text">파일 첨부</span>
                  </div>
                  <div className="file-upload-right">
                    <input 
                      type="file" 
                      id="fileInput" 
                      className="file-input" 
                      multiple
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="fileInput" className="file-upload-btn">파일 선택</label>
                    <span className="file-info">JPG, PNG, PDF 파일만 첨부 가능 7MB</span>
                  </div>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="file-list">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">
                          {file.name} ({formatFileSize(file.size)})
                        </span>
                        <button 
                          type="button" 
                          className="file-remove" 
                          onClick={() => removeFile(index)}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 제출 버튼 */}
              <div className="form-submit">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 내 문의 내역 탭 */}
        {activeTab === 'history' && (
          <div className="content-container">
            <div className="inquiry-history">
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th className="col-no">No</th>
                      <th className="col-category">문의분류</th>
                      <th className="col-title">제목</th>
                      <th className="col-author">작성자</th>
                      <th className="col-date" onClick={toggleSort}>
                        등록일 <span className="sort-icon">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiryData.map((inquiry, index) => (
                      <tr key={inquiry.id}>
                        <td className="col-no">{index + 1}</td>
                        <td className="col-category">
                          <span className={`category-badge ${inquiry.categoryClass}`}>
                            {inquiry.category}
                          </span>
                        </td>
                        <td className="col-title">
                          <span 
                            className="title-link" 
                            onClick={() => showInquiryDetail(inquiry)}
                          >
                            {inquiry.title}
                            {inquiry.answers.length > 0 && <span className="comment-icon"> 💬</span>}
                          </span>
                        </td>
                        <td className="col-author">{inquiry.author}</td>
                        <td className="col-date">{inquiry.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="pagination">
                <button 
                  className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                <button 
                  className={`page-btn ${currentPage === 2 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 문의 상세 탭 */}
        {activeTab === 'detail' && selectedInquiry && (
          <div className="content-container">
            <div className="inquiry-detail">
              {/* 뒤로가기 버튼 */}
              <div className="detail-header">
                <button className="back-btn" onClick={backToHistory}>
                  ← 목록으로
                </button>
              </div>

              {/* 문의 정보 */}
              <div className="detail-info">
                <h2 className="detail-title">{selectedInquiry.title}</h2>
                
                <div className="detail-meta">
                  <div className="meta-item">
                    <span className="meta-label">문의분류</span>
                    <span className={`category-badge ${selectedInquiry.categoryClass}`}>
                      {selectedInquiry.category}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">게시일</span>
                    <span className="meta-value">{selectedInquiry.date}</span>
                  </div>
                </div>
              </div>

              {/* 문의 내용 */}
              <div className="detail-content">
                <div className="content-section">
                  <h3 className="section-title">문의 내용</h3>
                  <div className="content-text">
                    {selectedInquiry.content.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>

                {/* 답변 섹션 */}
                {selectedInquiry.answers.length > 0 && (
                  <div className="content-section">
                    <h3 className="section-title">답변</h3>
                    <div className="answer-list">
                      {selectedInquiry.answers.map((answer, index) => (
                        <div key={index} className="answer-item">
                          <div className="answer-header">
                            <span className="answer-label">{answer.label}</span>
                          </div>
                          <div className="answer-content">
                            {answer.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="footer">
        <div className="footer-content">
          <span className="copyright">Copyright © LG Uplus Corp. All rights reserved.</span>
          <div className="footer-links">
            <span className="footer-link">Family Site</span>
            <span className="footer-icon">+</span>
          </div>
        </div>
      </footer>

      {/* 위로가기 버튼 */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </>
  )
} 