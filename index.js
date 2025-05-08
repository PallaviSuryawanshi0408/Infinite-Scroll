const quoteContainer = document.getElementById('quote-container');
const loadingIndicator = document.getElementById('loading');
let page = 1;
let isFetching = false;

async function fetchQuotes(page) {
    isFetching = true;
    loadingIndicator.textContent = 'Loading...';
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = await fetch(`https://dummyjson.com/quotes?limit=10&skip=${(page - 1) * 10}`);
        const data = await response.json();

        if (!data.quotes || data.quotes.length === 0) {
            loadingIndicator.textContent = 'No more quotes to load.';
            return [];
        }
        loadingIndicator.textContent = '';
        return data.quotes;
    } catch (error) {
        console.error('Error fetching quotes:', error);
        loadingIndicator.textContent = 'Error fetching quotes.';
        return [];
    } finally {
        isFetching = false;
    }
}

function addQuotesToContainer(quotes) {
    quotes.forEach((quote, index) => {
        const quoteElement = document.createElement('div');
        quoteElement.classList.add('quote');
        quoteElement.innerHTML = `
            ${quote.id}) ${quote.quote}
            <span class="author">— ${quote.author}</span>
        `;
        quoteContainer.appendChild(quoteElement);
    });
}

async function handleScroll() {
    if (isFetching) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + 200) {
        const quotes = await fetchQuotes(page);
        if (quotes.length > 0) {
            addQuotesToContainer(quotes);
            page++;
        }
    }
}

(async function initialLoad() {
    const initialQuotes = await fetchQuotes(page);
    if (initialQuotes.length > 0) {
        addQuotesToContainer(initialQuotes);
        page++;
    }
})();

window.addEventListener('scroll', handleScroll);
