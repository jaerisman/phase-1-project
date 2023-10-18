const fetchData = function() {
    fetch('http://localhost:3000/colorado14ers')
    .then(response => response.json())
    .then(fetchedData => {
        data = fetchedData;
        populateTable(data);
    });
};

fetchData();

const infoTable = document.getElementById('infoTable');
const tableBody = document.createElement('tbody');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
let currentPopupContainer = null;

const populateTable = function(data) {
    while (tableBody.firstChild) {
        tableBody.firstChild.remove();
    };

    data.forEach((peak) => {
        const row = document.createElement('tr');

        const elevationRankCell = document.createElement('td');
        elevationRankCell.textContent = peak.elevationRank;
        row.appendChild(elevationRankCell);

        const nameCell = document.createElement('td');
        const nameLink = document.createElement('a');
        nameLink.textContent = peak.name;
        nameLink.href = "#";

        //Event listener shows photo of peak when name is clicked
        nameLink.addEventListener('click', function(event){
            event.preventDefault();
            openPopupPhoto(peak.imgUrl, peak.name);
        });
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        const elevationCell = document.createElement('td');
        elevationCell.textContent = peak.elevation;
        row.appendChild(elevationCell);

        const rangeCell = document.createElement('td');
        rangeCell.textContent = peak.range;
        row.appendChild(rangeCell);

        const townCell = document.createElement('td');
        townCell.textContent = peak.nearestTown;
        row.appendChild(townCell);

        tableBody.appendChild(row)            
    });
    infoTable.appendChild(tableBody);
};

const openPopupPhoto = function(imgUrl, peakName){
    if (currentPopupContainer){
        closePopupPhoto();
    };

    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popupContainer')

    const popupContent = document.createElement('div');
    popupContent.classList.add('popupContent');

    const closeButton = document.createElement('span');
    closeButton.textContent = 'X';
    closeButton.classList.add('closeButton');
    closeButton.addEventListener('click', closePopupPhoto);

    const image = document.createElement('img');
    image.src = imgUrl;
    image.alt = 'Peak Image';

    const caption = document.createElement('p');
    caption.textContent = peakName;
    caption.classList.add('caption');

    const captionContainer = document.createElement('div');
    captionContainer.classList.add('captionContainer');
    captionContainer.appendChild(image);
    captionContainer.appendChild(caption);

    popupContent.appendChild(closeButton);
    popupContent.appendChild(captionContainer);
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);

    currentPopupContainer = popupContainer;
};

const closePopupPhoto = function(){
    const popupContainer = document.querySelector('.popupContainer');
    popupContainer.remove();
    currentPopupContainer = null;
};

const tableSorter = function(){
    const sortBy = sortSelect.value;
    if (sortBy === "elevationDescending") {
        data.sort((a, b) => parseInt(b.elevation.replace(/,/g, "")) - parseInt(a.elevation.replace(/,/, "")));
    } else if (sortBy === "elevationAscending") {
        data.sort((a, b) => parseInt(a.elevation.replace(/,/g, "")) - parseInt(b.elevation.replace(/,/g, "")));
    };

    data.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
            return -1;
        }
        if (a[sortBy] > b[sortBy]) {
            return 1;
        }
        return 0;
    });

    populateTable(data); 
};    

sortSelect.addEventListener('change', tableSorter);

const tableSearch = function() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    
    const filteredData = data.filter((peak) => {
        const match = peak.name.toLowerCase().includes(searchQuery);
        return match;
    });
    populateTable(filteredData);
};

searchInput.addEventListener('input', tableSearch);