// Password Generator Pro

document.addEventListener('DOMContentLoaded', () => {
  // Clear badge when popup opens
  chrome.runtime.sendMessage({ action: 'clearBadge' }).catch(() => {});

  // DOM Elements
  const passwordText = document.getElementById('passwordText');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthValue = document.getElementById('lengthValue');
  const optUppercase = document.getElementById('optUppercase');
  const optLowercase = document.getElementById('optLowercase');
  const optNumbers = document.getElementById('optNumbers');
  const optSymbols = document.getElementById('optSymbols');
  const strengthText = document.getElementById('strengthText');
  const strengthFill = document.getElementById('strengthFill');
  const historyList = document.getElementById('historyList');
  const clearHistory = document.getElementById('clearHistory');

  // Character sets
  const CHARS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Password history (session only, max 5)
  let history = [];

  // Load saved preferences
  chrome.storage.local.get(['pwdLength', 'pwdUppercase', 'pwdLowercase', 'pwdNumbers', 'pwdSymbols'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Failed to load preferences:', chrome.runtime.lastError);
      return;
    }

    if (result.pwdLength) {
      lengthSlider.value = result.pwdLength;
      lengthValue.textContent = result.pwdLength;
    }
    if (result.pwdUppercase !== undefined) optUppercase.checked = result.pwdUppercase;
    if (result.pwdLowercase !== undefined) optLowercase.checked = result.pwdLowercase;
    if (result.pwdNumbers !== undefined) optNumbers.checked = result.pwdNumbers;
    if (result.pwdSymbols !== undefined) optSymbols.checked = result.pwdSymbols;

    // Generate initial password
    generatePassword();
  });

  // Save preferences when changed
  function savePreferences() {
    chrome.storage.local.set({
      pwdLength: parseInt(lengthSlider.value),
      pwdUppercase: optUppercase.checked,
      pwdLowercase: optLowercase.checked,
      pwdNumbers: optNumbers.checked,
      pwdSymbols: optSymbols.checked
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to save preferences:', chrome.runtime.lastError);
      }
    });
  }

  // Generate password using crypto API for security
  function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = '';

    if (optUppercase.checked) charset += CHARS.uppercase;
    if (optLowercase.checked) charset += CHARS.lowercase;
    if (optNumbers.checked) charset += CHARS.numbers;
    if (optSymbols.checked) charset += CHARS.symbols;

    // Ensure at least one option is selected
    if (!charset) {
      optLowercase.checked = true;
      charset = CHARS.lowercase;
      savePreferences();
    }

    // Generate password using crypto API
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }

    // Ensure password contains at least one of each selected type
    password = ensureCharacterTypes(password, charset);

    passwordText.textContent = password;
    updateStrengthMeter(password);
    addToHistory(password);

    return password;
  }

  // Ensure password has at least one of each selected character type
  function ensureCharacterTypes(password, charset) {
    const chars = password.split('');
    // Use 8 random values to ensure we have enough for all potential replacements
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);

    let index = 0;

    if (optUppercase.checked && !/[A-Z]/.test(password)) {
      const pos = array[index++] % chars.length;
      chars[pos] = CHARS.uppercase[array[index++] % CHARS.uppercase.length];
    }
    if (optLowercase.checked && !/[a-z]/.test(password)) {
      const pos = array[index++] % chars.length;
      chars[pos] = CHARS.lowercase[array[index++] % CHARS.lowercase.length];
    }
    if (optNumbers.checked && !/[0-9]/.test(password)) {
      const pos = array[index++] % chars.length;
      chars[pos] = CHARS.numbers[array[index++] % CHARS.numbers.length];
    }
    if (optSymbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      const pos = array[index++] % chars.length;
      chars[pos] = CHARS.symbols[array[index++] % CHARS.symbols.length];
    }

    return chars.join('');
  }

  // Calculate and display password strength
  function updateStrengthMeter(password) {
    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    // Length scoring
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 24) score += 1;

    // Character diversity
    const types = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    score += types;

    // Calculate strength level
    let strength, className;
    if (score <= 3) {
      strength = 'Weak';
      className = 'strength-weak';
    } else if (score <= 5) {
      strength = 'Fair';
      className = 'strength-fair';
    } else if (score <= 7) {
      strength = 'Good';
      className = 'strength-good';
    } else {
      strength = 'Strong';
      className = 'strength-strong';
    }

    strengthText.textContent = strength;
    strengthText.style.color = getStrengthColor(strength);
    strengthFill.className = 'strength-fill ' + className;
  }

  function getStrengthColor(strength) {
    const colors = {
      'Weak': '#ff4757',
      'Fair': '#ffa502',
      'Good': '#2ed573',
      'Strong': '#00d4aa'
    };
    return colors[strength] || '#fff';
  }

  // Add password to history
  function addToHistory(password) {
    // Don't add duplicates
    if (history[0] === password) return;

    history.unshift(password);
    if (history.length > 5) history.pop();

    renderHistory();
  }

  // Render history list
  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No passwords generated yet</div>';
      return;
    }

    historyList.innerHTML = history.map((pwd, index) => `
      <div class="history-item">
        <span class="history-item-text">${escapeHtml(pwd)}</span>
        <button class="history-copy" data-index="${index}" type="button" aria-label="Copy this password">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
    `).join('');

    // Add click handlers to history copy buttons
    historyList.querySelectorAll('.history-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        copyToClipboard(history[index]);
      });
    });
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Copy to clipboard
  async function copyToClipboard(text) {
    if (!text || text === 'Click Generate') {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showCopySuccess();
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showCopySuccess();
      } catch (e) {
        console.error('Copy failed:', e);
      }
      document.body.removeChild(textarea);
    }
  }

  // Track copy feedback timeout to prevent race conditions
  let copyTimeoutId = null;
  // Store original button HTML once to prevent race condition issues
  const copyBtnOriginalHTML = copyBtn.innerHTML;

  function showCopySuccess() {
    copyBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
      Copied!
    `;
    copyBtn.classList.add('copied');

    // Clear any existing timeout to prevent race conditions
    if (copyTimeoutId) {
      clearTimeout(copyTimeoutId);
    }

    copyTimeoutId = setTimeout(() => {
      copyBtn.innerHTML = copyBtnOriginalHTML;
      copyBtn.classList.remove('copied');
      copyTimeoutId = null;
    }, 1500);
  }

  // Event Listeners
  generateBtn.addEventListener('click', () => {
    generatePassword();
    savePreferences();
  });

  copyBtn.addEventListener('click', () => {
    copyToClipboard(passwordText.textContent);
  });

  lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
  });

  lengthSlider.addEventListener('change', () => {
    generatePassword();
    savePreferences();
  });

  [optUppercase, optLowercase, optNumbers, optSymbols].forEach(opt => {
    opt.addEventListener('change', () => {
      // Ensure at least one option is checked
      const anyChecked = optUppercase.checked || optLowercase.checked ||
                         optNumbers.checked || optSymbols.checked;
      if (!anyChecked) {
        opt.checked = true;
        return;
      }
      generatePassword();
      savePreferences();
    });
  });

  clearHistory.addEventListener('click', () => {
    history = [];
    renderHistory();
  });

  // Keyboard shortcut: Enter to generate, Ctrl+C to copy
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      generatePassword();
      savePreferences();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection().toString()) {
      e.preventDefault();
      copyToClipboard(passwordText.textContent);
    }
  });
});
