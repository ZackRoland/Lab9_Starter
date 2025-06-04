 // Custom Error Classes
 class InputError extends Error {
    constructor(message) { 
      super(message); 
      this.name = 'InputError'; 
    }
  }

  class DivideByZeroError extends Error {
    constructor(message) { 
      super(message); 
      this.name = 'DivideByZeroError'; 
    }
  }

  class CalculationError extends Error {
    constructor(message) { 
      super(message); 
      this.name = 'CalculationError'; 
    }
  }

  // Global error handlers
  window.onerror = function(message, source, lineno, colno, error) {
    console.error(`Global Error Handler - Message: ${message}`);
    console.error(`Source: ${source}, Line: ${lineno}, Column: ${colno}`);
    console.error('Error object:', error);
    
    // Update debug info
    const debugInfo = document.getElementById('debug-info');
    debugInfo.innerHTML += `<p style="color: red;">Global Error: ${message} at line ${lineno}</p>`;
    
    return false; // Don't prevent default browser error handling
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    const debugInfo = document.getElementById('debug-info');
    debugInfo.innerHTML += `<p style="color: red;">Unhandled Promise Rejection: ${event.reason}</p>`;
  });

  // Console button functionality
  let errorBtns = Array.from(document.querySelectorAll('#error-btns > button'));
  let timerStarted = false;
  let groupStarted = false;

  errorBtns[0].addEventListener('click', () => {
    console.log('This is a console log message with data:', { timestamp: new Date(), user: 'testUser' });
  });

  errorBtns[1].addEventListener('click', () => {
    console.error('This is a console error with stack trace');
  });

  errorBtns[2].addEventListener('click', () => {
    console.count('Button click counter');
  });

  errorBtns[3].addEventListener('click', () => {
    console.warn('This is a console warning - potential issue detected');
  });

  errorBtns[4].addEventListener('click', () => {
    console.assert(false, 'This assertion failed - expected condition was not met');
  });

  errorBtns[5].addEventListener('click', () => {
    console.clear();
  });

  errorBtns[6].addEventListener('click', () => {
    const outputElement = document.querySelector('#result');
    console.dir(outputElement);
  });

  errorBtns[7].addEventListener('click', () => {
    const outputElement = document.querySelector('#result');
    console.dirxml(outputElement);
  });

  errorBtns[8].addEventListener('click', () => {
    if (!groupStarted) {
      console.group('Console Group Demo');
      console.log('This is inside the group');
      console.log('Another message in the group');
      console.warn('Warning inside group');
      groupStarted = true;
    } else {
      console.log('Group already started - click "Console Group End" first');
    }
  });

  errorBtns[9].addEventListener('click', () => {
    if (groupStarted) {
      console.groupEnd();
      groupStarted = false;
    } else {
      console.log('No group to end - click "Console Group Start" first');
    }
  });

  errorBtns[10].addEventListener('click', () => {
    const sampleData = [
      { name: 'John', age: 25, city: 'New York' },
      { name: 'Jane', age: 30, city: 'Los Angeles' },
      { name: 'Bob', age: 35, city: 'Chicago' }
    ];
    console.table(sampleData);
  });

  errorBtns[11].addEventListener('click', () => {
    if (!timerStarted) {
      console.time('Performance Timer');
      timerStarted = true;
      console.log('Timer started - click "End Timer" to see elapsed time');
    } else {
      console.log('Timer already running - click "End Timer" first');
    }
  });

  errorBtns[12].addEventListener('click', () => {
    if (timerStarted) {
      console.timeEnd('Performance Timer');
      timerStarted = false;
    } else {
      console.log('No timer to end - click "Start Timer" first');
    }
  });

  errorBtns[13].addEventListener('click', () => {
    function level3() {
      console.trace('This is a stack trace from level 3');
    }
    function level2() {
      level3();
    }
    function level1() {
      level2();
    }
    level1();
  });

  errorBtns[14].addEventListener('click', () => {
    try {
      // This will trigger a global error
      throw new Error('This is a deliberately triggered global error for testing purposes');
    } catch (error) {
      // Re-throw to make it global
      setTimeout(() => {
        throw error;
      }, 0);
    }
  });

  // Safe calculation function
  function safeCalculate(a, b, operator) {
    const numA = Number(a);
    const numB = Number(b);
    
    switch (operator) {
      case '+':
        return numA + numB;
      case '-':
        return numA - numB;
      case '*':
        return numA * numB;
      case '/':
        if (numB === 0) {
          throw new DivideByZeroError('Division by zero is not allowed');
        }
        return numA / numB;
      default:
        throw new CalculationError(`Unknown operator: ${operator}`);
    }
  }

  // Calculator form handler - SINGLE EVENT LISTENER
  document.getElementById('calc-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const resultElement = document.getElementById('result');
    const firstNum = document.getElementById('first-num').value.trim();
    const secondNum = document.getElementById('second-num').value.trim();
    const operator = document.getElementById('operator').value;
    
    // Reset styling
    resultElement.className = '';
    
    try {
      // Input validation
      if (!firstNum || !secondNum) {
        throw new InputError('Both number fields are required');
      }
      
      // Check if inputs are valid numbers
      const numA = Number(firstNum);
      const numB = Number(secondNum);
      
      if (isNaN(numA) || isNaN(numB)) {
        throw new InputError('Please enter valid numbers only');
      }
      
      // Check for extremely large numbers that might cause issues
      if (Math.abs(numA) > Number.MAX_SAFE_INTEGER || Math.abs(numB) > Number.MAX_SAFE_INTEGER) {
        throw new InputError('Numbers are too large for safe calculation');
      }
      
      // Perform calculation
      const result = safeCalculate(firstNum, secondNum, operator);
      
      // Check for invalid results
      if (!isFinite(result)) {
        throw new CalculationError('Calculation resulted in invalid number');
      }
      
      // Display result
      resultElement.textContent = result;
      resultElement.className = 'success';
      console.log(`Calculation successful: ${firstNum} ${operator} ${secondNum} = ${result}`);
      
    } catch (error) {
      // Handle specific error types
      if (error instanceof InputError) {
        console.error(`Input Error: ${error.message}`);
        resultElement.textContent = `Input Error: ${error.message}`;
      } else if (error instanceof DivideByZeroError) {
        console.error(`Division Error: ${error.message}`);
        resultElement.textContent = `Division Error: ${error.message}`;
      } else if (error instanceof CalculationError) {
        console.error(`Calculation Error: ${error.message}`);
        resultElement.textContent = `Calculation Error: ${error.message}`;
      } else {
        // Handle unexpected errors
        console.error('Unexpected error during calculation:', error);
        resultElement.textContent = 'An unexpected error occurred. Check console for details.';
      }
      
      resultElement.className = 'error';
      
      // Log stack trace for debugging
      console.error('Stack trace:', error.stack);
      
    } finally {
      console.log('Calculation attempt completed at:', new Date().toISOString());
    }
  });

  // Test for potential issues on page load
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully');
    
    // Test that all required elements exist
    const requiredElements = ['#calc-form', '#result', '#first-num', '#second-num', '#operator'];
    requiredElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        console.error(`Required element not found: ${selector}`);
      }
    });
    
    // Test that all buttons have event listeners
    const buttons = document.querySelectorAll('#error-btns > button');
    console.log(`Found ${buttons.length} console demo buttons`);
    
    if (buttons.length !== 15) {
      console.warn(`Expected 15 buttons, found ${buttons.length}`);
    }
  });

  // Additional error catching for async operations
  setTimeout(() => {
    try {
      console.log('Delayed initialization completed');
    } catch (error) {
      console.error('Error in delayed initialization:', error);
    }
  }, 100);