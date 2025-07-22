// Configuration
const CONFIG = {
    // Update this with your actual API endpoint after deployment
    API_ENDPOINT: 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/transliterate',
    
    // For local development, you can use a local endpoint
    // API_ENDPOINT: 'http://localhost:3000/dev/transliterate',
    
    // For testing without a real endpoint, set this to true
    DEMO_MODE: true
};

// Demo responses for when API is not available
const DEMO_RESPONSES = {
    'محمد-علي-EG': {
        firstName: 'Mohammed',
        lastName: 'Ali',
        country: 'EG',
        accuracy: 0.95,
        details: {
            firstNameMethod: 'arabic_transliterate',
            lastNameMethod: 'arabic_transliterate',
            firstNameAccuracy: 0.95,
            lastNameAccuracy: 0.95,
            serviceInitialized: true
        }
    },
    '太郎-山田-JP': {
        firstName: 'Tarou',
        lastName: 'Yamada',
        country: 'JP',
        accuracy: 0.95,
        details: {
            firstNameMethod: 'kuroshiro',
            lastNameMethod: 'kuroshiro',
            firstNameAccuracy: 0.95,
            lastNameAccuracy: 0.95,
            serviceInitialized: true
        }
    },
    '민수-김-KR': {
        firstName: 'Minsu',
        lastName: 'Kim',
        country: 'KR',
        accuracy: 0.95,
        details: {
            firstNameMethod: 'korean_romanize',
            lastNameMethod: 'korean_romanize',
            firstNameAccuracy: 0.95,
            lastNameAccuracy: 0.95,
            serviceInitialized: true
        }
    },
    '小明-王-CN': {
        firstName: 'Xiaoming',
        lastName: 'Wang',
        country: 'CN',
        accuracy: 0.6,
        method: 'general_transliteration',
        details: {
            firstNameMethod: 'general_transliteration',
            lastNameMethod: 'general_transliteration',
            firstNameAccuracy: 0.6,
            lastNameAccuracy: 0.6
        }
    },
    'Владимир-Иванов-RU': {
        firstName: 'Vladimir',
        lastName: 'Ivanov',
        country: 'RU',
        accuracy: 0.6,
        method: 'general_transliteration',
        details: {
            firstNameMethod: 'general_transliteration',
            lastNameMethod: 'general_transliteration',
            firstNameAccuracy: 0.6,
            lastNameAccuracy: 0.6
        }
    },
    'สมชาย-จันทร์-TH': {
        firstName: 'Somchai',
        lastName: 'Chan',
        country: 'TH',
        accuracy: 0.6,
        method: 'general_transliteration',
        details: {
            firstNameMethod: 'general_transliteration',
            lastNameMethod: 'general_transliteration',
            firstNameAccuracy: 0.6,
            lastNameAccuracy: 0.6
        }
    }
};

// DOM Elements
let elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    updateAPIEndpointDisplay();
    console.log('Demo app initialized!');
});

function initializeElements() {
    elements = {
        form: document.getElementById('transliteration-form'),
        firstNameInput: document.getElementById('firstName'),
        lastNameInput: document.getElementById('lastName'),
        countrySelect: document.getElementById('country'),
        submitBtn: document.getElementById('submit-btn'),
        jsonInput: document.getElementById('jsonInput'),
        jsonSubmitBtn: document.getElementById('json-submit-btn'),
        loading: document.getElementById('loading'),
        results: document.getElementById('results'),
        error: document.getElementById('error'),
        apiEndpoint: document.getElementById('api-endpoint')
    };
}

function initializeEventListeners() {
    // Example card click handlers
    document.querySelectorAll('.example-card').forEach(card => {
        card.addEventListener('click', function() {
            const exampleData = JSON.parse(this.dataset.example);
            runExample(exampleData);
        });
    });

    // Form submission
    elements.form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });

    // JSON submission
    elements.jsonSubmitBtn.addEventListener('click', function() {
        handleJSONSubmission();
    });

    // Auto-fill form from JSON input
    elements.jsonInput.addEventListener('input', function() {
        try {
            const data = JSON.parse(this.value);
            if (data.firstName && data.lastName && data.country) {
                elements.firstNameInput.value = data.firstName;
                elements.lastNameInput.value = data.lastName;
                elements.countrySelect.value = data.country;
            }
        } catch (e) {
            // Ignore JSON parse errors during typing
        }
    });
}

function updateAPIEndpointDisplay() {
    if (CONFIG.DEMO_MODE) {
        elements.apiEndpoint.textContent = 'Demo Mode - Using mock responses';
        elements.apiEndpoint.style.color = '#f59e0b';
    } else {
        elements.apiEndpoint.textContent = CONFIG.API_ENDPOINT;
    }
}

