// Integrated Rating Script for Step-by-Step Flow
document.addEventListener('DOMContentLoaded', function() {
    const ratingData = {
        overall: null,
        overallQualities: [],
        overallComments: '',
        pages: {},
        pageComments: ''
    };
    
    // Quality pill options
    const qualityOptions = {
        positive: [
            'Clear insights', 'Easy to understand', 'Visually appealing', 'Actionable data',
            'Well organized', 'Comprehensive', 'Relevant content', 'Professional design'
        ],
        negative: [
            'Hard to read', 'Too cluttered', 'Missing context', 'Unclear data',
            'Poor layout', 'Not actionable', 'Irrelevant info', 'Design issues'
        ]
    };
    
    const pageQualityOptions = {
        positive: [
            'Clear', 'Helpful', 'Well designed', 'Informative', 'Easy to read'
        ],
        negative: [
            'Confusing', 'Unclear', 'Too busy', 'Missing info', 'Hard to read'
        ]
    };
    
    // Initialize the rating system
    initializeRatingSystem();
    
    function initializeRatingSystem() {
        // Entry point button
        document.getElementById('rateReportBtn').addEventListener('click', showStep1);
        
        // Step 1 interactions
        initializeStep1();
        
        // Step 2 interactions
        initializeStep2();
    }
    
    function showStep1() {
        hideElement('ratingEntryPoint');
        showElement('step1');
    }
    
    function initializeStep1() {
        const step1 = document.getElementById('step1');
        const thumbButtons = step1.querySelectorAll('.overall-thumb-btn');
        const submitBtn = document.getElementById('submitStep1Btn');
        const cancelBtn = document.getElementById('cancelStep1Btn');
        
        // Overall thumb buttons
        thumbButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                ratingData.overall = type;
                
                // Update button states
                thumbButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                
                // Show quality pills
                showOverallQualityPills(type);
                
                // Enable submit button
                submitBtn.disabled = false;
            });
        });
        
        // Submit step 1
        submitBtn.addEventListener('click', function() {
            // Collect overall comments
            ratingData.overallComments = document.getElementById('overallComments').value;
            
            // Collect selected quality pills
            const selectedPills = step1.querySelectorAll('.overall-quality-pill.selected');
            ratingData.overallQualities = Array.from(selectedPills).map(pill => pill.textContent);
            
            // Show step 2
            showStep2();
        });
        
        // Cancel step 1
        cancelBtn.addEventListener('click', function() {
            resetToEntry();
        });
    }
    
    function showOverallQualityPills(type) {
        const pillsContainer = document.getElementById('overallQualityPills');
        const options = qualityOptions[type === 'up' ? 'positive' : 'negative'];
        
        pillsContainer.innerHTML = options.map(option => 
            `<div class="overall-quality-pill ${type === 'down' ? 'negative' : ''}" data-quality="${option}">${option}</div>`
        ).join('');
        
        // Add click handlers to pills
        pillsContainer.querySelectorAll('.overall-quality-pill').forEach(pill => {
            pill.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
        });
    }
    
    function showStep2() {
        hideElement('step1');
        showElement('step2');
        
        // Initialize page quality pills (empty initially)
        initializePageQualityPills();
    }
    
    function initializeStep2() {
        const step2 = document.getElementById('step2');
        const pageThumbButtons = step2.querySelectorAll('.page-thumb-btn');
        const submitBtn = document.getElementById('submitStep2Btn');
        const skipBtn = document.getElementById('skipStep2Btn');
        
        // Page thumb buttons
        pageThumbButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pageId = this.getAttribute('data-page');
                const type = this.getAttribute('data-type');
                
                // Store page rating
                if (!ratingData.pages[pageId]) {
                    ratingData.pages[pageId] = {};
                }
                ratingData.pages[pageId].rating = type;
                
                // Update button states for this page
                const pageButtons = step2.querySelectorAll(`[data-page="${pageId}"].page-thumb-btn`);
                pageButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                
                // Show quality pills for this page
                showPageQualityPills(pageId, type);
            });
        });
        
        // Submit step 2
        submitBtn.addEventListener('click', function() {
            // Collect page comments
            ratingData.pageComments = document.getElementById('pageComments').value;
            
            // Collect all page quality pills
            collectPageQualities();
            
            // Submit all feedback
            submitAllFeedback();
        });
        
        // Skip step 2
        skipBtn.addEventListener('click', function() {
            // Submit only overall feedback
            submitAllFeedback();
        });
    }
    
    function initializePageQualityPills() {
        // Initialize empty pill containers for all pages
        for (let i = 1; i <= 5; i++) {
            const pillsContainer = document.querySelector(`[data-page="${i}"] .page-quality-pills`);
            pillsContainer.innerHTML = '<div class="pills-placeholder">Rate this section to see quality options</div>';
        }
    }
    
    function showPageQualityPills(pageId, type) {
        const pillsContainer = document.querySelector(`[data-page="${pageId}"] .page-quality-pills`);
        const options = pageQualityOptions[type === 'up' ? 'positive' : 'negative'];
        
        pillsContainer.innerHTML = options.map(option => 
            `<div class="page-quality-pill ${type === 'down' ? 'negative' : ''}" data-quality="${option}" data-page="${pageId}">${option}</div>`
        ).join('');
        
        // Add click handlers to pills
        pillsContainer.querySelectorAll('.page-quality-pill').forEach(pill => {
            pill.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
        });
    }
    
    function collectPageQualities() {
        // Collect selected quality pills for each page
        for (let pageId in ratingData.pages) {
            const selectedPills = document.querySelectorAll(`[data-page="${pageId}"].page-quality-pill.selected`);
            ratingData.pages[pageId].qualities = Array.from(selectedPills).map(pill => pill.textContent);
        }
    }
    
    function submitAllFeedback() {
        // Add timestamp
        ratingData.timestamp = new Date().toISOString();
        
        // Log the complete feedback data
        console.log('Complete Feedback Submitted:', ratingData);
        
        // Store in localStorage
        const allFeedback = JSON.parse(localStorage.getItem('integratedFeedback') || '[]');
        allFeedback.push(ratingData);
        localStorage.setItem('integratedFeedback', JSON.stringify(allFeedback));
        
        // Show success state
        showSuccessState();
    }
    
    function showSuccessState() {
        hideElement('step2');
        showElement('successStep');
        
        // Auto-reset after 3 seconds
        setTimeout(() => {
            resetToEntry();
        }, 3000);
    }
    
    function resetToEntry() {
        // Hide all steps
        hideElement('step1');
        hideElement('step2');
        hideElement('successStep');
        
        // Show entry point
        showElement('ratingEntryPoint');
        
        // Reset data
        Object.assign(ratingData, {
            overall: null,
            overallQualities: [],
            overallComments: '',
            pages: {},
            pageComments: ''
        });
        
        // Reset UI
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
        document.getElementById('submitStep1Btn').disabled = true;
        
        // Clear quality pills
        document.getElementById('overallQualityPills').innerHTML = '';
        initializePageQualityPills();
    }
    
    function showElement(elementId) {
        const element = document.getElementById(elementId);
        element.style.display = 'block';
        
        // Add active class with slight delay for animation
        setTimeout(() => {
            element.classList.add('active');
        }, 10);
    }
    
    function hideElement(elementId) {
        const element = document.getElementById(elementId);
        element.classList.add('exiting');
        
        setTimeout(() => {
            element.style.display = 'none';
            element.classList.remove('active', 'exiting');
        }, 300);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape to cancel/go back
        if (e.key === 'Escape') {
            const step1Visible = document.getElementById('step1').classList.contains('active');
            const step2Visible = document.getElementById('step2').classList.contains('active');
            
            if (step2Visible) {
                document.getElementById('skipStep2Btn').click();
            } else if (step1Visible) {
                document.getElementById('cancelStep1Btn').click();
            }
        }
    });
    
    // Load and display any existing feedback on page load
    loadExistingFeedback();
    
    function loadExistingFeedback() {
        const existingFeedback = JSON.parse(localStorage.getItem('integratedFeedback') || '[]');
        
        if (existingFeedback.length > 0) {
            console.log('Previous feedback sessions:', existingFeedback);
        }
    }
});