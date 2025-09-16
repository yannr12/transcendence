(function() {
  const usernameGuest = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if (usernameGuest && token) {
    call_page('registered_user');
    return;
  }

  const welcomeMsg = document.getElementById('welcome-msg');
  if (welcomeMsg) {
    welcomeMsg.textContent = `Welcome to Solar Transcendence, Guest!`;
  }
  
})();
