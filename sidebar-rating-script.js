// Sidebar Rating functionality for Rate Design Option 2
document.addEventListener('DOMContentLoaded', function() {
    // Feature flag for detailed feedback persistence - set to false to disable
    const ENABLE_FEEDBACK_PERSISTENCE = true;
    
    let currentRating = null;
    let currentPage = null;
    let currentVisiblePage = 1;
    
    // Quality pills for positive feedback (good qualities)
    const positiveQualities = [
        'Clear messaging',
        'Strong visuals',
        'Compelling data',
        'Easy to understand',
        'Actionable insights',
        'Professional design',
        'Relevant metrics',
        'Good storytelling',
        'Effective layout',
        'Valuable recommendations'
    ];
    
    // Quality pills for negative feedback (areas for improvement)
    const negativeQualities = [
        'Confusing layout',
        'Too much data',
        'Unclear messaging',
        'Poor visual hierarchy',
        'Missing context',
        'Hard to read',
        'Irrelevant metrics',
        'Weak recommendations',
        'Design issues',
        'Information overload'
    ];
    
    // ============================================
    // DETAILED FEEDBACK PERSISTENCE FUNCTIONS
    // ============================================
    
    function saveDetailedFeedback(page, type, selectedQualities, comment) {
        if (!ENABLE_FEEDBACK_PERSISTENCE) return;
        
        const key = 'detailedFeedback';
        let feedback = JSON.parse(localStorage.getItem(key) || '{}');
        
        feedback[page] = {
            type: type, // 'up' or 'down'
            selectedQualities: selectedQualities,
            comment: comment,
            timestamp: Date.now()
        };
        
        localStorage.setItem(key, JSON.stringify(feedback));
        console.log('Saved detailed feedback for page', page, feedback[page]);
    }
    
    function loadDetailedFeedback(page) {
        if (!ENABLE_FEEDBACK_PERSISTENCE) return null;
        
        const key = 'detailedFeedback';
        const feedback = JSON.parse(localStorage.getItem(key) || '{}');
        
        return feedback[page] || null;
    }
    
    function clearDetailedFeedback(page = null) {
        if (!ENABLE_FEEDBACK_PERSISTENCE) return;
        
        const key = 'detailedFeedback';
        if (page) {
            let feedback = JSON.parse(localStorage.getItem(key) || '{}');
            delete feedback[page];
            localStorage.setItem(key, JSON.stringify(feedback));
        } else {
            localStorage.removeItem(key);
        }
        console.log('Cleared detailed feedback for page', page || 'all');
    }
    
    // Initialize sidebar rating
    initializeSidebarRating();
    
    // Initialize page navigation
    initializePageNavigation();
    
    // Initialize scroll tracking
    initializeScrollTracking();
    
    function initializeSidebarRating() {
        const thumbButtons = document.querySelectorAll('.sidebar-thumb-btn');
        console.log('Found sidebar thumb buttons:', thumbButtons.length);
        
        thumbButtons.forEach((button, index) => {
            console.log(`Setting up sidebar button ${index}:`, button);
            
            // Try multiple event attachment methods
            button.onclick = function(e) {
                console.log('SIDEBAR THUMB CLICKED VIA ONCLICK!', this);
                handleThumbClick(this, e);
            };
            
            button.addEventListener('click', function(e) {
                console.log('SIDEBAR THUMB CLICKED VIA ADDEVENTLISTENER!', this);
                handleThumbClick(this, e);
            });
            
            // Also try mousedown as backup
            button.addEventListener('mousedown', function(e) {
                console.log('SIDEBAR THUMB MOUSEDOWN!', this);
                handleThumbClick(this, e);
            });
        });
    }
    
    function handleThumbClick(button, e) {
        e.preventDefault();
        e.stopPropagation();
        
        const page = button.dataset.page;
        const type = button.dataset.type;
        console.log('Sidebar Page:', page, 'Type:', type);
        
        // Record the basic thumb rating immediately
        recordThumbRating(page, type);
        
        // Update button states
        updateSidebarThumbStates(page, type);
        
        // Show inline feedback module instead of popup
        showInlineFeedback(page, type);
        
        // Update progress
        updateProgress();
    }
    
    function initializePageNavigation() {
        const pageRatingItems = document.querySelectorAll('.page-rating-item');
        
        pageRatingItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Don't scroll if clicking on thumb buttons
                if (e.target.closest('.sidebar-thumb-btn')) {
                    return;
                }
                
                const pageNumber = this.dataset.page;
                scrollToPage(parseInt(pageNumber) - 1);
            });
        });
    }
    
    function initializeScrollTracking() {
        const mainContent = document.querySelector('.main-content');
        
        mainContent.addEventListener('scroll', function() {
            updateCurrentPageIndicator();
        });
        
        // Initial update
        updateCurrentPageIndicator();
    }
    
    function scrollToPage(pageIndex) {
        const pages = document.querySelectorAll('.page');
        if (pageIndex < 0 || pageIndex >= pages.length) return;
        
        const targetPage = pages[pageIndex];
        const mainContent = document.querySelector('.main-content');
        const offsetTop = targetPage.offsetTop - 120; // Account for fixed header
        
        mainContent.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    function updateCurrentPageIndicator() {
        const pages = document.querySelectorAll('.page');
        const mainContent = document.querySelector('.main-content');
        const scrollTop = mainContent.scrollTop;
        const viewportHeight = mainContent.clientHeight;
        
        // Find which page is currently most visible
        let activePageIndex = 0;
        let maxVisibility = 0;
        
        pages.forEach((page, index) => {
            const pageTop = page.offsetTop - 120; // Account for header
            const pageBottom = pageTop + page.offsetHeight;
            const viewportTop = scrollTop;
            const viewportBottom = scrollTop + viewportHeight;
            
            // Calculate how much of the page is visible
            const visibleTop = Math.max(pageTop, viewportTop);
            const visibleBottom = Math.min(pageBottom, viewportBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibility = visibleHeight / page.offsetHeight;
            
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                activePageIndex = index;
            }
        });
        
        currentVisiblePage = activePageIndex + 1;
        
        // Update sidebar indicators
        const pageItems = document.querySelectorAll('.page-rating-item');
        pageItems.forEach((item, index) => {
            item.classList.toggle('current-page', index === activePageIndex);
        });
    }
    
    function recordThumbRating(page, type) {
        const ratingData = {
            page: page,
            rating: type,
            timestamp: new Date().toISOString(),
            hasDetailedFeedback: false
        };
        
        // Store basic rating immediately
        const ratings = JSON.parse(localStorage.getItem('sidebarThumbRatings') || '[]');
        
        // Remove any existing rating for this page
        const filteredRatings = ratings.filter(r => r.page !== page);
        filteredRatings.push(ratingData);
        
        localStorage.setItem('sidebarThumbRatings', JSON.stringify(filteredRatings));
        
        console.log('Sidebar thumb rating recorded:', ratingData);
    }
    
    function updateSidebarThumbStates(page, selectedType) {
        const pageButtons = document.querySelectorAll(`[data-page="${page}"].sidebar-thumb-btn`);
        
        pageButtons.forEach(button => {
            button.classList.remove('selected');
            if (button.dataset.type === selectedType) {
                button.classList.add('selected');
            }
        });
    }
    
    function updateProgress() {
        const ratings = JSON.parse(localStorage.getItem('sidebarThumbRatings') || '[]');
        const totalPages = 5;
        const ratedPages = ratings.length;
        const progressPercentage = (ratedPages / totalPages) * 100;
        
        // Update progress bar if it exists
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = progressPercentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `${ratedPages} of ${totalPages} pages rated`;
        }
    }
    
    function showInlineFeedback(page, type) {
        console.log('showInlineFeedback called with page:', page, 'type:', type);
        currentRating = type;
        currentPage = page;
        
        const ratingList = document.querySelector('.page-rating-list');
        const inlineFeedback = document.querySelector('.inline-feedback-module');
        const feedbackTitle = document.querySelector('.feedback-title');
        const mainTitle = document.querySelector('.rating-module-title');
        
        // Update feedback content based on rating type
        if (type === 'up') {
            feedbackTitle.textContent = "What did you like?";
            populateInlineQualityPills(positiveQualities, false);
        } else {
            feedbackTitle.textContent = "What could be improved?";
            populateInlineQualityPills(negativeQualities, true);
        }
        
        // Load previous selections if persistence is enabled
        const previousFeedback = loadDetailedFeedback(page);
        if (previousFeedback && previousFeedback.type === type) {
            // Pre-populate previous selections
            document.getElementById('inlineAdditionalComments').value = previousFeedback.comment || '';
            
            // Pre-select quality pills
            setTimeout(() => {
                const pills = document.querySelectorAll('.inline-quality-pill');
                pills.forEach(pill => {
                    if (previousFeedback.selectedQualities.includes(pill.textContent)) {
                        pill.classList.add('selected');
                        pill.classList.add(type === 'up' ? 'positive' : 'negative');
                    }
                });
            }, 200); // Small delay to ensure pills are rendered
            
            console.log('Pre-populated previous feedback for page', page, previousFeedback);
        } else {
            // Clear previous selections
            document.getElementById('inlineAdditionalComments').value = '';
        }
        
        // Hide main title and animate the transition
        mainTitle.style.display = 'none';
        ratingList.style.opacity = '0';
        ratingList.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            ratingList.style.display = 'none';
            inlineFeedback.style.display = 'block';
            
            // Trigger reflow
            inlineFeedback.offsetHeight;
            
            inlineFeedback.classList.add('show');
        }, 150);
        
        // Setup event listeners
        setupInlineFeedbackEventListeners();
    }
    
    function populateInlineQualityPills(qualities, isNegative) {
        const container = document.getElementById('inlineQualityPills');
        container.innerHTML = '';
        
        // Limit to only 6 pills
        const limitedQualities = qualities.slice(0, 6);
        
        limitedQualities.forEach(quality => {
            const pill = document.createElement('div');
            pill.className = `inline-quality-pill ${isNegative ? 'negative' : 'positive'}`;
            pill.textContent = quality;
            pill.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            container.appendChild(pill);
        });
    }
    
    function populateQualityPills(qualities, isNegative) {
        const container = document.getElementById('qualityPills');
        if (!container) return;
        
        container.innerHTML = '';
        
        qualities.forEach(quality => {
            const pill = document.createElement('div');
            pill.className = `quality-pill ${isNegative ? 'negative' : ''}`;
            pill.textContent = quality;
            pill.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            container.appendChild(pill);
        });
    }
    
    function setupInlineFeedbackEventListeners() {
        const backBtn = document.querySelector('.back-btn');
        const submitBtn = document.getElementById('inlineSubmitBtn');
        
        // Back button
        backBtn.onclick = function() {
            hideInlineFeedback();
        };
        
        // Submit button
        submitBtn.onclick = function() {
            submitInlineDetailedFeedback();
        };
        
        // ESC key to go back
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideInlineFeedback();
            }
        });
    }
    
    function setupPopupEventListeners() {
        const overlay = document.getElementById('feedbackOverlay');
        const skipBtn = document.getElementById('skipBtn');
        const submitBtn = document.getElementById('submitFeedbackBtn');
        
        if (!overlay) return; // Skip if popup elements don't exist
        
        // Close popup when clicking overlay
        overlay.onclick = function() {
            hidePopup();
        };
        
        // Skip button
        if (skipBtn) {
            skipBtn.onclick = function() {
                hidePopup();
            };
        }
        
        // Submit button
        if (submitBtn) {
            submitBtn.onclick = function() {
                submitDetailedFeedback();
            };
        }
        
        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hidePopup();
            }
        });
    }
    
    function hideInlineFeedback() {
        const ratingList = document.querySelector('.page-rating-list');
        const inlineFeedback = document.querySelector('.inline-feedback-module');
        const mainTitle = document.querySelector('.rating-module-title');
        
        // Hide feedback module
        inlineFeedback.classList.remove('show');
        
        setTimeout(() => {
            inlineFeedback.style.display = 'none';
            ratingList.style.display = 'block';
            mainTitle.style.display = 'block';
            
            // Trigger reflow
            ratingList.offsetHeight;
            
            // Show rating list
            ratingList.style.opacity = '1';
            ratingList.style.transform = 'translateX(0)';
            
            // Show basic thank you message if no detailed feedback was provided
            if (!hasDetailedFeedback(currentPage)) {
                showBasicThankYouMessage();
            }
        }, 150);
    }
    
    function hidePopup() {
        const popup = document.getElementById('feedbackPopup');
        const overlay = document.getElementById('feedbackOverlay');
        
        if (!popup || !overlay) return;
        
        popup.classList.remove('show');
        overlay.classList.remove('show');
        
        // Clean up event listeners
        overlay.onclick = null;
        document.removeEventListener('keydown', hidePopup);
    }
    
    function submitInlineDetailedFeedback() {
        const selectedQualities = Array.from(document.querySelectorAll('.inline-quality-pill.selected'))
            .map(pill => pill.textContent);
        const additionalComments = document.getElementById('inlineAdditionalComments').value;
        
        // Update the existing rating with detailed feedback
        const ratings = JSON.parse(localStorage.getItem('sidebarThumbRatings') || '[]');
        const ratingIndex = ratings.findIndex(r => r.page === currentPage);
        
        if (ratingIndex !== -1) {
            ratings[ratingIndex].hasDetailedFeedback = true;
            ratings[ratingIndex].selectedQualities = selectedQualities;
            ratings[ratingIndex].additionalComments = additionalComments;
            ratings[ratingIndex].detailedFeedbackTimestamp = new Date().toISOString();
            
            localStorage.setItem('sidebarThumbRatings', JSON.stringify(ratings));
            
            // Save detailed feedback for persistence (new feature)
            saveDetailedFeedback(currentPage, currentRating, selectedQualities, additionalComments);
            
            console.log('Inline detailed feedback submitted:', ratings[ratingIndex]);
        }
        
        // Show simple thank you message for 3 seconds, then return to main screen
        showSimpleThankYou();
        
        // Update progress
        updateProgress();
        
    }
    
    function showSimpleThankYou() {
        const thankYouMessage = document.querySelector('.simple-thank-you');
        const backBtn = document.querySelector('.back-btn');
        
        if (!thankYouMessage) {
            console.error('Thank you message not found!');
            return;
        }
        
        // Show the message with fade in
        thankYouMessage.style.display = 'block';
        setTimeout(() => {
            thankYouMessage.classList.add('show');
        }, 10);
        
        // Enhanced back button functionality during thank you
        const originalBackHandler = backBtn.onclick;
        backBtn.onclick = function() {
            hideThankYouAndReturn();
        };
        
        // Auto-dismiss after 2 seconds
        setTimeout(() => {
            hideThankYouAndReturn();
        }, 2000);
        
        function hideThankYouAndReturn() {
            // Fade out the message
            thankYouMessage.classList.remove('show');
            
            setTimeout(() => {
                thankYouMessage.style.display = 'none';
                // Restore original back button handler
                backBtn.onclick = originalBackHandler;
                // Return to main screen
                hideInlineFeedback();
            }, 300); // Match CSS transition duration
        }
    }
    
    function submitDetailedFeedback() {
        const selectedQualities = Array.from(document.querySelectorAll('.quality-pill.selected'))
            .map(pill => pill.textContent);
        const additionalComments = document.getElementById('additionalComments');
        const commentsValue = additionalComments ? additionalComments.value : '';
        
        // Update the existing rating with detailed feedback
        const ratings = JSON.parse(localStorage.getItem('sidebarThumbRatings') || '[]');
        const ratingIndex = ratings.findIndex(r => r.page === currentPage);
        
        if (ratingIndex !== -1) {
            ratings[ratingIndex].hasDetailedFeedback = true;
            ratings[ratingIndex].selectedQualities = selectedQualities;
            ratings[ratingIndex].additionalComments = commentsValue;
            ratings[ratingIndex].detailedFeedbackTimestamp = new Date().toISOString();
            
            localStorage.setItem('sidebarThumbRatings', JSON.stringify(ratings));
            
            console.log('Detailed feedback submitted:', ratings[ratingIndex]);
        }
        
        hidePopup();
        
        // Show brief success message
        showSuccessMessage();
    }
    
    function hasDetailedFeedback(page) {
        const ratings = JSON.parse(localStorage.getItem('sidebarThumbRatings') || '[]');
        const rating = ratings.find(r => r.page === page);
        return rating && rating.hasDetailedFeedback;
    }
    
    function showBasicThankYouMessage() {
        showThankYouMessage('Thank you for your feedback!');
    }
    
    function showDetailedThankYouMessage() {
        showThankYouMessage('Thank you for your detailed feedback!');
    }
    
    function showThankYouMessage(text) {
        // Remove any existing thank you message
        const existingMessage = document.querySelector('.thank-you-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create thank you message in sidebar
        const ratingModule = document.querySelector('.rating-module');
        const message = document.createElement('div');
        message.className = 'thank-you-message';
        message.textContent = text;
        
        ratingModule.appendChild(message);
        
        // Show with animation
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 2000);
    }
    
    function showSuccessMessage() {
        // Create temporary success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1001;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        message.textContent = 'Feedback submitted successfully!';
        
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (message.parentNode) {
                    document.body.removeChild(message);
                }
            }, 300);
        }, 3000);
    }
    
    // Load existing ratings on page load
    function loadExistingRatings() {
        const existingRatings = JSON.parse(localStorage.getItem('sidebarThumbRatings') || '[]');
        
        existingRatings.forEach(rating => {
            updateSidebarThumbStates(rating.page, rating.rating);
        });
        
        updateProgress();
    }
    
    // Clear all ratings and reset UI to default state
    function clearAllRatings() {
        // Clear localStorage
        localStorage.removeItem('sidebarThumbRatings');
        
        // Clear detailed feedback as well (new feature)
        clearDetailedFeedback();
        
        // Reset all thumb button states
        const allThumbButtons = document.querySelectorAll('.sidebar-thumb-btn');
        allThumbButtons.forEach(button => {
            button.classList.remove('selected');
        });
        
        // Reset progress
        updateProgress();
    }
    
    // Clear ratings on page refresh for a fresh start
    clearAllRatings();
    
    // Initialize existing ratings (commented out to prevent persistence)
    // loadExistingRatings();
    
    // Initialize scroll tracking for current page highlighting
    initializeScrollTracking();
    
    function initializeScrollTracking() {
        const mainContent = document.querySelector('.main-content');
        const pages = document.querySelectorAll('.page');
        const pageItems = document.querySelectorAll('.page-rating-item');
        
        if (!mainContent || !pages.length) return;
        
        function updateCurrentPage() {
            const scrollTop = mainContent.scrollTop;
            const viewportHeight = mainContent.clientHeight;
            const scrollMiddle = scrollTop + viewportHeight / 2;
            
            let currentPageIndex = 0;
            
            // Check which page is most visible
            pages.forEach((page, index) => {
                const pageTop = page.offsetTop;
                const pageBottom = pageTop + page.offsetHeight;
                
                if (scrollMiddle >= pageTop && scrollMiddle < pageBottom) {
                    currentPageIndex = index + 1;
                }
            });
            
            // Update visual indicators - only highlight pages 2, 3, 4 (the ones we have ratings for)
            pageItems.forEach((item) => {
                const pageNumber = parseInt(item.getAttribute('data-page'));
                if (pageNumber === currentPageIndex && [2, 3, 4].includes(pageNumber)) {
                    item.classList.add('current-page');
                } else {
                    item.classList.remove('current-page');
                }
            });
        }
        
        // Initial update
        setTimeout(updateCurrentPage, 100); // Small delay to ensure layout is ready
        
        // Update on scroll with throttling
        let scrollTimeout;
        mainContent.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateCurrentPage, 50);
        });
    }
    
    // Global click listener for debugging
    document.addEventListener('click', function(e) {
        console.log('GLOBAL CLICK DETECTED:', e.target);
        console.log('Target classes:', e.target.className);
        console.log('Target dataset:', e.target.dataset);
        
        // Check if it's a sidebar thumb button
        if (e.target.classList.contains('sidebar-thumb-btn')) {
            console.log('CLICKED ON SIDEBAR THUMB BUTTON!');
            handleThumbClick(e.target, e);
        }
    });
    
    // Debug functions
    window.viewSidebarRatings = function() {
        const ratings = JSON.parse(localStorage.getItem('sidebarThumbRatings') || '[]');
        console.table(ratings);
        return ratings;
    };
    
    window.clearSidebarRatings = function() {
        localStorage.removeItem('sidebarThumbRatings');
        location.reload();
    };
});