async function runExample(exampleData) {
    // Fill the form with example data
    elements.firstNameInput.value = exampleData.firstName;
    elements.lastNameInput.value = exampleData.lastName;
    elements.countrySelect.value = exampleData.country;
    elements.jsonInput.value = JSON.stringify(exampleData, null, 2);

    // Scroll to the form
    document.querySelector('.testing-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });

    // Submit the request
    await makeTransliterationRequest(exampleData);
}

async function handleFormSubmission() {
    const formData = {
        firstName: elements.firstNameInput.value.trim(),
        lastName: elements.lastNameInput.value.trim(),
        country: elements.countrySelect.value
    };

    // Update JSON input
    elements.jsonInput.value = JSON.stringify(formData, null, 2);

    await makeTransliterationRequest(formData);
}

async function handleJSONSubmission() {
    try {
        const jsonData = JSON.parse(elements.jsonInput.value);
        
        // Validate required fields
        if (!jsonData.firstName || !jsonData.lastName || !jsonData.country) {
            showError('Invalid JSON: Missing required fields (firstName, lastName, country)');
            return;
        }

        // Update form fields
        elements.firstNameInput.value = jsonData.firstName;
        elements.lastNameInput.value = jsonData.lastName;
        elements.countrySelect.value = jsonData.country;

        await makeTransliterationRequest(jsonData);
    } catch (error) {
        showError('Invalid JSON format: ' + error.message);
    }
}

async function makeTransliterationRequest(data) {
    try {
        // Validate input
        if (!data.firstName || !data.lastName || !data.country) {
            showError('Please fill in all required fields');
            return;
        }

        // Show loading state
        showLoading();

        let response;
        
        if (CONFIG.DEMO_MODE) {
            // Use demo responses
            response = await simulateAPICall(data);
        } else {
            // Make actual API call
            response = await callRealAPI(data);
        }

        showResults(response);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An unexpected error occurred');
    }
}

async function simulateAPICall(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const key = `${data.firstName}-${data.lastName}-${data.country}`;
    const demoResponse = DEMO_RESPONSES[key];

    if (demoResponse) {
        return demoResponse;
    } else {
        // Generate a generic response for unknown inputs
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            country: data.country,
            accuracy: 0.6,
            method: 'general_transliteration',
            details: {
                firstNameMethod: 'general_transliteration',
                lastNameMethod: 'general_transliteration',
                firstNameAccuracy: 0.6,
                lastNameAccuracy: 0.6,
                note: 'Demo mode - actual transliteration not performed'
            }
        };
    }
}

async function callRealAPI(data) {
    const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Handle API error responses
    if (result.error) {
        throw new Error(result.message || 'API returned an error');
    }

    return result;
}

function showLoading() {
    hideAllStates();
    elements.loading.classList.remove('hidden');
    elements.submitBtn.disabled = true;
    elements.jsonSubmitBtn.disabled = true;
}

function showResults(data) {
    hideAllStates();
    
    // Populate result fields
    document.getElementById('result-firstName').textContent = data.firstName;
    document.getElementById('result-lastName').textContent = data.lastName;
    document.getElementById('result-country').textContent = data.country;
    
    // Format accuracy as percentage
    const accuracy = Math.round((data.accuracy || 0) * 100);
    document.getElementById('result-accuracy').textContent = `${accuracy}%`;
    
    // Show method (prefer from details if available)
    const method = data.details?.firstNameMethod || data.method || 'unknown';
    document.getElementById('result-method').textContent = formatMethodName(method);
    
    // Show detailed JSON
    document.getElementById('result-json').textContent = JSON.stringify(data, null, 2);
    
    elements.results.classList.remove('hidden');
    
    // Re-enable buttons
    elements.submitBtn.disabled = false;
    elements.jsonSubmitBtn.disabled = false;
}

function showError(message) {
    hideAllStates();
    
    document.getElementById('error-message').textContent = message;
    
    // Show additional context if available
    const errorDetails = {
        timestamp: new Date().toISOString(),
        endpoint: CONFIG.DEMO_MODE ? 'Demo Mode' : CONFIG.API_ENDPOINT,
        demoMode: CONFIG.DEMO_MODE
    };
    
    document.getElementById('error-json').textContent = JSON.stringify(errorDetails, null, 2);
    
    elements.error.classList.remove('hidden');
    
    // Re-enable buttons
    elements.submitBtn.disabled = false;
    elements.jsonSubmitBtn.disabled = false;
}

function hideAllStates() {
    elements.loading.classList.add('hidden');
    elements.results.classList.add('hidden');
    elements.error.classList.add('hidden');
}

function formatMethodName(method) {
    const methodNames = {
        'arabic_transliterate': 'Arabic Transliterate',
        'kuroshiro': 'Kuroshiro (Japanese)',
        'korean_romanize': 'Korean Romanize',
        'general_transliteration': 'General Transliteration',
        'exact_match': 'Exact Match',
        'original_text_fallback': 'Original Text (Fallback)'
    };
    
    return methodNames[method] || method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Utility function for documentation
function showDocumentation() {
    alert('For full documentation, please visit the GitHub repository linked in the footer!');
}

// API Configuration Helper
function updateAPIEndpoint(newEndpoint) {
    CONFIG.API_ENDPOINT = newEndpoint;
    CONFIG.DEMO_MODE = false;
    updateAPIEndpointDisplay();
    console.log('API endpoint updated to:', newEndpoint);
}

// Console helpers for developers
console.log('🌍 Lambda Transliterate Names Demo');
console.log('📡 API Endpoint:', CONFIG.API_ENDPOINT);
console.log('🧪 Demo Mode:', CONFIG.DEMO_MODE);
console.log('');
console.log('💡 To use your own API endpoint:');
console.log('   updateAPIEndpoint("https://your-api-gateway-url.com/transliterate")');
console.log('');
console.log('🔧 Available functions:');
console.log('   - updateAPIEndpoint(url) - Set your API endpoint');
console.log('   - runExample(data) - Test with example data');
console.log('   - makeTransliterationRequest(data) - Direct API call');
console.log('   - showDocumentation() - View documentation');

// Export functions for console access
window.updateAPIEndpoint = updateAPIEndpoint;
window.runExample = runExample;
window.makeTransliterationRequest = makeTransliterationRequest;
window.showDocumentation = showDocumentation; 