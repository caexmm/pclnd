document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const avatarEl   = document.getElementById('profileAvatar');
  const nameEl     = document.getElementById('profileName');
  const userEl     = document.getElementById('profileUsername');
  const emailEl    = document.getElementById('profileEmail');
  const bioEl      = document.getElementById('profileBio');
  const dobEl      = document.getElementById('profileDob');
  const joinedEl   = document.getElementById('profileJoined');
  const postsEl    = document.getElementById('userPosts');

  try {
    const res = await fetch('/api/profile/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Не удалось загрузить профиль');
    const data = await res.json();

    avatarEl.src   = data.avatar   || 'img/default-avatar.png';
    nameEl.textContent   = data.name     || data.username;
    userEl.textContent   = data.username;
    emailEl.textContent  = data.email    ? `Почта: ${data.email}` : '';
    bioEl.textContent    = data.bio      ? `Обо мне: ${data.bio}` : '';
    if (data.dob) {
      const d = new Date(data.dob);
      dobEl.textContent   = `Дата рождения: ${d.toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      })}`;
    }
    if (data.createdAt) {
      const d = new Date(data.createdAt);
      joinedEl.textContent = `Зарегистрирован: ${d.toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      })}`;
    }

    const postsRes = await fetch('/api/profile/me/posts', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (postsRes.ok) {
      const posts = await postsRes.json();
      postsEl.innerHTML = posts.map(p => `
        <div class="post-preview">
          <h4>${p.title}</h4>
          <img src="${p.filename}" alt="${p.title}" />
        </div>
      `).join('');
    }

  } catch (err) {
    alert(err.message);
  }
});
