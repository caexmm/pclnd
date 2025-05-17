document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn   = document.getElementById('burgerBtn');
  const navContainer = document.getElementById('navContainer');
  const overlay     = document.getElementById('overlay');

  if (burgerBtn && navContainer && overlay) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
      navContainer.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
    });
    overlay.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      navContainer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    navContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('active');
        navContainer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  const token     = localStorage.getItem('token');
  const authLinks = navContainer.querySelector('.auth-links');
  const userLinks = navContainer.querySelector('.user-links');

  if (token) {
    authLinks.style.display = 'none';
    userLinks.style.display = 'flex';

    fetch('/api/profile/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        document.getElementById('nav-username').textContent = data.username;
      })
      .catch(err => {
        console.error('Не удалось получить профиль:', err);
      });

    document.getElementById('logout-btn').addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.reload();
    });
  } else {
    authLinks.style.display = 'flex';
    userLinks.style.display = 'none';
  }
});
