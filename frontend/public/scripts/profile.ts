(async function() {
  const token = localStorage.getItem('token');
    
    if (!token) {
        call_page('login');
        return;
    }

  const avatarUploadInput = document.getElementById('avatarUpload') as HTMLInputElement;
  const avatarPreview = document.getElementById('avatarPreview') as HTMLImageElement;

  const response = await fetch('/user/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`} });
  const data = await response.json();
  if (response.ok) {
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);}
        
  const username = localStorage.getItem('username');
  if (!username) return;
  const responseavatar = await fetch(`/account/avatar/${encodeURIComponent(username)}`, {
    method: 'GET'
  });
  if (!responseavatar.ok) {
    throw new Error('Avatar not found');
  }
  const blob = await responseavatar.blob();
  const imageUrl = URL.createObjectURL(blob);
  avatarPreview.src = imageUrl;
  
  let age = -1;
  try {
    const res = await fetch('/account/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
  })
  const data = await res.json();
  age = data.succes ? data.age : 0;
  } catch(err) {
    console.log('Erreur lors de la récupération des données utilisateur');
  }
  const email = localStorage.getItem('email');
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const ageInput = document.getElementById('age') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  if (usernameInput && username) usernameInput.placeholder = username;
  if (ageInput && age != -1) ageInput.placeholder = age.toString();
  if (emailInput && email) emailInput.placeholder = email;

  const avatarFile = avatarUploadInput.files ? avatarUploadInput.files[0] : null;
  const errorContainerId = 'file-too-large';
  let errorContainer = document.getElementById(errorContainerId);

  avatarUploadInput.addEventListener('change', function() {
      if (this.files && this.files[0]) { //
        const file = this.files[0]; //
      if (file.size > 1024 * 1024 && errorContainer) {
          errorContainer.textContent = "Le fichier est trop volumineux (> 1 Mo).";
          return;
      }
      const reader = new FileReader()
      reader.onload = function(e) {
        if (avatarPreview && e.target && typeof e.target.result === 'string') {
          avatarPreview.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
      const formData = new FormData(); 
      formData.append('username', sanitizeInput(username));
      formData.append('avatar', file);

      fetch('/account/upload-avatar', { 
          method: 'POST', 
          body: formData 
      })
      .then(res => res.json())
      .then(data => {
          console.log('Reponse backend upload-avatar:', data); 
          if (data.succes && data.avatarUrl) { 
              call_page("registered_user");
          } else {
              console.log(data.message || 'Erreur lors de l\'upload de l\'avatar.'); 
          }
      })
      .catch(err => {
          console.error('Erreur upload-avatar', err);
      }); //
      }
  });

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (e: Event) => {
        const newUsername = sanitizeInput(usernameInput.value);
        const newAge = sanitizeInput(ageInput.value);
        const newEmail = sanitizeInput(emailInput.value);
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        const newPassword = passwordInputs[0] instanceof HTMLInputElement ? sanitizeInput(passwordInputs[0].value) : '';
        const repeatPassword = passwordInputs[1] instanceof HTMLInputElement ? sanitizeInput(passwordInputs[1].value) : '';
        e.preventDefault();
        // Sanitize all user inputs
        let usernameUpdateSuccess = false;
        let authUpdateSuccess = false;
        let usernameUpdateMessage = '';
        let authUpdateMessage = '';

        // Update account info
        await fetch('/account/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: sanitizeInput(username),
            newusername: newUsername,
            age: newAge,
            avatarFile: avatarFile
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log('Reponse backend:', data);
          usernameUpdateSuccess = !!data.succes;
          usernameUpdateMessage = data.message || '';
        })
        .catch(err => {
          console.log('Erreur lors de la sauvegarde');
        });
        await fetch('/authentification/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: sanitizeInput(username),
            newusername: newUsername,
            email: newEmail,
            password: newPassword
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log('Reponse backend:', data);
          authUpdateSuccess = !!data.succes;
          authUpdateMessage = data.message || '';
        })
        .catch(err => {
          console.log('Erreur lors de la sauvegarde');
        });
        // Mise à jour et redirection seulement si tout est OK
        if (username !== newUsername && newUsername && usernameUpdateSuccess && authUpdateSuccess) {
          localStorage.setItem("username", newUsername);
        } else if (usernameUpdateSuccess && authUpdateSuccess) {
          return goBack("registered_user");
        } else {
          // Afficher une erreur ou ne pas rediriger
          if (errorContainer) {
            if (usernameUpdateMessage) {
              errorContainer.textContent = usernameUpdateMessage;
            } else if (authUpdateMessage) {
              errorContainer.textContent = authUpdateMessage;
            }
          }
          console.log("La mise à jour a échoué.");
        }
		goBack("registered_user");
    });
  };

  function sanitizeInput(input: string): string {
    // Remove leading/trailing spaces and escape special HTML chars
    return input.replace(/[<>&"'`]/g, c => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;', '`': '&#96;'
    }[c] || c)).trim();
  }
})();