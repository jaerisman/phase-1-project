document.addEventListener("DOMContentLoaded", function(){
    fetch('http://localhost:3000/colorado14ers')
        .then(response => response.json())
        .then(data => {
            //Add data from JSON file to table
            const infoTable = document.getElementById('infoTable');
            const tableBody = document.createElement('tbody');

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
            
            
            //Add event listener for sorting table by dropdown menu selection
            const sortSelect = document.getElementById('sortSelect');
            sortSelect.addEventListener('change', function(){
                const sortBy = sortSelect.value;

                data.sort((a, b) => {
                    if (a[sortBy] < b[sortBy]) {
                        return -1;
                    }
                    if (a[sortBy] > b[sortBy]) {
                        return 1;
                    }
                    return 0;
                });

                while (tableBody.firstChild){

                }

            })
        });
})