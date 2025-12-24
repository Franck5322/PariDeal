
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay')

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


// Toggle menu déroulant
$('.dropdown-btn').click(function () {
    $(this).next('.dropdown-content').slideToggle(200);
});

// Fermer le menu si clic en dehors
$(document).click(function (e) {
    if (!$(e.target).closest('.dropdown-filter').length) {
        $('.dropdown-content').slideUp(200);
    }
});


$(document).ready(function () {
    // Fonction pour filtrer les cartes
    function filterCards() {
        let keyword = $('#mot-cle').val().toLowerCase();

        // Récupérer les catégories cochées
        let selectedCategories = [];
        $('.filter-activity:checked').each(function () {
            selectedCategories.push($(this).val());
        });

        // Parcourir toutes les cartes
        $('.container .card').each(function () {
            let title = $(this).data('title').toLowerCase();
            let category = $(this).data('category');

            // Vérifie si le mot clé est dans le titre ET si la catégorie est sélectionnée
            if (title.includes(keyword) && selectedCategories.includes(category)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Quand on tape dans la barre de recherche
    $('#mot-cle').on('input', filterCards);

    // Quand on change un filtre catégorie
    $('.filter-activity').on('change', filterCards);
});


$('input[name="sort"]').on('change', function () {
    let $container = $('.container');
    let $cards = $container.children('.card');
    let sortType = $(this).val();

    $cards.sort(function (a, b) {
        if (sortType === 'price-desc') {
            return parseFloat($(b).data('price')) - parseFloat($(a).data('price'));
        } else if (sortType === 'price-asc') {
            return parseFloat($(a).data('price')) - parseFloat($(b).data('price'));
        } else if (sortType === 'title-asc') {
            return $(a).data('title').localeCompare($(b).data('title'));
        } else if (sortType === 'title-desc') {
            return $(b).data('title').localeCompare($(a).data('title'));
        }
    });

    $container.append($cards); // réinjecte les cartes triées
});

$(document).ready(function () {
    const url = new URL(window.location.href);
    const keyword = url.searchParams.get('mot');

    if (keyword) {
        // 1️⃣ Appliquer le mot-clé une seule fois
        $('#mot-cle').val(keyword);
        $('#mot-cle').trigger('input');

        // 2️⃣ Nettoyer l’URL (important pour le reload)
        url.searchParams.delete('mot');
        window.history.replaceState({}, document.title, url.pathname);
    } else {
        // 3️⃣ Si reload ou accès direct → reset
        $('#mot-cle').val('');
        $('.card').show();
    }
});




document.addEventListener('DOMContentLoaded', function () {

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
    const btnShowMap = document.getElementById('btn-show-map');

    btnShowMap.addEventListener('click', function () {
        const mapDiv = document.getElementById('map');

        if (mapDiv.style.display === 'block') {
            // Si la carte est visible → on la cache
            mapDiv.style.display = 'none';
        } else {
            // Sinon on affiche la carte
            mapDiv.style.display = 'block';
            createMap();

            const cards = document.querySelectorAll('.card');
            const markers = [];

            cards.forEach(card => {

                const lat = parseFloat(card.dataset.lat);
                const lng = parseFloat(card.dataset.lng);

                if (!isNaN(lat) && !isNaN(lng)) {
                    const titleLink = card.querySelector('.text a');
                    const titleHTML = titleLink ? titleLink.outerHTML : card.dataset.title;

                    const priceDiv = card.querySelector('.new-price');
                    const priceHTML = priceDiv ? priceDiv.innerHTML : '';

                    const category = card.dataset.category;

                    const addressEl = card.querySelector('address');
                    const addressText = addressEl ? addressEl.dataset.address : '';


                    const popupContent = `
                    <div>
                        <div>${titleHTML}</div>
                         <address>${addressText}</address>
                        <div>${category}</div>
                        <div>Prix: ${priceHTML}</div>
                    </div>
                `;

                    const marker = L.marker([lat, lng]).addTo(window.myMap)
                        .bindPopup(popupContent);
                    markers.push(marker);
                }
            });

            if (markers.length > 0) {
                const group = L.featureGroup(markers);
                window.myMap.fitBounds(group.getBounds().pad(0.2));
            }
        }
    });


    // Clic sur une carte individuelle
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function () {
            const mapDiv = document.getElementById('map');
            mapDiv.style.display = 'block';
            createMap();

            const lat = parseFloat(card.dataset.lat);
            const lng = parseFloat(card.dataset.lng);

            // Titre avec lien
            const titleLink = card.querySelector('.text a');
            const titleHTML = titleLink ? titleLink.outerHTML : card.dataset.title;

            // Prix
            const priceDiv = card.querySelector('.new-price');
            const priceHTML = priceDiv ? priceDiv.innerHTML : '';

            const category = card.dataset.category;
            const addressEl = card.querySelector('address');
            const addressText = addressEl ? addressEl.dataset.address : '';

            const popupContent = `
                <div>
                    <div>${titleHTML}</div>
                     <address>${addressText}</address>
                    <div>${category}</div>
                    <div>Prix: ${priceHTML}</div>
                </div>
            `;

            if (window.currentMarker) {
                window.myMap.removeLayer(window.currentMarker);
            }

            window.currentMarker = L.marker([lat, lng]).addTo(window.myMap)
                .bindPopup(popupContent)
                .openPopup();

            window.myMap.setView([lat, lng], 16);
        });
    });

    const cpInput = document.getElementById('code-postal');
    const cards = document.querySelectorAll('.card');

    cpInput.addEventListener('input', function () {
        const cpValue = cpInput.value.trim();

        cards.forEach(card => {
            const cardCP = card.dataset.cp;

            // Si input vide → on montre tout
            if (cpValue === '') {
                card.style.display = 'flex';
            }
            // Sinon, on filtre
            else if (cardCP.startsWith(cpValue)) {
                card.style.display = 'flex';
            }
            else {
                card.style.display = 'none';
            }
        });
    });

});



