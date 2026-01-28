import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);

  const tourSteps = [
    {
      id: 'sidebar-toggle',
      title: 'Sidebar Toggle',
      message: 'Click this button to collapse or expand the navigation sidebar. This gives you more space to work with.',
      target: '.nav-link[data-widget="pushmenu"]',
      position: 'bottom'
    },
    {
      id: 'dark-mode',
      title: 'Dark Mode Toggle',
      message: 'Switch between light and dark themes. The moon icon indicates dark mode is off, sun icon means it\'s on.',
      target: '.navbar-nav.ml-auto .nav-item:nth-child(2) .nav-link',
      position: 'bottom'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      message: 'Check your notifications here. The badge shows the number of unread notifications.',
      target: '.navbar-nav.ml-auto .nav-item.dropdown:first-child .nav-link',
      position: 'bottom'
    },
    {
      id: 'user-menu',
      title: 'User Account Menu',
      message: 'Access your account settings and logout option from this dropdown menu.',
      target: '.user-menu .nav-link',
      position: 'bottom'
    },
    {
      id: 'dashboard-link',
      title: 'Dashboard Navigation',
      message: 'Navigate to the main dashboard to see your business overview and key metrics.',
      target: '.nav-sidebar .nav-item:first-child .nav-link',
      position: 'right'
    },
    {
      id: 'categories-link',
      title: 'Categories Management',
      message: 'Manage your product categories - add, edit, or remove categories from your catalog.',
      target: '.nav-sidebar .nav-item:nth-child(2) .nav-link',
      position: 'right'
    },
    {
      id: 'products-link',
      title: 'Products Management',
      message: 'Add, edit, and manage your product inventory, pricing, and descriptions.',
      target: '.nav-sidebar .nav-item:nth-child(3) .nav-link',
      position: 'right'
    },
    {
      id: 'stats-categories',
      title: 'Categories Count',
      message: 'This shows the total number of product categories in your system with growth trend.',
      target: '.stat-card.categories-card',
      position: 'top'
    },
    {
      id: 'stats-products',
      title: 'Products Count',
      message: 'Total number of products in your inventory with recent growth percentage.',
      target: '.stat-card.products-card',
      position: 'top'
    },
    {
      id: 'stats-packs',
      title: 'Product Packs',
      message: 'Number of product bundles or packs you\'ve created for customers.',
      target: '.stat-card.packs-card',
      position: 'top'
    },
    {
      id: 'stats-customers',
      title: 'Customer Base',
      message: 'Total registered customers with growth trend indicator.',
      target: '.stat-card.customers-card',
      position: 'top'
    },
    {
      id: 'stats-orders',
      title: 'Order Volume',
      message: 'Total orders processed with recent performance metrics.',
      target: '.stat-card.orders-card',
      position: 'top'
    },
    {
      id: 'manage-categories',
      title: 'Quick Category Management',
      message: 'Quick access to manage categories - add new categories or edit existing ones.',
      target: '.action-item.categories .action-btn',
      position: 'top'
    },
    {
      id: 'manage-products',
      title: 'Quick Product Management',
      message: 'Direct access to product management - update inventory, pricing, and details.',
      target: '.action-item.products .action-btn',
      position: 'top'
    },
    {
      id: 'manage-packs',
      title: 'Pack Management',
      message: 'Create and manage product packs and bundles for better customer offerings.',
      target: '.action-item.packs .action-btn',
      position: 'top'
    },
    {
      id: 'view-customers',
      title: 'Customer Overview',
      message: 'View customer details, order history, and manage customer relationships.',
      target: '.action-item.customers .action-btn',
      position: 'top'
    },
    {
      id: 'track-orders',
      title: 'Order Tracking',
      message: 'Monitor orders, track deliveries, and manage order fulfillment.',
      target: '.action-item.orders .action-btn',
      position: 'top'
    },
    {
      id: 'recent-activity',
      title: 'Activity Timeline',
      message: 'See recent system activities like admin logins, new orders, and product updates.',
      target: '.activity-timeline',
      position: 'left'
    },
    {
      id: 'system-status',
      title: 'System Health',
      message: 'Monitor server status, database connection, and API performance in real-time.',
      target: '.status-indicators',
      position: 'left'
    }
  ];

  const startTour = () => {
    setIsTourActive(true);
    setCurrentStep(0);
    setIsOpen(false);
    highlightElement(0);
  };

  const highlightElement = (stepIndex) => {
    const step = tourSteps[stepIndex];
    const element = document.querySelector(step.target);

    if (element) {
      // Remove previous highlight
      if (highlightedElement) {
        highlightedElement.classList.remove('ai-highlight');
      }

      // Add highlight to new element
      element.classList.add('ai-highlight');
      setHighlightedElement(element);

      // Scroll element into view with better positioning
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });

      // Add a slight delay to ensure scrolling is complete before positioning tooltip
      setTimeout(() => {
        positionTooltip(step, element);
      }, 300);
    }
  };

  const positionTooltip = (step, element) => {
    const tooltip = document.querySelector('.ai-tour-tooltip');
    if (!tooltip || !element) return;

    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top, left;

    switch (step.position) {
      case 'top':
        top = elementRect.top - tooltipRect.height - 10;
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = elementRect.bottom + 10;
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        left = elementRect.left - tooltipRect.width - 10;
        break;
      case 'right':
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        left = elementRect.right + 10;
        break;
      default:
        top = elementRect.bottom + 10;
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
    }

    // Ensure tooltip stays within viewport bounds
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = viewportHeight - tooltipRect.height - 10;
    }

    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.zIndex = '10002';
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      highlightElement(nextStepIndex);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      highlightElement(prevStepIndex);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setCurrentStep(0);
    if (highlightedElement) {
      highlightedElement.classList.remove('ai-highlight');
      setHighlightedElement(null);
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      // Cleanup: remove highlight when component unmounts
      if (highlightedElement) {
        highlightedElement.classList.remove('ai-highlight');
      }
    };
  }, [highlightedElement]);

  return (
    <>
      {/* AI Assistant Chat Interface */}
      {isOpen && (
        <div className="ai-assistant-chat">
          <div className="ai-chat-header">
            <div className="ai-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="ai-info">
              <h4>AI Assistant</h4>
              <span>Ready to help!</span>
            </div>
            <button className="ai-close-btn" onClick={toggleAssistant}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="ai-chat-body">
            <div className="ai-message">
              <div className="ai-message-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="ai-message-content">
                <p>Hello! I'm your AI assistant for the FreshGrupo Admin Dashboard. I can guide you through all the features and explain what everything does.</p>
                <p>Would you like me to take you on a tour of the dashboard?</p>
              </div>
            </div>
          </div>

          <div className="ai-chat-footer">
            <button className="ai-tour-btn" onClick={startTour}>
              <i className="fas fa-route"></i>
              Start Dashboard Tour
            </button>
            <button className="ai-help-btn">
              <i className="fas fa-question-circle"></i>
              Ask for Help
            </button>
          </div>
        </div>
      )}

      {/* Tour Overlay */}
      {isTourActive && (
        <div className="ai-tour-overlay">
          <div className="ai-tour-tooltip">
            <div className="ai-tour-header">
              <h4>{tourSteps[currentStep].title}</h4>
              <button className="ai-tour-close" onClick={endTour}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="ai-tour-content">
              <p>{tourSteps[currentStep].message}</p>
            </div>
            <div className="ai-tour-footer">
              <div className="ai-tour-progress">
                <span>{currentStep + 1} of {tourSteps.length}</span>
              </div>
              <div className="ai-tour-buttons">
                <button
                  className="ai-tour-prev"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </button>
                <button
                  className="ai-tour-next"
                  onClick={nextStep}
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Button */}
      <div className="ai-assistant-btn" onClick={toggleAssistant}>
        <div className="ai-pulse"></div>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'}`}></i>
      </div>
    </>
  );
};

export default AIAssistant;