document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('editModal');
    const closeModal = document.querySelector('.modal-close');
    const cancelBtn = document.querySelector('.btn-cancel');
    const editForm = document.querySelector('.edit-form');

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postItem = this.closest('.post-item');
            const postTitle = postItem.querySelector('.post-title').textContent;
            const postDescription = postItem.querySelector('.post-description').textContent;
            const postCategory = postItem.querySelector('.post-category').textContent;

            document.getElementById('edit-title').value = postTitle;
            document.getElementById('edit-description').value = postDescription;
            document.getElementById('edit-category').value = postCategory.toLowerCase();

            modal.style.display = 'flex';
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите удалить этот пост?')) {
                const postItem = this.closest('.post-item');
                postItem.style.opacity = '0';
                postItem.style.transition = 'opacity 0.3s';

                setTimeout(() => {
                    postItem.remove();
                }, 300);
            }
        });
    });

    function closeEditModal() {
        modal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEditModal();
        }
    });

    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newTitle = document.getElementById('edit-title').value;
        const newDescription = document.getElementById('edit-description').value;
        const newCategory = document.getElementById('edit-category').value;

        console.log('Сохранение изменений:', {
            title: newTitle,
            description: newDescription,
            category: newCategory
        });

        closeEditModal();
        
        alert('Изменения сохранены (заглушка)');
    });
});
