const fetchData = function() {fetch('http://localhost:3000/colorado14ers')
    .then(response => response.json())
    .then(fetchedData => {
        data = fetchedData;
        populateTable(data);
    });
}

fetchData();

//Declare global variables
const infoTable = document.getElementById('infoTable');
const tableBody = document.createElement('tbody');
let currentPopupContainer = null;

//Populate table with JSON data
const populateTable = function(data) {
    while (tableBody.firstChild) {
        tableBody.firstChild.remove();
    }

    data.forEach((peak) => {
        const row = document.createElement('tr');

        const elevationRankCell = document.createElement('td');
        elevationRankCell.textContent = peak.elevationRank;
        row.appendChild(elevationRankCell);

        const nameCell = document.createElement('td');
        const link = document.createElement('a');
        link.textContent = peak.name;
        link.href = "#";

        //Event listener shows photo of peak when name is clicked
        link.addEventListener('click', function(event){
            event.preventDefault();
            openPopupPhoto(peak.imgUrl, peak.name);
        });
        nameCell.appendChild(link);
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

//Function to open popup image of each peak
const openPopupPhoto = function(imgUrl, peakName){
    if (currentPopupContainer){
        closePopupPhoto();
    }

    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popupContainer')

    const popupContent = document.createElement('div');
    popupContent.classList.add('popupContent');

    const closeButton = document.createElement('span');
    closeButton.textContent = '✖';
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

//Function to close popup image of each peak
const closePopupPhoto = function(){
    const popupContainer = document.querySelector('.popupContainer');
    popupContainer.remove();
    currentPopupContainer = null;
};

const sortSelect = document.getElementById('sortSelect');

const tableSorter = function(){
    const sortBy = sortSelect.value;

    if (sortBy === "elevationDescending") {
        data.sort((a, b) => parseInt(b.elevation.replace(/,/g, "")) - parseInt(a.elevation.replace(/,/, "")));
    } else if (sortBy === "elevationAscending") {
        data.sort((a, b) => parseInt(a.elevation.replace(/,/g, "")) - parseInt(b.elevation.replace(/,/g, "")));
    }

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

const tableSearch = function() {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.toLowerCase();
    
    const filteredData = data.filter((peak) => {
        const match = peak.name.toLowerCase().includes(searchQuery);
        return match;
    });
    populateTable(filteredData);
};

searchInput.addEventListener('input', tableSearch);
sortSelect.addEventListener('change', tableSorter);