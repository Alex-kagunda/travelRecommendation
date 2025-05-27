console.log("Home section loaded:", document.querySelector('#home'));

// Fetch data from the JSON file
fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        const recommendations = data;
        const resultsDiv = document.getElementById('results');

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            resultsDiv.innerHTML = '';

            if (searchInput) {
                let matches = [];

                // Check for beach recommendations
                if (['beach', 'beaches'].includes(searchInput)) {
                    matches = recommendations.beaches.slice(0, 2);
                }
                // Check for temple recommendations
                else if (['temple', 'temples'].includes(searchInput)) {
                    matches = recommendations.temples.slice(0, 2);
                }
                // Check for country recommendations
                else {
                    for (const country of recommendations.countries) {
                        if (country.name.toLowerCase().includes(searchInput)) {
                            matches = country.cities.slice(0, 2);
                            break;
                        }
                    }
                }

                if (matches.length > 0) {
                    matches.forEach(item => {
                        const country = recommendations.countries.find(c => c.cities.some(city => city.name === item.name));
                        const timeZone = country ? country.timeZone : 'UTC';
                        const timeOptions = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        const localTime = new Date().toLocaleTimeString('en-US', timeOptions);

                        const resultItem = document.createElement('div');
                        resultItem.className = 'result-item';
                        resultItem.innerHTML = `
                            <img src="${item.imageUrl}" alt="${item.name}">
                            <div>
                                <h2>${item.name}</h2>
                                <p>${item.description}</p>
                                <div class="time">Current Local Time (${timeZone}): ${localTime}</div>
                            </div>
                        `;
                        resultsDiv.appendChild(resultItem);
                    });
                } else {
                    resultsDiv.innerHTML = '<p>No recommendations found.</p>';
                }
            }
        });

        // Clear button functionality
        document.getElementById('resetBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            resultsDiv.innerHTML = '';
        });
    })
    .catch(error => console.error('Error fetching data:', error));
