// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 주요 요소들 선택
    const tabButtons = document.querySelectorAll('.tab-button');
    const inquiryForm = document.getElementById('inquiryForm');
    const inquiryContent = document.getElementById('inquiryContent');
    const charCount = document.getElementById('charCount');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    
    // 파일 목록 저장 배열
    let selectedFiles = [];

    // 탭 버튼 기능
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 탭 버튼에서 active 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
            const tabType = this.getAttribute('data-tab');
            const writeTab = document.getElementById('writeTab');
            const historyTab = document.getElementById('historyTab');
            
            if (tabType === 'history') {
                // 내 문의 내역 탭 표시
                if (writeTab) writeTab.classList.add('hidden');
                if (historyTab) historyTab.classList.remove('hidden');
            } else {
                // 문의 작성 탭 표시
                if (writeTab) writeTab.classList.remove('hidden');
                if (historyTab) historyTab.classList.add('hidden');
            }
        });
    });

    // 텍스트 에디터 문자 수 카운트
    if (inquiryContent && charCount) {
        inquiryContent.addEventListener('input', function() {
            const text = this.textContent || '';
            const count = text.length;
            charCount.textContent = count;
            
            // 1000자 초과 시 경고
            if (count > 1000) {
                charCount.style.color = '#ff6b6b';
            } else {
                charCount.style.color = '#666';
            }
        });
    }

    // 텍스트 에디터 툴바 기능
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const command = this.classList.contains('bold') ? 'bold' :
                           this.classList.contains('italic') ? 'italic' :
                           this.classList.contains('underline') ? 'underline' :
                           this.classList.contains('strikethrough') ? 'strikeThrough' :
                           this.classList.contains('align-left') ? 'justifyLeft' :
                           this.classList.contains('align-center') ? 'justifyCenter' :
                           this.classList.contains('bullet-list') ? 'insertUnorderedList' :
                           this.classList.contains('number-list') ? 'insertOrderedList' :
                           this.classList.contains('indent') ? 'indent' :
                           this.classList.contains('outdent') ? 'outdent' : null;
            
            if (command) {
                document.execCommand(command, false, null);
                this.classList.toggle('active');
            } else if (this.classList.contains('link')) {
                const url = prompt('링크 URL을 입력하세요:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
            }
            
            // 포커스를 에디터로 다시 이동
            inquiryContent.focus();
        });
    });

    // 파일 선택 기능
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            const maxSize = 7 * 1024 * 1024; // 7MB
            
            files.forEach(file => {
                // 파일 타입 검증
                if (!validTypes.includes(file.type)) {
                    alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.\nJPG, PNG, PDF 파일만 업로드 가능합니다.`);
                    return;
                }
                
                // 파일 크기 검증
                if (file.size > maxSize) {
                    alert(`${file.name}의 크기가 7MB를 초과합니다.`);
                    return;
                }
                
                // 중복 파일 체크
                if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    alert(`${file.name}은(는) 이미 선택된 파일입니다.`);
                    return;
                }
                
                selectedFiles.push(file);
                updateFileList();
            });
            
            // 파일 입력 초기화
            e.target.value = '';
        });
    }

    // 파일 목록 업데이트
    function updateFileList() {
        if (!fileList) return;
        
        fileList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            fileItem.innerHTML = `
                <span class="file-name">${file.name} (${formatFileSize(file.size)})</span>
                <button type="button" class="file-remove" onclick="removeFile(${index})">삭제</button>
            `;
            
            fileList.appendChild(fileItem);
        });
    }

    // 파일 삭제 (전역 함수로 선언)
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
    };

    // 파일 크기 포맷팅
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 폼 제출 처리
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 유효성 검사
            const category = document.getElementById('inquiryCategory').value;
            const title = document.getElementById('inquiryTitle').value.trim();
            const content = inquiryContent.textContent.trim();
            
            if (!category) {
                alert('문의 분류를 선택해 주세요.');
                document.getElementById('inquiryCategory').focus();
                return;
            }
            
            if (!title) {
                alert('제목을 입력해 주세요.');
                document.getElementById('inquiryTitle').focus();
                return;
            }
            
            if (!content) {
                alert('내용을 입력해 주세요.');
                inquiryContent.focus();
                return;
            }
            
            if (content.length > 1000) {
                alert('내용은 1000자를 초과할 수 없습니다.');
                inquiryContent.focus();
                return;
            }
            
            // 제출 확인
            const confirmSubmit = confirm('문의를 등록하시겠습니까?');
            if (confirmSubmit) {
                // 실제 제출 로직 (여기서는 시뮬레이션)
                showSubmitAnimation();
                
                setTimeout(() => {
                    alert('문의가 성공적으로 등록되었습니다.\n마이페이지에서 답변을 확인하실 수 있습니다.');
                    resetForm();
                }, 1000);
            }
        });
    }

    // 제출 애니메이션
    function showSubmitAnimation() {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '등록 중...';
            submitBtn.style.backgroundColor = '#ccc';
        }
    }

    // 폼 초기화
    function resetForm() {
        if (inquiryForm) {
            inquiryForm.reset();
        }
        
        if (inquiryContent) {
            inquiryContent.innerHTML = '';
        }
        
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#666';
        }
        
        selectedFiles = [];
        updateFileList();
        
        // 제출 버튼 원상복구
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '등록';
            submitBtn.style.backgroundColor = '#8b5cf6';
        }
        
        // 툴바 버튼 초기화
        toolbarButtons.forEach(btn => btn.classList.remove('active'));
    }

    // 스크롤 이벤트 처리
    window.addEventListener('scroll', function() {
        if (scrollToTopBtn) {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    });

    // 위로가기 버튼 클릭
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter로 폼 제출
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (inquiryForm) {
                inquiryForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // ESC로 폼 초기화 확인
        if (e.key === 'Escape') {
            const hasContent = document.getElementById('inquiryTitle').value.trim() || 
                              inquiryContent.textContent.trim() ||
                              selectedFiles.length > 0;
            
            if (hasContent) {
                const confirmReset = confirm('작성 중인 내용이 있습니다. 초기화하시겠습니까?');
                if (confirmReset) {
                    resetForm();
                }
            }
        }
    });

    // 자동 저장 기능 (로컬 스토리지 사용)
    function autoSave() {
        const formData = {
            category: document.getElementById('inquiryCategory').value,
            title: document.getElementById('inquiryTitle').value,
            content: inquiryContent.innerHTML,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('inquiry_draft', JSON.stringify(formData));
    }

    // 자동 저장 복원
    function restoreDraft() {
        const draft = localStorage.getItem('inquiry_draft');
        if (draft) {
            try {
                const formData = JSON.parse(draft);
                const confirmRestore = confirm('이전에 작성하던 내용이 있습니다. 복원하시겠습니까?');
                
                if (confirmRestore) {
                    document.getElementById('inquiryCategory').value = formData.category || '';
                    document.getElementById('inquiryTitle').value = formData.title || '';
                    if (inquiryContent && formData.content) {
                        inquiryContent.innerHTML = formData.content;
                        // 문자 수 업데이트
                        const text = inquiryContent.textContent || '';
                        if (charCount) {
                            charCount.textContent = text.length;
                        }
                    }
                } else {
                    localStorage.removeItem('inquiry_draft');
                }
            } catch (e) {
                console.error('Draft restoration failed:', e);
                localStorage.removeItem('inquiry_draft');
            }
        }
    }

    // 입력 필드 변경 시 자동 저장
    const autoSaveFields = ['inquiryCategory', 'inquiryTitle'];
    autoSaveFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', autoSave);
            field.addEventListener('change', autoSave);
        }
    });

    if (inquiryContent) {
        inquiryContent.addEventListener('input', autoSave);
    }

    // 페이지네이션 기능
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 페이지 버튼에서 active 클래스 제거
            pageButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
            const pageNumber = this.textContent;
            console.log(`페이지 ${pageNumber}로 이동`);
            
            // 실제 페이지 데이터 로드 로직을 여기에 구현
            // loadPageData(pageNumber);
        });
    });

    // 문의 상세 데이터
    const inquiryData = {
        1: {
            title: "키워드 검색에서 라이브하고 어떻게 안 나타납니다",
            category: "문의분류",
            categoryClass: "",
            date: "2025-03-05 11:54",
            content: "키워드 검색 관련 문의입니다. 검색 결과가 정상적으로 나타나지 않는 문제가 있습니다.",
            answers: [
                { label: "답변1", content: "검색 인덱스를 확인하겠습니다." },
                { label: "답변2", content: "추가 조치사항을 안내드리겠습니다." }
            ]
        },
        2: {
            title: "본원 텍스트 보고 찾고 있어요.",
            category: "지역문의",
            categoryClass: "location",
            date: "2025-03-03 14:54",
            content: "본원 관련 텍스트 검색에 대한 문의입니다.",
            answers: [
                { label: "답변1", content: "지역별 검색 기능을 확인해보겠습니다." }
            ]
        },
        3: {
            title: "서비스 및 이용자가 질면의 개선향상을 좀 좋군을 좀 놓았어 관련이 어느 귀잠 문의에 되는... 지시...",
            category: "시스템개선",
            categoryClass: "system",
            date: "2025-02-22 08:32",
            content: "시스템 개선 관련 문의입니다. 전반적인 사용성 향상을 위한 제안사항입니다.",
            answers: [
                { label: "답변1", content: "제안해주신 내용을 검토하겠습니다." },
                { label: "답변2", content: "개발팀과 협의 후 답변드리겠습니다." }
            ]
        },
        4: {
            title: "기능 문의 내용입니다.",
            category: "기능",
            categoryClass: "feature",
            date: "2025-02-05 11:13",
            content: "새로운 기능에 대한 문의입니다.",
            answers: [
                { label: "답변1", content: "해당 기능에 대해 안내드리겠습니다." }
            ]
        },
        5: {
            title: "이런 부분에서 개선되었으면 좋겠어요.",
            category: "기능요청",
            categoryClass: "feature",
            date: "2025-02-03 07:25",
            content: "안녕하세요\n고객 voc 상담 내역을 검색할때 고객 이름이 이름께 저장할 게 신속정으로 출처하니다.",
            answers: [
                { label: "답변1", content: "오류를 확인했습니다." },
                { label: "답변2", content: "기타 문의 사항이 있다면." }
            ]
        }
    };

    // 테이블 행 클릭 이벤트
    const titleLinks = document.querySelectorAll('.title-link');
    titleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const inquiryId = this.getAttribute('data-inquiry-id');
            showInquiryDetail(inquiryId);
        });
    });

    // 문의 상세 표시 함수
    function showInquiryDetail(inquiryId) {
        const data = inquiryData[inquiryId];
        if (!data) return;

        // 브레드크럼 업데이트
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = '<span>문의하기</span> > <span>문의상세</span>';
        }

        // 페이지 타이틀 업데이트
        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');
        if (pageTitle && pageDescription) {
            pageTitle.textContent = '문의 상세';
            pageDescription.style.display = 'none';
        }

        // 상세 정보 업데이트
        const detailTitle = document.getElementById('detailTitle');
        const detailCategory = document.getElementById('detailCategory');
        const detailDate = document.getElementById('detailDate');
        const detailContent = document.getElementById('detailContent');
        const detailAnswers = document.getElementById('detailAnswers');

        if (detailTitle) detailTitle.textContent = data.title;
        if (detailCategory) {
            detailCategory.textContent = data.category;
            detailCategory.className = `category-badge ${data.categoryClass}`;
        }
        if (detailDate) detailDate.textContent = data.date;
        if (detailContent) {
            detailContent.innerHTML = data.content.split('\n').map(line => `<p>${line}</p>`).join('');
        }
        if (detailAnswers) {
            detailAnswers.innerHTML = data.answers.map(answer => `
                <div class="answer-item">
                    <div class="answer-header">
                        <span class="answer-label">${answer.label}</span>
                    </div>
                    <div class="answer-content">
                        ${answer.content}
                    </div>
                </div>
            `).join('');
        }

        // 탭 전환
        const writeTab = document.getElementById('writeTab');
        const historyTab = document.getElementById('historyTab');
        const detailTab = document.getElementById('detailTab');

        if (writeTab) writeTab.classList.add('hidden');
        if (historyTab) historyTab.classList.add('hidden');
        if (detailTab) detailTab.classList.remove('hidden');

        // 탭 버튼 상태 업데이트 (상세 페이지에서는 탭 숨김)
        const tabContainer = document.querySelector('.tab-container');
        if (tabContainer) tabContainer.style.display = 'none';
    }

    // 뒤로가기 버튼 이벤트
    const backBtn = document.getElementById('backToHistory');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            // 브레드크럼 복원
            const breadcrumb = document.getElementById('breadcrumb');
            if (breadcrumb) {
                breadcrumb.innerHTML = '<span>문의하기</span>';
            }

            // 페이지 타이틀 복원
            const pageTitle = document.getElementById('pageTitle');
            const pageDescription = document.getElementById('pageDescription');
            if (pageTitle && pageDescription) {
                pageTitle.textContent = '문의하기';
                pageDescription.style.display = 'block';
            }

            // 탭 표시 복원
            const tabContainer = document.querySelector('.tab-container');
            if (tabContainer) tabContainer.style.display = 'block';

            // 내 문의 내역 탭으로 돌아가기
            const writeTab = document.getElementById('writeTab');
            const historyTab = document.getElementById('historyTab');
            const detailTab = document.getElementById('detailTab');

            if (writeTab) writeTab.classList.add('hidden');
            if (historyTab) historyTab.classList.remove('hidden');
            if (detailTab) detailTab.classList.add('hidden');

            // 탭 버튼 상태 업데이트
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const historyTabBtn = document.querySelector('.tab-button[data-tab="history"]');
            if (historyTabBtn) historyTabBtn.classList.add('active');
        });
    }

    // 정렬 기능
    const sortableHeaders = document.querySelectorAll('.col-date');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortIcon = this.querySelector('.sort-icon');
            if (sortIcon) {
                // 정렬 토글
                if (sortIcon.textContent === '▲') {
                    sortIcon.textContent = '▼';
                } else {
                    sortIcon.textContent = '▲';
                }
                
                // 실제 정렬 로직 구현
                console.log('날짜순 정렬:', sortIcon.textContent === '▲' ? '오름차순' : '내림차순');
            }
        });
    });

    // 페이지 로드 시 초기화
    restoreDraft();
    
    // 폼 제출 성공 시 임시 저장 데이터 삭제
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function() {
            localStorage.removeItem('inquiry_draft');
        });
    }

    console.log('CX Square 문의하기 페이지가 성공적으로 로드되었습니다.');
}); 