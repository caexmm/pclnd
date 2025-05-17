document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email    = document.getElementById('reg-email').value.trim();
  const username = document.getElementById('reg-login').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;

  if (!email || !username || !password || !confirm) {
    alert('Заполните все поля');
    return;
  }
  if (password !== confirm) {
    alert('Пароли не совпадают!');
    return;
  }

  const data = { username, email, password };

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Ошибка при регистрации');
    alert('Успешно зарегистрированы! Пожалуйста, войдите.');
    window.location.href = 'login.html';
  } catch (err) {
    alert(err.message);
  }
});
