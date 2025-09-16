export function checkAuthAndRedirect(): boolean {
  const usernameUtils = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const guestUsername = localStorage.getItem('guestUsername');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  if ((isGuest && guestUsername) || (usernameUtils && token)) {
    window.location.href = '/dashboard';
    return true;
  }
  return false;
}

export function showError(containerId: string, message: string, parentElement: HTMLElement): void {
  let errorContainer = document.getElementById(containerId);
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.id = containerId;
    errorContainer.className = 'text-red-600 text-sm mb-2';
    parentElement.prepend(errorContainer);
  }
  errorContainer.textContent = message;
}

export function clearError(containerId: string): void {
  const errorContainer = document.getElementById(containerId);
  if (errorContainer) {
    errorContainer.textContent = '';
  }
}

export function showFieldError(inputElement: HTMLElement, message: string, errorId: string = 'field-error'): void {
  const existingError = document.getElementById(errorId);
  if (existingError) existingError.remove();

  const error = document.createElement('p');
  error.id = errorId;
  error.textContent = message;
  error.className = 'text-red-600 text-sm mt-1';
  inputElement.parentElement?.insertBefore(error, inputElement.nextSibling);
}

export function showPopup(title: string, message: string, onOk?: () => void): void {
  const popup = document.createElement('div');
  popup.className = 'fixed inset-0 flex items-center justify-center z-50';
  popup.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center border border-gray-300">
      <h3 class="text-lg font-semibold mb-2 text-[#112550]">${title}</h3>
      <p class="mb-4 text-gray-700">${message}</p>
      <button id="popup-ok-btn" class="bg-[#5a7fa6] hover:bg-[#6b93be] text-white px-4 py-2 rounded-lg font-semibold transition-colors">OK</button>
    </div>
    <div class="fixed inset-0 bg-black opacity-30"></div>
  `;
  document.body.appendChild(popup);

  const okBtn = document.getElementById('popup-ok-btn');
  if (okBtn) {
    okBtn.addEventListener('click', () => {
      popup.remove();
      onOk?.();
    });
  }
}

export const validators = {
  username: (username: string) => /^[a-zA-Z0-9_]{3,20}$/.test(username),
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  password: (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password),
  verificationCode: (code: string) => /^\d{6}$/.test(code)
};
