/*************************
 * MENU MOBILE
 *************************/
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    sideMenu.classList.toggle('open');
    overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
    menuBtn.classList.remove('active');
    sideMenu.classList.remove('open');
    overlay.classList.remove('show');
});


/*************************
 * DROPDOWN FILTRES
 *************************/
$('.dropdown-btn').on('click', function (e) {
    e.stopPropagation();
    $(this).next('.dropdown-content').slideToggle(200);
});

$(document).on('click', function (e) {
    if (!$(e.target).closest('.dropdown-filter').length) {
        $('.dropdown-content').slideUp(200);
    }
});


/*************************
 * MAP LEAFLET
 *************************/
window.myMap = null;
window.markers = [];

function createMap() {
    if (!window.myMap) {
        window.myMap = L.map('map').setView([48.8566, 2.3522], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(window.myMap);
    } else {
        window.myMap.invalidateSize();
    }
}

function updateMapMarkers() {
    if (!window.myMap) return;

    // Supprimer anciens markers
    window.markers.forEach(marker => window.myMap.removeLayer(marker));
    window.markers = [];

    const visibleCards = document.querySelectorAll('.card:not([style*="display: none"])');

    visibleCards.forEach(card => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        if (isNaN(lat) || isNaN(lng)) return;

        const titleLink = card.querySelector('.text a');
        const titleHTML = titleLink ? titleLink.outerHTML : card.dataset.title;

        const priceDiv = card.querySelector('.new-price');
        const priceHTML = priceDiv ? priceDiv.innerHTML : '';

        const category = card.dataset.category;
        const address = card.querySelector('address')?.dataset.address || '';

        const popupContent = `
            <div>
                <div>${titleHTML}</div>
                <address>${address}</address>
                <div>${category}</div>
                <div>Tarif : ${priceHTML}</div>
            </div>
        `;

        const marker = L.marker([lat, lng]).addTo(window.myMap)
            .bindPopup(popupContent);

        window.markers.push(marker);
    });

    if (window.markers.length > 0) {
        const group = L.featureGroup(window.markers);
        window.myMap.fitBounds(group.getBounds().pad(0.2));
    }
}


/*************************
 * FILTRES / RECHERCHE
 *************************/
function filterCards() {
    const keyword = $('#mot-cle').val().toLowerCase();
    const cpValue = $('#code-postal').val().trim();

    const selectedCategories = [];
    $('.filter-activity:checked').each(function () {
        selectedCategories.push($(this).val());
    });

    $('.container .card').each(function () {
        const title = $(this).data('title').toLowerCase();
        const categories = this.dataset.category.split(',').map(c => c.trim());
        const cardCP = $(this).data('cp').toString();

        const matchKeyword = title.includes(keyword);
        const matchCategory = selectedCategories.length === 0 ||
            categories.some(cat => selectedCategories.includes(cat));

        const matchCP = cpValue === '' || cardCP.startsWith(cpValue);

        if (matchKeyword && matchCategory && matchCP) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    if (window.updateMapMarkers) updateMapMarkers();
}

// Listeners
$('#mot-cle').on('input', filterCards);
$('.filter-activity').on('change', filterCards);
$('#code-postal').on('input', filterCards);


/*************************
 * TRI
 *************************/
$('input[name="sort"]').on('change', function () {
    const sortType = $(this).val();
    const $container = $('.container');
    const $cards = $container.children('.card');

    $cards.sort(function (a, b) {
        if (sortType === 'price-asc') {
            return $(a).data('price') - $(b).data('price');
        }
        if (sortType === 'price-desc') {
            return $(b).data('price') - $(a).data('price');
        }
        if (sortType === 'title-asc') {
            return $(a).data('title').localeCompare($(b).data('title'));
        }
        if (sortType === 'title-desc') {
            return $(b).data('title').localeCompare($(a).data('title'));
        }
    });

    $container.append($cards);
    updateMapMarkers();
});



/*************************
 * BOUTON AFFICHER LA CARTE
 *************************/
$('#btn-show-map').on('click', function () {
    const mapDiv = $('#map');

    if (mapDiv.is(':visible')) {
        mapDiv.hide();
    } else {
        mapDiv.show();
        createMap();
        updateMapMarkers();
    }
});


/*************************
 * CLIC SUR UNE CARTE
 *************************/
$(document).on('click', '.card', function () {
    const lat = parseFloat(this.dataset.lat);
    const lng = parseFloat(this.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    $('#map').show();
    createMap();
    updateMapMarkers();

    window.myMap.setView([lat, lng], 16);

    const marker = window.markers.find(m => {
        const p = m.getLatLng();
        return p.lat === lat && p.lng === lng;
    });

    if (marker) marker.openPopup();
});


/*************************
 * URL PARAM (mot-clé)
 *************************/
$(document).ready(function () {
    const url = new URL(window.location.href);
    const keyword = url.searchParams.get('mot');

    if (keyword) {
        $('#mot-cle').val(keyword);
        filterCards();
        url.searchParams.delete('mot');
        window.history.replaceState({}, document.title, url.pathname);
    }
});

