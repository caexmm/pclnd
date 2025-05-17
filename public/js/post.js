const token = localStorage.getItem('token');
if (!token) location.href = 'login.html';

document.addEventListener('DOMContentLoaded', function() {
    const shareBtn = document.getElementById('shareBtn');
    const shareLinkContainer = document.getElementById('shareLinkContainer');
    const copyBtn = document.getElementById('copyBtn');
    const postLink = document.getElementById('postLink');

    shareBtn.addEventListener('click', function() {
        shareLinkContainer.style.display = shareLinkContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    copyBtn.addEventListener('click', function() {
        postLink.select();
        document.execCommand('copy');

        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Скопировано!';

        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
});
