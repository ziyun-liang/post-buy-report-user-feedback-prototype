# Post Buy Report Prototype - Interactive Rating System

A sophisticated interactive prototype for the Incyte Opzelura Post Buy Report featuring an elegant sidebar rating system with inline feedback collection.

## 🎯 Features

### **Core Experience**
- **Smooth Page Navigation**: Click anywhere on sidebar rating pills to navigate between pages
- **Real-time Page Tracking**: Automatic highlighting of current page in sidebar
- **Interactive Rating System**: Thumb up/down ratings for individual pages
- **Inline Feedback Collection**: Expandable feedback module within the sidebar
- **Quality Pills**: Pre-defined quality attributes for structured feedback
- **Persistent Feedback**: Remembers previous selections when revisiting ratings
- **Thank You Messaging**: Contextual appreciation messages with smooth animations

### **Technical Highlights**
- **Event-driven Architecture**: Smart event handling prevents conflicts between navigation and rating
- **Responsive Design**: Adapts beautifully across different screen sizes
- **Smooth Animations**: CSS transitions and JavaScript-powered height animations
- **LocalStorage Integration**: Maintains feedback state across browser sessions
- **Modular CSS**: Organized stylesheets for maintainability

## 📁 File Structure

```
post-buy-report-prototype/
├── rate-design-option-2.html          # Main HTML file
├── sidebar-rating-script.js           # Rating system JavaScript
├── sidebar-rating-styles.css          # Rating system styles
├── styles.css                         # Base layout styles  
├── script.js                          # Page navigation logic
├── images/                            # Report page images
│   ├── kaleidoscope-logo.png
│   ├── page-1-cover.png
│   ├── page-2-executive-summary.png
│   ├── page-3-spotlight.png
│   ├── page-4-recommendations.png
│   └── page-5-thank-you.png
└── README.md                          # This file
```

## 🚀 Getting Started

### **Running Locally**
1. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
2. Open: `http://localhost:8000/rate-design-option-2.html`

### **Navigation**
- **Click rating pills**: Navigate to any page by clicking the entire grey pill area
- **Thumb ratings**: Click thumbs up/down to rate individual pages
- **Detailed feedback**: Expand feedback forms by clicking rated thumbs
- **Auto-tracking**: Current page automatically highlights as you scroll

## ⭐ User Experience Flow

### **Rating Flow**
1. **Navigate**: Click on any rating pill to jump to that page
2. **Rate**: Click thumb up 👍 or thumb down 👎 for your initial rating
3. **Detail**: Click the same thumb again to provide detailed feedback
4. **Select**: Choose from quality pills that describe your experience
5. **Comment**: Add optional additional comments
6. **Submit**: Complete your feedback and see a thank you message
7. **Return**: Navigate back to the main rating view

### **Smart Features**
- **No Conflicts**: Thumb buttons don't trigger page navigation
- **Memory**: Previous selections are restored when you return to feedback
- **Flexible**: Can rate pages in any order, skip detailed feedback, or go back
- **Responsive**: Thank you messages appear without disrupting layout

## 🎨 Design System

### **Typography**
- **Primary Font**: NYTFranklin with system fallbacks
- **Sizes**: 12px (ratings), 13px (titles), 14px (content)
- **Weights**: 600 (semi-bold) for emphasis

### **Colors**
- **Positive**: #4caf50 (green for thumbs up and positive feedback)
- **Negative**: #f44336 (red for thumbs down and improvement areas)
- **Neutral**: #666 (default icon color)
- **Borders**: #e1e1e1 (default), #d0d0d0 (hover)
- **Backgrounds**: #f5f5f5 (current page highlight)

### **Spacing**
- **Pill gaps**: 4px between rating items
- **Icon spacing**: 6px between thumb up/down
- **Container padding**: 10px within rating pills
- **Bottom anchor**: 0px from sidebar bottom

## 🔧 Technical Implementation

### **Key JavaScript Features**
- **Feature Flag**: `ENABLE_FEEDBACK_PERSISTENCE` for easy disable
- **Event Delegation**: Smart click handling with `closest()` checks
- **Scroll Tracking**: Real-time current page detection
- **State Management**: LocalStorage for ratings and detailed feedback
- **Animation Control**: Smooth height transitions and opacity changes

### **CSS Architecture**
- **Component-based**: Separate stylesheets for different concerns
- **Responsive**: Media queries for smaller screens
- **Transitions**: Smooth hover effects and state changes
- **Positioning**: Mix of flexbox and absolute positioning for layouts

## 🌐 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: Touch-friendly interface with proper sizing
- **JavaScript**: ES6+ features with graceful degradation
- **CSS**: Flexbox and CSS transitions support required

## 🔄 Customization

### **Easy Modifications**
- **Disable Persistence**: Set `ENABLE_FEEDBACK_PERSISTENCE = false`
- **Adjust Timings**: Modify `setTimeout` values for thank you messages
- **Update Quality Pills**: Edit `positiveQualities` and `negativeQualities` arrays
- **Change Colors**: Update CSS custom properties or color values
- **Modify Spacing**: Adjust padding, margins, and gap values

### **Adding New Features**
- **Additional Pages**: Add more `page-rating-item` elements with sequential data-page attributes
- **New Feedback Types**: Extend quality pill arrays or add new feedback mechanisms
- **Enhanced Analytics**: Hook into existing event handlers for tracking
- **Custom Animations**: Build on existing CSS transition framework

---

**Built with attention to user experience, technical excellence, and design fidelity.** ✨