document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');
    const apiKey = 'uCkpPI7ACpvbtuSYz6bpaDNNT82cJbDG'; 
    const apiUrlBase = `https://api.nytimes.com/svc/topstories/v2/`;

    const categories = {
        home: `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=uCkpPI7ACpvbtuSYz6bpaDNNT82cJbDG`,
        world: `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=uCkpPI7ACpvbtuSYz6bpaDNNT82cJbDG`,
        arts: `https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=uCkpPI7ACpvbtuSYz6bpaDNNT82cJbDG`,
        science: `https://api.nytimes.com/svc/topstories/v2/science.json?api-key=uCkpPI7ACpvbtuSYz6bpaDNNT82cJbDG`,
        us: `https://api.nytimes.com/svc/topstories/v2/us.json?api-key=uCkpPI7ACpvbtuSYz6bpaDNNT82cJbDG`
    };

    function displayArticles(stories) {
        articlesContainer.innerHTML = '';
        stories.forEach((story) => {
            const articleElement = document.createElement('article');
    
            const imgUrl = story.multimedia && story.multimedia.length > 0 ? story.multimedia[0].url : 'https://via.placeholder.com/300x200'; 
    
            const img = document.createElement('img');
            img.src = imgUrl; 
    
            const title = document.createElement('h1');
            title.innerText = story.title;
    
            const summary = document.createElement('p');
            summary.innerText = story.abstract;
    
            const readMore = document.createElement('button');
            readMore.innerText = 'Read More';
            readMore.classList.add('read-more-btn');
            readMore.addEventListener('click', () => showFullArticle(story));
    
            articleElement.appendChild(img);
            articleElement.appendChild(title);
            articleElement.appendChild(summary);
            articleElement.appendChild(readMore);
    
            articlesContainer.appendChild(articleElement);
        });
    }
    
    function showFullArticle(story) {
        console.log(story);

        const modal = document.getElementById('article-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalImage = document.getElementById('modal-image');
        const modalContent = document.getElementById('modal-content');
    
        modalTitle.innerText = story.title;
    
        const imgUrl = story.multimedia && story.multimedia.length > 0 ? story.multimedia[0].url : '';
        modalImage.src = imgUrl; 
    
        const articleUrl = story.url || story.short_url || ''; 
        modalContent.innerHTML = articleUrl ? `<a href="${articleUrl}" target="_blank">Read Full Article</a>` : 'No content available.';
    
        modal.style.display = 'block';
    }    

    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('article-modal').style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('article-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    async function loadCategoryArticles(category) {
        try {
            const response = await fetch(categories[category]);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            if (data.results.length === 0) {

                document.querySelector(`.nav-links a[href="#${category}"]`).parentElement.remove();
            } else {
                displayArticles(data.results); 
            }
        } catch (error) {
            console.error('Fetching articles failed:', error);
            displayArticles([]);
        }
    }

    document.querySelector('.nav-links').addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            const category = event.target.textContent.toLowerCase(); 
            loadCategoryArticles(category);
        }
    });

    loadCategoryArticles('home'); 
});
