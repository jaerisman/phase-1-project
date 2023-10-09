document.addEventListener("DOMContentLoaded", function(){
    fetch('http://localhost:3000/colorado14ers')
        .then(response => response.json())
        .then(data => {
            // Add 'checked' property to each data item
            data.forEach((item) => {
                item.checked = false;
            });

            //Declare global variables
            const infoTable = document.getElementById('infoTable');
            const tableBody = document.createElement('tbody');
            let currentPopupContainer = null;
            let checkboxes = null;

            //Populate table with JSON data
            const populateTable = function(data) {
                while (tableBody.firstChild) {
                    tableBody.firstChild.remove();
                }

                data.forEach((peak, index) => {
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

                    const climbedCell = document.createElement('td');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = peak.checked;
                    climbedCell.appendChild(checkbox);
                    row.appendChild(climbedCell);

                    tableBody.appendChild(row)            
                });

                infoTable.appendChild(tableBody);

                checkboxes = document.querySelectorAll('input[type="checkbox"]');
                const climbedPeaksList = document.getElementById('climbedPeaksList');
                climbedPeaksList.classList.add('climbedPeaksList');

                const climbedListCreator = function(){
                    const climbedPeaks = [];

                    checkboxes.forEach((checkbox, index) => {
                        if (checkbox.checked) {
                            data[index].checked = true;
                            climbedPeaks.push(data[index]);
                        } else {
                            data[index].checked = false;
                        }
                    });

                    climbedPeaksList.innerText = '';

                    climbedPeaks.forEach((peak) => {
                        const listElement = document.createElement('li');
                        listElement.textContent = peak.name;
                        climbedPeaksList.appendChild(listElement); 
                    });
                };

                checkboxes.forEach((checkbox) => {
                    checkbox.addEventListener('change', climbedListCreator);
                });

            };
            populateTable(data); 

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

                checkboxes.forEach((checkbox, index) => {
                    checkbox.checked = data[index].checked;
                });

                populateTable(data); 
            };    
            sortSelect.addEventListener('change', tableSorter);
        });
});