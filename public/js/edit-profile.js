const token = localStorage.getItem('token');
if (!token) {
  location.href = 'login.html';
}
let selectedAvatarFile = null;

document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/profile/me', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      document.getElementById('name').value = data.name || '';
      document.getElementById('login').value = data.username || '';
      document.getElementById('email').value = data.email || '';
      document.getElementById('bio').value = data.bio || '';
      if (data.dob) {
        document.getElementById('dob').value = data.dob.split('T')[0];
      }
      if (data.createdAt) {
        const d = new Date(data.createdAt);
        document.getElementById('createdAt').value = d.toLocaleDateString('ru-RU', {
          day:   '2-digit',
          month: '2-digit',
          year:  'numeric'
        });
      }
      if (data.avatar) {
        document.getElementById('avatarPreview').src = data.avatar;
      }
    })
    .catch(() => {
      alert('Не удалось загрузить данные профиля.');
    });

  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarInput     = document.getElementById('avatarInput');
  changeAvatarBtn.addEventListener('click', e => {
    e.preventDefault();
    avatarInput.click();
  });
  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (file) {
      selectedAvatarFile = file;
      const reader = new FileReader();
      reader.onload = ev => {
        document.getElementById('avatarPreview').src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('deleteAccountBtn').addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Вы уверены? Действие не отменить.')) {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    }
  });

  const pwdForm = document.getElementById('passwordForm');
  if (pwdForm) {
    const newPass     = document.getElementById('newPassword');
    const confirmPass = document.getElementById('confirmPassword');

    confirmPass.addEventListener('input', () => {
      if (newPass.value !== confirmPass.value) {
        confirmPass.setCustomValidity('Пароли не совпадают');
      } else {
        confirmPass.setCustomValidity('');
      }
    });

    pwdForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Пароль изменён');
      pwdForm.reset();
    });
  }

  document.getElementById('editProfileForm').addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name',  document.getElementById('name').value);
    formData.append('bio',   document.getElementById('bio').value);
    formData.append('dob',   document.getElementById('dob').value);
    formData.append('email', document.getElementById('email').value);
    if (selectedAvatarFile) {
      formData.append('avatar', selectedAvatarFile);
    }

    fetch('/api/profile/me', {
      method:  'PUT',
      headers: { 'Authorization': 'Bearer ' + token },
      body:    formData
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        alert('Данные профиля успешно сохранены');
        location.reload();
      })
      .catch(() => {
        alert('Не удалось сохранить изменения');
      });
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    window.location.href = 'profile.html';
  });
});
