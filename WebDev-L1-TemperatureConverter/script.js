/**
 * Temperature Converter - Vanilla JavaScript
 * Oasis Infobyte Level 1 Task 3
 * 
 * Features:
 * - Converts between Celsius, Fahrenheit, and Kelvin
 * - Input validation (empty, non-numeric, absolute zero)
 * - Accessible error handling
 * - Responsive result display
 */

(function() {
    'use strict';

    // ========================================
    // CONSTANTS & CONFIGURATION
    // ========================================
    const ABSOLUTE_ZERO = {
        celsius: -273.15,
        fahrenheit: -459.67,
        kelvin: 0
    };

    const UNIT_LABELS = {
        celsius: { symbol: '°C', name: 'Celsius', color: '#EF4444' },
        fahrenheit: { symbol: '°F', name: 'Fahrenheit', color: '#22C55E' },
        kelvin: { symbol: 'K', name: 'Kelvin', color: '#3B82F6' }
    };

    const DECIMAL_PLACES = 2;

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const elements = {
        form: document.getElementById('converterForm'),
        temperatureInput: document.getElementById('temperatureInput'),
        unitSelect: document.getElementById('unitSelect'),
        convertBtn: document.getElementById('convertBtn'),
        inputUnitDisplay: document.getElementById('inputUnitDisplay'),
        resultsSection: document.getElementById('resultsSection'),
        resultsGrid: document.getElementById('resultsGrid'),
        errorBanner: document.getElementById('errorBanner'),
        errorText: document.getElementById('errorText'),
        tempError: document.getElementById('tempError'),
        unitError: document.getElementById('unitError')
    };

    // ========================================
    // STATE
    // ========================================
    let isConverting = false;

    // ========================================
    // CONVERSION FORMULAS
    // ========================================
    const conversions = {
        // Convert FROM celsius TO other units
        celsius: {
            fahrenheit: (c) => (c * 9/5) + 32,
            kelvin: (c) => c + 273.15
        },
        // Convert FROM fahrenheit TO other units
        fahrenheit: {
            celsius: (f) => (f - 32) * 5/9,
            kelvin: (f) => (f - 32) * 5/9 + 273.15
        },
        // Convert FROM kelvin TO other units
        kelvin: {
            celsius: (k) => k - 273.15,
            fahrenheit: (k) => (k - 273.15) * 9/5 + 32
        }
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    /**
     * Round number to specified decimal places
     * @param {number} value - Number to round
     * @param {number} decimals - Decimal places (default: 2)
     * @returns {number} Rounded number
     */
    function round(value, decimals = DECIMAL_PLACES) {
        const factor = Math.pow(10, decimals);
        return Math.round((value + Number.EPSILON) * factor) / factor;
    }

    /**
     * Format number for display with consistent decimal places
     * @param {number} value - Number to format
     * @returns {string} Formatted string
     */
    function formatValue(value) {
        return round(value).toFixed(DECIMAL_PLACES);
    }

    /**
     * Validate temperature input
     * @param {string} value - Raw input value
     * @param {string} unit - Selected unit (celsius, fahrenheit, kelvin)
     * @returns {Object} Validation result { valid: boolean, value?: number, error?: string }
     */
    function validateInput(value, unit) {
        // Check empty
        if (value === '' || value === null || value === undefined) {
            return { valid: false, error: 'Please enter a temperature.' };
        }

        // Check numeric
        const numValue = Number(value);
        if (isNaN(numValue) || !isFinite(numValue)) {
            return { valid: false, error: 'Please enter a valid numeric temperature.' };
        }

        // Check absolute zero
        const absoluteZero = ABSOLUTE_ZERO[unit];
        if (numValue < absoluteZero) {
            const unitLabel = UNIT_LABELS[unit];
            return { 
                valid: false, 
                error: `Temperature cannot be below absolute zero (${absoluteZero} ${unitLabel.symbol}).` 
            };
        }

        return { valid: true, value: numValue };
    }

    /**
     * Show error message in form field
     * @param {HTMLElement} errorElement - Error message element
     * @param {string} message - Error message
     */
    function showFieldError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    /**
     * Hide error message in form field
     * @param {HTMLElement} errorElement - Error message element
     */
    function hideFieldError(errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }

    /**
     * Show global error banner
     * @param {string} message - Error message
     */
    function showGlobalError(message) {
        elements.errorText.textContent = message;
        elements.errorBanner.hidden = false;
        
        // Focus for accessibility
        elements.errorBanner.focus();
    }

    /**
     * Hide global error banner
     */
    function hideGlobalError() {
        elements.errorBanner.hidden = true;
        elements.errorText.textContent = '';
    }

    /**
     * Set loading state on convert button
     * @param {boolean} loading - Loading state
     */
    function setLoading(loading) {
        isConverting = loading;
        elements.convertBtn.classList.toggle('loading', loading);
        elements.convertBtn.disabled = loading;
        
        if (loading) {
            elements.convertBtn.setAttribute('aria-busy', 'true');
        } else {
            elements.convertBtn.removeAttribute('aria-busy');
        }
    }

    // ========================================
    // CORE CONVERSION LOGIC
    // ========================================

    /**
     * Perform temperature conversion
     * @param {number} value - Temperature value
     * @param {string} fromUnit - Source unit
     * @returns {Object} Converted values for all units
     */
    function convertTemperature(value, fromUnit) {
        const results = {};
        
        // Always include the original value
        results[fromUnit] = value;

        // Convert to other units
        const conversionFns = conversions[fromUnit];
        for (const [targetUnit, convertFn] of Object.entries(conversionFns)) {
            results[targetUnit] = convertFn(value);
        }

        return results;
    }

    /**
     * Create result card HTML
     * @param {string} unit - Unit key
     * @param {number} value - Temperature value
     * @param {boolean} isOriginal - Whether this is the input unit
     * @returns {string} HTML string
     */
    function createResultCard(unit, value, isOriginal = false) {
        const label = UNIT_LABELS[unit];
        const formattedValue = formatValue(value);
        
        return `
            <article class="result-card" style="--card-accent: ${label.color};">
                <div class="result-content">
                    <span class="result-label">${label.name}</span>
                    <span class="result-value">${formattedValue} <span style="font-size: 0.75em; font-weight: 500; color: var(--text-muted);">${label.symbol}</span></span>
                </div>
                ${isOriginal ? '<span class="original-badge" aria-label="Input unit">✓</span>' : ''}
            </article>
        `;
    }

    /**
     * Display conversion results
     * @param {Object} results - Converted values
     * @param {string} originalUnit - Original input unit
     */
    function displayResults(results, originalUnit) {
        // Clear previous results
        elements.resultsGrid.innerHTML = '';

        // Define display order: always show Celsius, Fahrenheit, Kelvin
        const displayOrder = ['celsius', 'fahrenheit', 'kelvin'];

        // Generate cards
        const cardsHTML = displayOrder.map(unit => 
            createResultCard(unit, results[unit], unit === originalUnit)
        ).join('');

        elements.resultsGrid.innerHTML = cardsHTML;
        elements.resultsSection.hidden = false;

        // Scroll results into view on mobile
        if (window.innerWidth < 640) {
            elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // ========================================
    // EVENT HANDLERS
    // ========================================

    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    function handleSubmit(event) {
        event.preventDefault();

        if (isConverting) return;

        // Hide previous errors
        hideGlobalError();
        hideFieldError(elements.tempError);
        hideFieldError(elements.unitError);

        // Get values
        const rawValue = elements.temperatureInput.value.trim();
        const selectedUnit = elements.unitSelect.value;

        // Validate input
        const validation = validateInput(rawValue, selectedUnit);

        if (!validation.valid) {
            showFieldError(elements.tempError, validation.error);
            elements.temperatureInput.setAttribute('aria-invalid', 'true');
            elements.temperatureInput.focus();
            return;
        }

        // Valid input
        elements.temperatureInput.removeAttribute('aria-invalid');

        // Perform conversion
        setLoading(true);
        
        // Small delay for better UX (shows loading state)
        setTimeout(() => {
            try {
                const results = convertTemperature(validation.value, selectedUnit);
                displayResults(results, selectedUnit);
                hideGlobalError();
            } catch (error) {
                console.error('Conversion error:', error);
                showGlobalError('An error occurred during conversion. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 150);
    }

    /**
     * Handle input changes - clear errors on user interaction
     */
    function handleInputChange() {
        hideFieldError(elements.tempError);
        elements.temperatureInput.removeAttribute('aria-invalid');
        
        // Update unit display
        const selectedUnit = elements.unitSelect.value;
        elements.inputUnitDisplay.textContent = UNIT_LABELS[selectedUnit].symbol;
    }

    /**
     * Handle unit select change
     */
    function handleUnitChange() {
        hideFieldError(elements.unitError);
        handleInputChange();
        
        // Update input min attribute for better browser validation
        const selectedUnit = elements.unitSelect.value;
        elements.temperatureInput.min = ABSOLUTE_ZERO[selectedUnit];
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeydown(event) {
        // Enter key in input triggers conversion
        if (event.key === 'Enter' && event.target === elements.temperatureInput) {
            event.preventDefault();
            elements.form.requestSubmit();
        }
        
        // Escape key clears focus
        if (event.key === 'Escape') {
            elements.temperatureInput.blur();
            elements.unitSelect.blur();
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        // Set initial unit display
        elements.inputUnitDisplay.textContent = UNIT_LABELS[elements.unitSelect.value].symbol;
        
        // Set initial min attribute
        elements.temperatureInput.min = ABSOLUTE_ZERO[elements.unitSelect.value];

        // Event listeners
        elements.form.addEventListener('submit', handleSubmit);
        elements.temperatureInput.addEventListener('input', handleInputChange);
        elements.unitSelect.addEventListener('change', handleUnitChange);
        document.addEventListener('keydown', handleKeydown);

        // Focus input on load
        elements.temperatureInput.focus();

        // Prevent form submission on Enter in select
        elements.unitSelect.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

        console.log('Tempera Temperature Converter initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
