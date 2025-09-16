function toggleEmail2FA(): void {
    const toggle = document.getElementById('email2faToggle') as HTMLInputElement;
    const emailSection = document.getElementById('emailSection') as HTMLElement;
    const statusMessage = document.getElementById('statusMessage') as HTMLElement;
    
    if (toggle.checked) {
        emailSection.classList.remove('hidden');
        statusMessage.classList.add('hidden');
    } else 
    {
        emailSection.classList.add('hidden');
        statusMessage.classList.add('hidden');
        disable2FA();
    }
}

async function confirmEmail(): Promise<void> {
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    const emailSection = document.getElementById('emailSection') as HTMLElement;
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Please enter your email address.', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Authentication required. Please login again.', 'error');
        window.location.href = '/login';
        return;
    }
    
    try {
        const verifyResponse = await fetch('/authentification/verify-email-2fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });
        
        const verifyData = await verifyResponse.json();
        
        if (verifyResponse.ok) {
            const toggleResponse = await fetch('/authentification/toggle-2fa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ enabled: true })
            });
            
            const toggleData = await toggleResponse.json();
            
            if (toggleResponse.ok) {
                showMessage('Email 2FA enabled successfully!', 'success');
                emailInput.value = '';
                
                // showVerificationSection();
                
                // sendVerificationCode();
            } 
            else
                showMessage(toggleData.error || 'Failed to enable 2FA.', 'error');
        } 
        else 
            showMessage(verifyData.error || 'Email verification failed.', 'error');
    }
    catch (err) {
        showMessage('Error connecting to server.', 'error');
    }
}

function showVerificationSection(): void {
    const emailSection = document.getElementById('emailSection') as HTMLElement;
    
    const verificationHtml = `
        <div class="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-700">Test Your 2FA Setup</h4>
            <p class="text-sm text-gray-600">We've sent a verification code to your email. Enter it below to confirm 2FA is working:</p>
            
            <div>
                <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                </label>
                <input 
                    type="text" 
                    id="verificationCode" 
                    placeholder="Enter 6-digit code"
                    maxlength="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#112550] focus:border-transparent text-black"
                >
            </div>
            
            <div class="flex gap-2">
                <button 
                    onclick="verifyCode()" 
                    class="flex-1 bg-[#112550] text-white py-2 px-4 rounded-md hover:bg-[#0f1f42] transition duration-200 font-medium"
                >
                    Verify Code
                </button>
                <button 
                    onclick="sendVerificationCode()" 
                    class="bg-gray-500 text-black py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 font-medium"
                >
                    Resend
                </button>
            </div>
        </div>
    `;
    
    emailSection.innerHTML += verificationHtml;
}

async function sendVerificationCode(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('/authentification/send-2fa-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Verification code sent to your email!', 'success');
        } else {
            showMessage(data.error || 'Failed to send verification code.', 'error');
        }
    } catch (err) {
        showMessage('Error sending verification code.', 'error');
    }
}

async function verifyCode(): Promise<void> {
    const codeInput = document.getElementById('verificationCode') as HTMLInputElement;
    const code = codeInput.value.trim();
    
    if (!code || code.length !== 6) {
        showMessage('Please enter a valid 6-digit code.', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('/authentification/verify-2fa-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('2FA setup completed successfully!', 'success');
            codeInput.value = '';
        } else {
            showMessage(data.error || 'Invalid verification code.', 'error');
        }
    } catch (err) {
        showMessage('Error verifying code.', 'error');
    }
}

async function disable2FA(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('/authentification/toggle-2fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ enabled: false })
        });
        
        if (response.ok) {
            showMessage('Email 2FA disabled.', 'success');
        }
    } catch (err) {
        console.error('Error disabling 2FA:', err);
    }
}

function showMessage(message: string, type: 'success' | 'error'): void {
    const statusMessage = document.getElementById('statusMessage') as HTMLElement;
    statusMessage.textContent = message;
    statusMessage.className = `p-3 rounded-md text-sm ${
        type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
    }`;
    statusMessage.classList.remove('hidden');
}


(function() {
    const token = localStorage.getItem('token');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest || !token) {
        window.location.href = '/login';
        return;
    }
    loadCurrentStatus();
})();

async function loadCurrentStatus(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('/authentification/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const toggle = document.getElementById('email2faToggle') as HTMLInputElement;
            const emailSection = document.getElementById('emailSection') as HTMLElement;
            
            if (data.user.two_fa_enabled) {
                toggle.checked = true;
                toggleEmail2FA();
                showMessage('Email 2FA is currently enabled.', 'success');
            }
        }
    } catch (err) {
        console.error('Error loading 2FA status:', err);
    }
}

(window as any).toggleEmail2FA = toggleEmail2FA;
(window as any).confirmEmail = confirmEmail;
(window as any).verifyCode = verifyCode;
(window as any).sendVerificationCode = sendVerificationCode;
(window as any).verifyCode = verifyCode;
(window as any).sendVerificationCode = sendVerificationCode;
(window as any).loadCurrentStatus = loadCurrentStatus;
