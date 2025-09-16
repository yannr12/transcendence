(function() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if ((username && token)) {
    call_page('registered_user');
    return;
  }

  const form = document.getElementById('register-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const usernameInput = form.elements.namedItem('username') as HTMLInputElement | null;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement | null;
    const confirmPasswordInput = form.elements.namedItem('confirm_password') as HTMLInputElement | null;
    const username = usernameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const confirmPassword = confirmPasswordInput?.value || '';

    if (!username || !email || !password || !confirmPassword) {
      const errorMsg = document.getElementById('register-error');
      if (errorMsg) {
        errorMsg.textContent = 'Please fill in all fields.';
        errorMsg.style.display = 'block';
      }
      console.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      const errorMsg = document.getElementById('register-error');
      if (errorMsg) {
        errorMsg.textContent = 'Passwords do not match.';
        errorMsg.style.display = 'block';
      }
      console.error('Passwords do not match.');
      return;
    }

    // Frontend validation for username, email, password format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    const errorMsg = document.getElementById('register-error');
    if (!usernameRegex.test(username)) {
      if (errorMsg) {
        errorMsg.textContent = 'Username must be 3-20 characters, letters/numbers/underscores only.';
        errorMsg.style.display = 'block';
      }
      console.error('Username must be 3-20 characters, letters/numbers/underscores only.');
      return;
    }
    if (!emailRegex.test(email)) {
      if (errorMsg) {
        errorMsg.textContent = 'Invalid email address.';
        errorMsg.style.display = 'block';
      }
      console.error('Invalid email address.');
      return;
    }
    if (!passwordRegex.test(password)) {
      if (errorMsg) {
        errorMsg.textContent = 'Password must contain uppercase, lowercase and numbers.';
        errorMsg.style.display = 'block';
      }
      console.error('Password must contain uppercase, lowercase and numbers.');
      return;
    }

    try {
      const response = await fetch('/authentification/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('username', data.username || username);
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        call_page('registered_user');
      } else {
        // Show backend error message
        if (errorMsg) {
          errorMsg.textContent = data.error || data.message || 'Inscription échouée.';
          errorMsg.style.display = 'block';
        }
        console.error(data.error || data.message || 'Inscription échouée.');
      }
    } catch (err) {
      if (errorMsg) {
        errorMsg.textContent = 'Erreur de connexion au serveur.';
        errorMsg.style.display = 'block';
      }
      console.error('Erreur de connexion au serveur.', err);
    }
  });
})();
