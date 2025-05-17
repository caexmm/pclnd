document.querySelector('.auth-form').addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Заполните все поля');
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Ошибка входа');
    localStorage.setItem('token', json.token);
    window.location.href = 'profile.html';
  } catch (err) {
    alert(err.message);
  }
});
