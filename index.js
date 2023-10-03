document.addEventListener("DOMContentLoaded", function(){
    fetch('http://localhost:3000/colorado14ers')
        .then(response => response.json())
        .then(data => {
            //Declare global variables
            const infoTable = document.getElementById('infoTable');
            const tableBody = document.createElement('tbody');
            let currentPopupContainer = null;

            //Function to populate table with JSON data
            const populateTable = function(data) {
                while (tableBody.firstChild) {
                    tableBody.firstChild.remove();
                }

                data.forEach(peak => {
                    const row = document.createElement('tr');

                    const elevationRankCell = document.createElement('td');
                    elevationRankCell.textContent = peak.elevationRank;
                    row.appendChild(elevationRankCell);

                    const nameCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = peak.name;
                    link.href = "#";
            
            //Event listener to show picture of peak when user clicks on name                   
                    link.addEventListener('click', function(event){
                        event.preventDefault();
                        openPopupPhoto(peak.imgUrl);
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

                    const climbedCell = document.createElement('td');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    climbedCell.appendChild(checkbox);
                    row.appendChild(climbedCell);

                    tableBody.appendChild(row)            
                });

                infoTable.appendChild(tableBody);
            };
            populateTable(data);
            
            //Function to open popup of peak photo
            const openPopupPhoto = function(imgUrl){
                if (currentPopupContainer){
                    closePopupPhoto();
                }
                
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

                popupContent.appendChild(closeButton);
                popupContent.appendChild(image);
                popupContainer.appendChild(popupContent);
                document.body.appendChild(popupContainer);

                currentPopupContainer = popupContainer;
            };

            //Function to close popup of peak photo
            const closePopupPhoto = function(){
                const popupContainer = document.querySelector('.popupContainer');
                popupContainer.remove();
                currentPopupContainer = null;
            }
            
            //Event listener for sorting table by dropdown menu selection
            const sortSelect = document.getElementById('sortSelect');
            
            const tableSorter = function(){
                const sortBy = sortSelect.value;

                if (sortBy === "elevationDescending") {
                    data.sort((a, b) => parseInt(b.elevation.replace(/,/g, "")) - parseInt(a.elevation.replace(/,/, "")));
                } else if (sortBy === "elevationAscending") {
                    data.sort((a,b) => parseInt(a.elevation.replace(/,/g, "")) - parseInt(b.elevation.replace(/,/g, "")));
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
            sortSelect.addEventListener('change', tableSorter);

            //Add event listener to create list of climbed mountains
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const climbedPeaksList = document.getElementById('climbedPeaksList');
            climbedPeaksList.classList.add('climbedPeaksList');

            const climbedListCreator = function(){
                const climbedPeaks = [];

                checkboxes.forEach((checkbox, index) => {
                    if (checkbox.checked) {
                        climbedPeaks.push(data[index]);
                    } 
                });
                
                climbedPeaksList.innerText = '';
                
                climbedPeaks.forEach(peak => {
                    const listElement = document.createElement('li');
                    listElement.textContent = peak.name;
                    climbedPeaksList.appendChild(listElement); 
                });
            }
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', climbedListCreator);
            });
        });
});