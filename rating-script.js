// Rating functionality for Rate Design Option 1
document.addEventListener('DOMContentLoaded', function() {
    const ratings = {};
    
    // Initialize thumb button interactions
    initializeThumbButtons();
    
    // Initialize popup interactions
    initializePopup();
    
    function initializeThumbButtons() {
        const thumbButtons = document.querySelectorAll('.thumb-btn');
        
        thumbButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pageId = this.getAttribute('data-page');
                const type = this.getAttribute('data-type');
                
                // Store the rating
                ratings[pageId] = type;
                
                // Update button states
                updateButtonStates(pageId, type);
                
                // Show feedback popup
                showFeedbackPopup(pageId, type);
                
                // Add success animation
                this.classList.add('success');
                setTimeout(() => {
                    this.classList.remove('success');
                }, 600);
            });
        });
    }
    
    function updateButtonStates(pageId, selectedType) {
        const pageButtons = document.querySelectorAll(`[data-page="${pageId}"].thumb-btn`);
        
        pageButtons.forEach(button => {
            const buttonType = button.getAttribute('data-type');
            
            if (buttonType === selectedType) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    function showFeedbackPopup(pageId, type) {
        const overlay = document.getElementById('feedbackOverlay');
        const popup = document.getElementById('feedbackPopup');
        const icon = document.getElementById('popupIcon');
        const iconSvg = document.getElementById('popupIconSvg');
        const title = document.getElementById('popupTitle');
        const subtitle = document.getElementById('popupSubtitle');
        const qualityPills = document.getElementById('qualityPills');
        
        // Set popup content based on rating type
        if (type === 'up') {
            icon.className = 'popup-icon positive';
            iconSvg.innerHTML = '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>';
            title.textContent = "What's good about this page?";
            subtitle.textContent = "Select qualities that work well (optional)";
            
            // Positive quality pills
            qualityPills.innerHTML = [
                'Clear insights',
                'Easy to understand',
                'Visually appealing',
                'Actionable data',
                'Well organized',
                'Comprehensive',
                'Relevant content',
                'Professional design'
            ].map(quality => `<div class="quality-pill" data-quality="${quality}">${quality}</div>`).join('');
            
        } else {
            icon.className = 'popup-icon negative';
            iconSvg.innerHTML = '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>';
            title.textContent = "What could be improved?";
            subtitle.textContent = "Select areas for improvement (optional)";
            
            // Negative quality pills
            qualityPills.innerHTML = [
                'Hard to read',
                'Too cluttered',
                'Missing context',
                'Unclear data',
                'Poor layout',
                'Not actionable',
                'Irrelevant info',
                'Design issues'
            ].map(quality => `<div class="quality-pill" data-quality="${quality}">${quality}</div>`).join('');
        }
        
        // Store current rating context
        popup.dataset.page = pageId;
        popup.dataset.type = type;
        
        // Initialize pill interactions
        initializePillInteractions();
        
        // Show popup
        overlay.classList.add('show');
        
        // Clear previous form data
        document.getElementById('additionalComments').value = '';
        
        // Focus on textarea for better UX
        setTimeout(() => {
            document.getElementById('additionalComments').focus();
        }, 300);
    }
    
    function initializePillInteractions() {
        const pills = document.querySelectorAll('.quality-pill');
        
        pills.forEach(pill => {
            pill.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
        });
    }
    
    function initializePopup() {
        const overlay = document.getElementById('feedbackOverlay');
        const skipBtn = document.getElementById('skipBtn');
        const submitBtn = document.getElementById('submitFeedbackBtn');
        
        // Close popup when clicking overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hidePopup();
            }
        });
        
        // Skip button
        skipBtn.addEventListener('click', function() {
            hidePopup();
        });
        
        // Submit feedback button
        submitBtn.addEventListener('click', function() {
            submitFeedback();
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('show')) {
                hidePopup();
            }
        });
    }
    
    function hidePopup() {
        const overlay = document.getElementById('feedbackOverlay');
        overlay.classList.remove('show');
    }
    
    function submitFeedback() {
        const popup = document.getElementById('feedbackPopup');
        const pageId = popup.dataset.page;
        const type = popup.dataset.type;
        const selectedPills = Array.from(document.querySelectorAll('.quality-pill.selected'))
            .map(pill => pill.dataset.quality);
        const additionalComments = document.getElementById('additionalComments').value;
        
        // Collect feedback data
        const feedbackData = {
            page: pageId,
            rating: type,
            qualities: selectedPills,
            comments: additionalComments,
            timestamp: new Date().toISOString()
        };
        
        // Submit feedback (for now, just log and store)
        console.log('Feedback submitted:', feedbackData);
        
        // Store in localStorage
        const allFeedback = JSON.parse(localStorage.getItem('pageFeedback') || '[]');
        allFeedback.push(feedbackData);
        localStorage.setItem('pageFeedback', JSON.stringify(allFeedback));
        
        // Show success message
        showSuccessMessage(pageId, type);
        
        // Hide popup after short delay
        setTimeout(() => {
            hidePopup();
        }, 2000);
    }
    
    function showSuccessMessage(pageId, type) {
        const popup = document.getElementById('feedbackPopup');
        const ratingText = type === 'up' ? 'positive' : 'negative';
        
        popup.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div class="popup-icon ${type === 'up' ? 'positive' : 'negative'}" style="margin: 0 auto 20px auto;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                </div>
                <h3 class="popup-title" style="margin-bottom: 12px;">Thank you!</h3>
                <p style="color: #666; margin: 0; font-size: 16px;">Your ${ratingText} feedback has been submitted.</p>
                <small style="color: #999; margin-top: 8px; display: block;">Page ${pageId}</small>
            </div>
        `;
    }
    
    // Load existing ratings from localStorage
    function loadExistingRatings() {
        const existingFeedback = JSON.parse(localStorage.getItem('pageFeedback') || '[]');
        
        existingFeedback.forEach(feedback => {
            // Update button states for previously rated pages
            updateButtonStates(feedback.page, feedback.rating);
        });
    }
    
    // Load existing ratings on page load
    loadExistingRatings();
    
    // Add keyboard shortcuts for quick rating
    document.addEventListener('keydown', function(e) {
        // 'U' for thumbs up, 'D' for thumbs down on currently visible page
        if (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 'd') {
            const currentPage = getCurrentVisiblePage();
            if (currentPage) {
                const type = e.key.toLowerCase() === 'u' ? 'up' : 'down';
                const button = document.querySelector(`[data-page="${currentPage}"][data-type="${type}"]`);
                if (button) {
                    button.click();
                }
            }
        }
    });
    
    function getCurrentVisiblePage() {
        const pages = document.querySelectorAll('.page');
        const scrollTop = document.querySelector('.main-content').scrollTop;
        const viewportHeight = window.innerHeight;
        
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const pageTop = page.offsetTop - 120; // Account for header
            const pageBottom = pageTop + page.offsetHeight;
            
            if (scrollTop >= pageTop - viewportHeight/2 && scrollTop < pageBottom - viewportHeight/2) {
                return i + 1;
            }
        }
        return 1;
    }
    
    // Add smooth scrolling between pages
    function addPageNavigation() {
        const pages = document.querySelectorAll('.page');
        
        pages.forEach((page, index) => {
            page.addEventListener('click', function(e) {
                // Only navigate if clicking on the page content, not buttons
                if (!e.target.closest('.thumb-btn') && !e.target.closest('.page-header')) {
                    const nextPage = pages[index + 1];
                    if (nextPage) {
                        nextPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }
    
    addPageNavigation();
});