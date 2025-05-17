const token = localStorage.getItem('token');
if (!token) location.href = 'login.html';

const posts = {
    1: {
        id: 1,
        title: "Закат в горах",
        description: "Прекрасный вид на горы во время заката. Снято в Альпах во время моего путешествия. Это был незабываемый момент, когда солнце окрасило вершины в золотистые тона.",
        image: "img/post1.png",
        author: "Иван Петров",
        date: "15 мая 2023",
        category: "Пейзажи",
        likes: 124
    },
    2: {
        id: 2,
        title: "Мой котенок",
        description: "Мой любимый кот Барсик. Ему уже 2 года, но он ведет себя как маленький котенок. Любит играть с мячиком и спать на моей клавиатуре.",
        image: "img/post2.jpg",
        author: "Анна Смирнова",
        date: "10 мая 2023",
        category: "Животные",
        likes: 89
    },
    3: {
        id: 3,
        title: "Ночной город",
        description: "Ночная панорама города с высоты птичьего полета. Снято на профессиональную камеру с длинной выдержкой.",
        image: "img/post3.jpg",
        author: "Алексей Иванов",
        date: "5 мая 2023",
        category: "Город",
        likes: 76
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId && posts[postId]) {
        const post = posts[postId];
        
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-description').textContent = post.description;
        document.getElementById('post-image').src = post.image;
        document.getElementById('post-image').alt = post.title;
        document.getElementById('post-author').textContent = `Автор: ${post.author}`;
        document.getElementById('post-date').textContent = `Опубликовано: ${post.date}`;
        document.getElementById('post-category').textContent = `Категория: ${post.category}`;
    } else {
        document.querySelector('.post-container').innerHTML = `
            <div class="error-message">
                <h2>Пост не найден</h2>
                <p>Запрошенный пост не существует или был удален.</p>
                <a href="index.html" class="btn btn-green">Вернуться на главную</a>
            </div>
        `;
    }
});