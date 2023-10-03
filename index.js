document.addEventListener("DOMContentLoaded", function(){
    fetch('http://localhost:3000/colorado14ers')
        .then(response => response.json())
        .then(data => {
            const infoTable = document.getElementById('infoTable');
            const tableBody = document.createElement('tbody');

            //Create populateData function to populate table with JSON data
            console.log(data)
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
                    nameCell.textContent = peak.name;
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
            
            //Add event listener for sorting table by dropdown menu selection
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
            const climbedListCreator = function(){
                const climbedPeaks = [];

                checkboxes.forEach((checkbox, index) => {
                    if (checkbox.checked) {
                        climbedPeaks.push(data[index]);
                    } 
                });
                
                const climbedPeaksList = document.getElementById('climbedPeaksList');
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