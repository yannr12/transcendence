document.addEventListener('DOMContentLoaded', () => {
  const usernameRanking = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if ((!usernameRanking || !token)) {
    call_page("index");
    return;
  }
});