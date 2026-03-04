/* ============================================
   Fletches Learning Platform - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Theme system
    initTheme();
    
    // Image modal (zoom)
    initImageModal();
    
    // Quiz functionality
    initQuizzes();
    
    // Progress tracking
    initProgress();
});

/* ============================================
   THEME TOGGLE (Dark / Light / AMP)
   ============================================ */

function initTheme() {
    const saved = localStorage.getItem('fletches-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateToggleButtons(saved);
    
    document.querySelectorAll('.theme-toggle button').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('fletches-theme', theme);
            updateToggleButtons(theme);
        });
    });
}

function updateToggleButtons(active) {
    document.querySelectorAll('.theme-toggle button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === active);
    });
}

/* ============================================
   IMAGE MODAL (ZOOM)
   ============================================ */

function initImageModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <button class="modal-close" aria-label="Sluiten">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <img src="" alt="">
    `;
    document.body.appendChild(modal);
    
    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.modal-close');
    
    // Add click handlers to zoomable images
    document.querySelectorAll('.image-container').forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            if (img) {
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn || closeBtn.contains(e.target)) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ============================================
   QUIZ FUNCTIONALITY
   ============================================ */

function initQuizzes() {
    document.querySelectorAll('.quiz-question').forEach(question => {
        const options = question.querySelectorAll('.quiz-option');
        const checkBtn = question.querySelector('.check-answer-btn');
        const feedback = question.querySelector('.quiz-feedback');
        const correctAnswer = question.dataset.correct;
        
        let selectedOption = null;
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selection
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedOption = option.dataset.answer;
            });
        });
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                if (!selectedOption) {
                    alert('Selecteer eerst een antwoord!');
                    return;
                }
                
                // Show result
                options.forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.dataset.answer === correctAnswer) {
                        opt.classList.add('correct');
                    } else if (opt.dataset.answer === selectedOption) {
                        opt.classList.add('incorrect');
                    }
                });
                
                // Show feedback
                if (feedback) {
                    feedback.classList.add('show');
                    if (selectedOption === correctAnswer) {
                        feedback.classList.add('correct');
                        feedback.classList.remove('incorrect');
                    } else {
                        feedback.classList.add('incorrect');
                        feedback.classList.remove('correct');
                    }
                }
                
                // Disable further clicks
                checkBtn.disabled = true;
                checkBtn.textContent = 'Beantwoord';
                options.forEach(opt => opt.style.pointerEvents = 'none');
            });
        }
    });
}

/* ============================================
   PROGRESS TRACKING
   ============================================ */

function initProgress() {
    const progressKey = 'fletches-week1-progress';
    const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    // Mark current page as visited
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    progress[currentPage] = true;
    localStorage.setItem(progressKey, JSON.stringify(progress));
    
    // Update progress bar
    const totalPages = 8; // index + 5 lessons + summary + exercises + praktijk
    const visitedPages = Object.keys(progress).length;
    const percentage = Math.round((visitedPages / totalPages) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `Voortgang Week 1: ${percentage}%`;
    }
}

/* ============================================
   COPY CODE BUTTON
   ============================================ */

function initCodeCopy() {
    document.querySelectorAll('.code-block').forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyBtn.title = 'Kopieer code';
        
        const header = block.querySelector('.code-header');
        if (header) {
            header.appendChild(copyBtn);
        }
        
        copyBtn.addEventListener('click', async () => {
            const code = block.querySelector('code');
            if (code) {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    copyBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        `;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            }
        });
    });
}

// Initialize code copy on load
document.addEventListener('DOMContentLoaded', initCodeCopy);
