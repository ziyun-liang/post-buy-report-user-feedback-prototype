// Smooth scroll and snap-to-page behavior
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('.main-content');
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;
    let isScrolling = false;

    // Create page indicators
    createPageIndicators();

    // Handle wheel events for smooth page navigation
    mainContent.addEventListener('wheel', handleWheelScroll, { passive: false });

    // Handle keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Update active page indicator on scroll
    mainContent.addEventListener('scroll', updateActiveIndicator);

    // Initialize first page as active
    updateActiveIndicator();

    function createPageIndicators() {
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'page-indicator';
        
        pages.forEach((page, index) => {
            const dot = document.createElement('div');
            dot.className = 'page-dot';
            dot.dataset.page = index;
            dot.addEventListener('click', () => scrollToPage(index));
            indicatorContainer.appendChild(dot);
        });
        
        document.body.appendChild(indicatorContainer);
    }

    function handleWheelScroll(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const delta = e.deltaY;
        const scrollThreshold = 50;
        
        if (Math.abs(delta) > scrollThreshold) {
            if (delta > 0 && currentPage < pages.length - 1) {
                // Scroll down
                currentPage++;
                scrollToPage(currentPage);
            } else if (delta < 0 && currentPage > 0) {
                // Scroll up
                currentPage--;
                scrollToPage(currentPage);
            }
        }
    }

    function handleKeyboardNavigation(e) {
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentPage < pages.length - 1) {
                    currentPage++;
                    scrollToPage(currentPage);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentPage > 0) {
                    currentPage--;
                    scrollToPage(currentPage);
                }
                break;
            case 'Home':
                e.preventDefault();
                currentPage = 0;
                scrollToPage(currentPage);
                break;
            case 'End':
                e.preventDefault();
                currentPage = pages.length - 1;
                scrollToPage(currentPage);
                break;
        }
    }

    function scrollToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= pages.length) return;
        
        isScrolling = true;
        currentPage = pageIndex;
        
        const targetPage = pages[pageIndex];
        const offsetTop = targetPage.offsetTop - 120; // Account for fixed header
        
        mainContent.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling = false;
        }, 800);
        
        updateActiveIndicator();
    }

    function updateActiveIndicator() {
        const dots = document.querySelectorAll('.page-dot');
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
        
        currentPage = activePageIndex;
        
        // Update indicators
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activePageIndex);
        });
    }

    // Touch/swipe support for mobile (future enhancement)
    let touchStartY = 0;
    let touchEndY = 0;
    
    mainContent.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    mainContent.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPage < pages.length - 1) {
                // Swipe up - next page
                currentPage++;
                scrollToPage(currentPage);
            } else if (diff < 0 && currentPage > 0) {
                // Swipe down - previous page
                currentPage--;
                scrollToPage(currentPage);
            }
        }
    }

    // Prevent default scroll behavior on space bar
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (e.shiftKey) {
                // Shift + Space - previous page
                if (currentPage > 0) {
                    currentPage--;
                    scrollToPage(currentPage);
                }
            } else {
                // Space - next page
                if (currentPage < pages.length - 1) {
                    currentPage++;
                    scrollToPage(currentPage);
                }
            }
        }
    });
});
