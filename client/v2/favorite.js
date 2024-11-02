document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('favorite.html')) {
        renderFavorites();
    }
});

/**
 * Render favorites
 */
const renderFavorites = () => {
    const favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) {
        console.error('Element with ID favorites-list not found');
        return;
    }
    favoritesList.innerHTML = '';

    if (favoriteDeals.length === 0) {
        favoritesList.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    favoriteDeals.forEach(dealId => {
        // Fetch the deal details from the API or from the currentDeals array
        const deal = currentDeals.find(d => d.uuid === dealId);
        if (deal) {
            const dealElement = document.createElement('div');
            dealElement.className = 'deal';
            dealElement.id = deal.uuid;
            dealElement.innerHTML = `
                <div class="deal-info">
                    <p> &#128338 ${Duration(deal.published)}</p>
                    <button class="favorite-btn" data-id="${deal.uuid}" style="background-image: url('heart.png');"></button>
                </div>
                <div class="deal-image">
                    <img src="${deal.photo}" alt="Deal Image" title="${deal.title}"/>
                </div>
                <div class="deal-title">
                    <a href="${deal.link}" target="_blank">${stringExtract(deal.title)}</a>
                </div>
                <div class="deal-price">
                    <strong style="color: red;">${deal.price}€ </strong>
                    <strike style="color: #706d6d; font-size: 13px">${renderRetail(deal.retail)}</strike>
                    <span>${renderDiscount(deal.discount)}</span>
                </div>
                <div class="deal-description">
                    <span> ${deal.comments} comments </span>
                    <span style="color : ${setColorForTemperature(deal.temperature)}; font-weight: 550;">${deal.temperature}°</span>
                    <button class="modal-btn modal-trigger" data-id="${deal.id}">Sales infos</button>
                </div>
            `;

            // Attach event listener to the "Sales infos" button
            const modalTrigger = dealElement.querySelector('.modal-trigger');
            if (modalTrigger) {
                modalTrigger.addEventListener('click', event => {
                    const dealId = event.target.getAttribute('data-id');
                    toggleModal(dealId);
                });
            }

            favoritesList.appendChild(dealElement);
        }
    });

    // Add event listeners for unfavorite buttons
    document.querySelectorAll('.unfavorite-btn').forEach(button => {
        button.addEventListener('click', event => {
            const dealId = event.target.getAttribute('data-id');
            let favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];

            // Remove from favorites
            favoriteDeals = favoriteDeals.filter(id => id !== dealId);
            localStorage.setItem('favoriteDeals', JSON.stringify(favoriteDeals));

            // Update the favorites list
            renderFavorites();
        });
    });
};

