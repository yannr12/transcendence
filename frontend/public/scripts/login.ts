(function() {
  const usernameLogin = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if ((usernameLogin && token)) {
    call_page('registered_user');
    return;
  }
  
  const form = document.getElementById('login-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const usernameInput = form.elements.namedItem('username') as HTMLInputElement | null;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement | null;
    const identifier = usernameInput?.value.trim() || '';
    const password = passwordInput?.value || '';

    const errorContainerId = 'login-error-message';
    let errorContainer = document.getElementById(errorContainerId);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!identifier || !password) {
      if (errorContainer)
        errorContainer.textContent = 'Please enter your username/email and password.';
      return;
    } else if (errorContainer) {
      errorContainer.textContent = '';
    }

    if (!(emailRegex.test(identifier) || usernameRegex.test(identifier))) {
      if (errorContainer)
        errorContainer.textContent = 'Invalid username or email format.';
      return;
    }
    if (!passwordRegex.test(password)) {
      if (errorContainer)
        errorContainer.textContent = 'Password must contain uppercase, lowercase and numbers.';
      return;
    }

    try {
      const response = await fetch('/authentification/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
      }
      
      if (response.ok) {
        if (data.requires2FA) {
          localStorage.setItem('partialToken', data.partialToken);
          localStorage.setItem('tempUsername', data.username);
          show2FAVerification();
        }
        else {
          localStorage.setItem('username', data.username || identifier);
          if (data.token)
            localStorage.setItem('token', data.token);
          call_page('registered_user');
        }
      }
      else {
        if (errorContainer)
          errorContainer.textContent = data.error || data.message || 'Login or password incorrect.';
      }
    }
    catch (err) {
      if (errorContainer)
        errorContainer.textContent = 'Error connecting to server.';
    }
  });
})();

function show2FAVerification(): void {
  const form = document.getElementById('login-form') as HTMLFormElement;
  
  const existingError = document.getElementById('login-error-message');
  if (existingError) {
    existingError.remove();
  }
  
  form.innerHTML = `
    <h2 class="text-3xl font-bold text-center text-[#112550] mb-4">
      Two-Factor Authentication
    </h2>
    <p class="text-center text-gray-600 mb-4">
      We've sent a verification code to your email. Please enter it below.
    </p>
    <div class="space-y-4">
      <input
        type="text"
        id="verification-code"
        placeholder="Enter 6-digit code"
        maxlength="6"
        class="w-full p-2 border border-[#597086] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#264e77] text-[#1a2f44] bg-white/90 placeholder-gray-500"
      />
      <button
        onclick="verify2FACode()"
        class="w-full py-3 mt-2 bg-[#5a7fa6] hover:bg-[#6b93be] text-white rounded-lg text-lg font-semibold transition-colors shadow"
      >
        Verify Code
      </button>
      <button
        onclick="resend2FACode()"
        class="w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Resend Code
      </button>
    </div>
    <div class="text-center mt-4">
      <a href="login" class="text-[#264e77] hover:underline">
        Back to Login
      </a>
    </div>
  `;
}

(window as any).verify2FACode = async function(): Promise<void> {
  const codeInput = document.getElementById('verification-code') as HTMLInputElement;
  const code = codeInput.value.trim();
  const partialToken = localStorage.getItem('partialToken');

  let errorMsg = document.getElementById('code-error');
  if (errorMsg) errorMsg.remove();

  if (!code || code.length !== 6) {
    const codeInputParent = codeInput.parentElement;
    if (codeInputParent) {
      const error = document.createElement('p');
      error.id = 'code-error';
      error.textContent = 'Please enter a valid 6-digit code.';
      error.className = 'text-red-600 text-sm mt-1';
      codeInputParent.insertBefore(error, codeInput.nextSibling);
    }
    return;
  }

  if (!partialToken) {
    let popup = document.createElement('div');
    popup.className = 'fixed inset-0 flex items-center justify-center z-50';
    popup.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center border border-gray-300">
        <h3 class="text-lg font-semibold mb-2 text-[#112550]">Session Expired</h3>
        <p class="mb-4 text-gray-700">Verification session expired. Please login again.</p>
        <button id="popup-ok-btn" class="bg-[#5a7fa6] hover:bg-[#6b93be] text-white px-4 py-2 rounded-lg font-semibold transition-colors">OK</button>
      </div>
      <div class="fixed inset-0 bg-black opacity-30"></div>
    `;
    document.body.appendChild(popup);

    const okBtn = document.getElementById('popup-ok-btn');
    if (okBtn) {
      okBtn.addEventListener('click', () => {
        popup.remove();
        call_page('login');
      });
    }
    return;
  }

  try {
    const response = await fetch('/authentification/verify-login-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partialToken, code })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem("partialToken");
      const usernameLogin2 = localStorage.getItem("tempUsername");
      localStorage.removeItem("tempUsername");

      localStorage.setItem("username", data.username || usernameLogin2);
      localStorage.setItem("token", data.token);

      call_page('registered_user');
    }
    else
    {
      let errorMsg = document.getElementById("code-error");
      if (!errorMsg) {
      const codeInput = document.getElementById("verification-code");
      if (codeInput && codeInput.parentElement) {
        errorMsg = document.createElement("p");
        errorMsg.id = "code-error";
        errorMsg.className = "text-red-600 text-sm mt-1";
        codeInput.parentElement.insertBefore(errorMsg, codeInput.nextSibling);
      }
      }
      if (errorMsg)
      errorMsg.textContent = data.error || "Invalid verification code.";
    }
  }
  catch (err) {
    console.log('Error verifying code.');
  }
};

(window as any).resend2FACode = async function(): Promise<void> {
  const partialToken = localStorage.getItem('partialToken');

  if (!partialToken) {
    console.log('Verification session expired. Please login again.');
    call_page('login');
    return;
  }

  console.log('Please login again to receive a new code.');
  localStorage.removeItem('partialToken');
  localStorage.removeItem('tempUsername');
  call_page('login');
};
