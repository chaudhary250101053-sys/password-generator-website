const passwordDisplay = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const userNameInput = document.getElementById('user-name');
const userDobInput = document.getElementById('user-dob');
const uppercaseCb = document.getElementById('uppercase');
const lowercaseCb = document.getElementById('lowercase');
const numbersCb = document.getElementById('numbers');
const symbolsCb = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const strengthContainer = document.querySelector('.strength-container');
const body = document.querySelector('body');

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

// Update length slider value dynamically with bounce animation
lengthSlider.addEventListener('input', (e) => {
    lengthVal.textContent = e.target.value;
    lengthVal.style.transform = 'scale(1.4)';
    lengthVal.style.textShadow = '0 0 20px var(--primary)';
    setTimeout(() => {
        lengthVal.style.transform = 'scale(1)';
        lengthVal.style.textShadow = '0 0 10px var(--primary-glow)';
    }, 150);
});

// Calculate password strength
function calcStrength(password, length) {
    let strength = 0;
    let typesCount = 0;
    
    if (uppercaseCb.checked) typesCount++;
    if (lowercaseCb.checked) typesCount++;
    if (numbersCb.checked) typesCount++;
    if (symbolsCb.checked) typesCount++;

    if (length <= 8) {
        strength = 1;
    } else if (length > 8 && length <= 12) {
        strength = typesCount > 2 ? 2 : 1;
    } else if (length > 12 && length <= 16) {
        strength = typesCount > 2 ? 3 : 2;
    } else if (length > 16) {
        strength = typesCount === 4 ? 4 : 3;
    }

    if (typesCount === 1 && length > 8) {
        strength = 1; 
    }

    // Apply to DOM
    strengthContainer.setAttribute('data-strength', strength);
}

// Hacker-style Scramble Text Animation
function scrambleText(finalText) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let iterations = 0;
    const maxIterations = 20;
    const intervalTime = 25;
    
    passwordDisplay.classList.add('scrambling');
    
    // Clear previous interval if rapidly clicked
    if(passwordDisplay.scrambleInterval) {
        clearInterval(passwordDisplay.scrambleInterval);
    }
    
    passwordDisplay.scrambleInterval = setInterval(() => {
        let tempText = '';
        for (let i = 0; i < finalText.length; i++) {
            if (i < iterations / (maxIterations / finalText.length)) {
                tempText += finalText[i];
            } else {
                tempText += characters[Math.floor(Math.random() * characters.length)];
            }
        }
        
        passwordDisplay.textContent = tempText;
        iterations++;
        
        if (iterations >= maxIterations) {
            clearInterval(passwordDisplay.scrambleInterval);
            passwordDisplay.textContent = finalText;
            passwordDisplay.classList.remove('scrambling');
        }
    }, intervalTime);
}

function generatePassword() {
    let nameStr = userNameInput ? userNameInput.value.trim() : '';
    let dobStr = userDobInput ? userDobInput.value : '';

    if (dobStr) {
        let dParts = dobStr.split('-');
        if (dParts.length === 3) {
            // DDMMYY format for a compact aesthetic password mix
            dobStr = dParts[2] + dParts[1] + dParts[0].substring(2); 
        }
    }
    
    if (uppercaseCb.checked && nameStr.length > 0) {
        nameStr = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
    }

    let requiredBaseLength = nameStr.length + dobStr.length;
    let length = +lengthSlider.value;
    
    if (requiredBaseLength > length) {
        let newLength = requiredBaseLength + 4;
        if (newLength > +lengthSlider.max) {
            lengthSlider.max = newLength;
        }
        lengthSlider.value = newLength;
        length = newLength;
        lengthVal.textContent = length;
    }

    let charsToGenerate = length - requiredBaseLength;
    let characters = '';
    let randomPasswordPart = '';

    if (uppercaseCb.checked) characters += UPPERCASE_CHARS;
    if (lowercaseCb.checked) characters += LOWERCASE_CHARS;
    if (numbersCb.checked) characters += NUMBER_CHARS;
    if (symbolsCb.checked) characters += SYMBOL_CHARS;

    if (characters.length === 0 && charsToGenerate > 0) {
        passwordDisplay.textContent = 'Select options!';
        passwordDisplay.classList.add('placeholder');
        strengthContainer.setAttribute('data-strength', '0');
        return;
    }

    if (charsToGenerate > 0 && characters.length > 0) {
        let typesAdded = 0;
        if (uppercaseCb.checked && charsToGenerate > typesAdded) { randomPasswordPart += UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)]; typesAdded++; }
        if (lowercaseCb.checked && charsToGenerate > typesAdded) { randomPasswordPart += LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)]; typesAdded++; }
        if (numbersCb.checked && charsToGenerate > typesAdded) { randomPasswordPart += NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]; typesAdded++; }
        if (symbolsCb.checked && charsToGenerate > typesAdded) { randomPasswordPart += SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)]; typesAdded++; }

        for (let i = typesAdded; i < charsToGenerate; i++) {
            randomPasswordPart += characters[Math.floor(Math.random() * characters.length)];
        }

        randomPasswordPart = randomPasswordPart.split('').sort(() => Math.random() - 0.5).join('');
    }

    let chunks = [];
    if (nameStr) chunks.push(nameStr);
    if (dobStr) chunks.push(dobStr);
    
    if (randomPasswordPart) {
        if (chunks.length > 0) {
            let mid = Math.floor(randomPasswordPart.length / 2);
            let r1 = randomPasswordPart.substring(0, mid);
            let r2 = randomPasswordPart.substring(mid);
            if (r1) chunks.push(r1);
            if (r2) chunks.push(r2);
        } else {
            chunks.push(randomPasswordPart);
        }
    }

    let password = chunks.sort(() => Math.random() - 0.5).join('');

    if (!password) password = "Password123!";

    passwordDisplay.classList.remove('placeholder');
    
    scrambleText(password);
    
    calcStrength(password, length);
    
    const hue1 = Math.floor(Math.random() * 60 + 160);
    const hue2 = Math.floor(Math.random() * 60 + 260);
    document.documentElement.style.setProperty('--primary', `hsl(${hue1}, 100%, 50%)`);
    document.documentElement.style.setProperty('--primary-glow', `hsla(${hue1}, 100%, 50%, 0.6)`);
    document.documentElement.style.setProperty('--accent', `hsl(${hue2}, 100%, 60%)`);
}

copyBtn.addEventListener('click', () => {
    if (!passwordDisplay.classList.contains('placeholder') && passwordDisplay.textContent !== 'Select options!') {
        navigator.clipboard.writeText(passwordDisplay.textContent);
        
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        copyBtn.classList.add('copied');
        
        // Satisfying pop effect
        copyBtn.style.transform = 'scale(1.3) rotate(10deg)';
        setTimeout(() => {
            copyBtn.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            copyBtn.classList.remove('copied');
        }, 2000);
    }
});

// Interactive hover effect for checkboxes
const checkboxes = document.querySelectorAll('.custom-checkbox input');
checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        if (cb.checked) {
            // Little zoom on checking
            cb.parentElement.style.transform = 'scale(1.05) translateX(5px)';
            setTimeout(() => { cb.parentElement.style.transform = 'scale(1) translateX(0)'; }, 200);
        }
    });
});

generateBtn.addEventListener('click', () => {
    // Generate bouncy animation
    generateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        generateBtn.style.transform = 'scale(1)';
    }, 150);
    generatePassword();
});

// Generate initial password on load dynamically
setTimeout(generatePassword, 500);
