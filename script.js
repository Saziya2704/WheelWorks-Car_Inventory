// script.js

// home page code (commented out as per original file)
// function searchCarsFromHome() {
//   const brand = document.getElementById("car-brand").value;
//   const type = document.getElementById("car-type").value;
//   const location = document.getElementById("car-location").value;
//   window.location.href = `cars.html?brand=${brand}&type=${type}&location=${location}`;
// }

// Accordion code (remains unchanged)
const accordions = document.querySelectorAll(".accordion"); 
accordions.forEach(acc => {
    acc.addEventListener('click', function() {
        const panel = this.nextElementSibling;
        if (panel.classList.contains('open')) {
            panel.classList.remove('open');
        } else {
            document.querySelectorAll('.panel').forEach(para => para.classList.remove('open'));
            panel.classList.add('open');
        }
    });
});

// ==================== Cars Page Logic =======================

const container = document.getElementById("cars-container");
const carDetailContainer = document.getElementById("car-detail-container");
const carsBody = document.getElementById("cars-body");

// Fetch car data from JSON server
async function fetchCars() {
    try {
        const response = await axios.get('http://localhost:3000/car-elements'); 
        return response.data; // Return the car elements
    } catch (error) {
        console.error('Error fetching car data:', error);
        if (container) { // Check if container exists before updating its innerHTML
            container.innerHTML = `<p class="error-message">Failed to load cars. Please ensure the JSON server is running (http://localhost:3000) and try again.</p>`;
        } else {
            // Fallback for cases where container might not be present (e.g., on car details page initially)
            const wrapper = document.getElementById("car-cards-wrapper");
            if (wrapper) wrapper.innerHTML = `<p class="error-message">Failed to load cars. Please ensure the JSON server is running (http://localhost:3000) and try again.</p>`;
        }
        return []; // Return empty array on error to prevent further issues
    }
}

// Display cars in the car-cards-wrapper
function displayCars(cars) {
    const wrapper = document.getElementById("car-cards-wrapper");
    if (!wrapper) return; // Exit if wrapper doesn't exist (e.g., on bookings page)

    wrapper.innerHTML = ""; // Clear previous content

    if (cars.length > 0) {
        cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <div class="img-div">
                    <img src="${car.image}" alt="${car.car_name}" >
                    <div class="cartype-tag">${car.car_type}</div>
                </div>
                <div class="content-div">
                    <div class="carbrand-location-wrapper">
                        <div class="carbrand-tag">${car.car_brand}</div>
                        <div class="location-div">${car.location}</div>
                    </div>
                    <h4>${car.car_name}</h4>
                    <div class="car-price-container">
                        <span>INR ${car.price}</span> /Hour
                    </div>
                    <div class="icons-container">
                        <div class="icon-item">
                            <img src="${car.mileage_image}" alt="Mileage" class="img-item">
                            <p>${car.mileage}</p>
                        </div>
                        <div class="icon-item">
                            <img src="${car.auto_manu_image}" alt="Transmission" class="img-item">
                            <p>${car.auto_manu}</p>
                        </div>
                        <div class="icon-item">
                            <img src="${car.seats_image}" alt="Seats" class="img-item">
                            <p>${car.seats}</p>
                        </div>
                        <div class="icon-item">
                            <img src="${car.luggages_image}" alt="Luggage" class="img-item">
                            <p>${car.luggage}</p>
                        </div>
                    </div>
                    <button onclick="fetchCarDetails('${car.id}')" class="see-details">See Full Details</button>
                </div>`;
            wrapper.appendChild(card);
        });
    } else {
        wrapper.innerHTML = `<h4 class="no-pdt"> Sorry! No cars match your criteria. Try adjusting your search or filters.</h4>`;
    }
}

async function fetchCarDetails(carId) {
    try {
        const response = await axios.get('http://localhost:3000/car-elements'); 
        const carDetails = response.data.find(car => car.id == carId); // Use == for loose equality to match string/number IDs

        if (!carDetails) {
            throw new Error('Car not found');
        }

        displayDetails(carDetails); 
    } catch (error) {
        console.error('Error fetching car details:', error);
        if (carDetailContainer) {
            carDetailContainer.innerHTML = `<p class="error-message">Failed to load car details. Please try again later.</p>`;
        }
    }
}

function displayDetails(cardetails) {
    // Hide the cars body and search container, show the car detail container
    if (carsBody) carsBody.style.display = "none";
    if (carDetailContainer) carDetailContainer.style.display = "block";
    const searchcont = document.querySelector(".search-container");
    if (searchcont) searchcont.style.display = "none";

    const imgSection = document.querySelector('.img-section');
    // Remove existing breadcrumb to prevent duplicates
    const existingBreadcrumb = imgSection ? imgSection.querySelector('.breadcrumb-container') : null;
    if (existingBreadcrumb) {
        existingBreadcrumb.remove();
    }

    // Create and insert breadcrumb HTML
    const breadcrumbHTML = `
        <div class="breadcrumb-container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb crumb-navigation">
                    <li class="breadcrumb-item"><a href="home.html" style="color:white;">Home</a></li>
                    <li class="breadcrumb-item"><a href="cars.html" style="color:white;">Cars</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Car details</li>
                </ol>
            </nav>
        </div>`;
    if (imgSection) {
        imgSection.insertAdjacentHTML('afterbegin', breadcrumbHTML);
    }

    const carDetailCard = document.createElement('div');
    carDetailCard.className = 'car-detail-card';

    // Construct the booking URL with all necessary details
    const bookingUrl = `bookings.html?id=${cardetails.id}&name=${encodeURIComponent(cardetails.car_name)}&brand=${encodeURIComponent(cardetails.car_brand)}&location=${encodeURIComponent(cardetails.location)}&price=${cardetails.price}`;

    carDetailCard.innerHTML = `
        <div class="left-container3">
            <div class="images-wrapper">
                <div class="main-img">
                    <img src="${cardetails.image1}" alt="${cardetails.car_name}" id="main-img">
                </div>
                <div class="sub-imges">
                    <img onclick="changeImage('${cardetails.image2}')" src="${cardetails.image2}" alt="${cardetails.car_name}">
                    <img onclick="changeImage('${cardetails.image3}')" src="${cardetails.image3}" alt="${cardetails.car_name}">
                    <img onclick="changeImage('${cardetails.image4}')" src="${cardetails.image4}" alt="${cardetails.car_name}">
                </div>
            </div>
            <div class="booknow-container">
                <div class="price-wrapper">
                    INR <span class="price-span">${cardetails.price}</span> /Hour
                </div>
                <div class="bknow-button-contianer">
                    <h3>Interested in Renting This Car?</h3>
                    <button class="book-button">
                        <a href="${bookingUrl}"> Book Now</a>
                    </button>
                </div>
                <h2 class="contact-heading">Contact Us</h2>
                <div class="email-container">
                    <span class="material-symbols-outlined"> mail</span>
                    <p>info@wheelworks.com</p>
                </div>
                <div class="phone-container">
                    <span class="material-symbols-outlined"> call </span>
                    <p>+91 9952349786</p>
                </div>
            </div>
        </div>
        <div class="right-container3">
            <h1 class="car-name">${cardetails.car_name}</h1>
            <div class="top-part">
                <h3>Know About Our Car Services</h3>
                <p>At WheelWorks, we are dedicated to keeping your car in perfect condition. From routine maintenance and oil changes to complex repairs and diagnostics, our expert team ensures your vehicle receives the best care possible. Your safety and satisfaction are our top priorities, making us the go-to destination for all your car service needs. Trust us to keep you moving, mile after mile!</p>
            </div>
            <div class="bottom-part">
                <h3>Specifications</h3>
                <div class="spec-wrapper">
                    <div class="spec-item-container"><h6>Mileage</h6><h6 class="value">${cardetails.mileage}</h6></div>
                    <div class="spec-item-container"><h6>Transmission</h6><h6 class="value">${cardetails.auto_manu}</h6></div>
                    <div class="spec-item-container"><h6>Seats</h6><h6 class="value">${cardetails.seats}</h6></div>
                    <div class="spec-item-container"><h6>Baggage</h6><h6 class="value">${cardetails.luggage}</h6></div>
                    <div class="spec-item-container"><h6>Year</h6><h6 class="value">${cardetails.Year}</h6></div>
                    <div class="spec-item-container"><h6>Type</h6><h6 class="value">${cardetails.car_type}</h6></div>
                    <div class="spec-item-container"><h6>Brand</h6><h6 class="value">${cardetails.car_brand}</h6></div>
                    <div class="spec-item-container"><h6>Location</h6><h6 class="value">${cardetails.location}</h6></div>
                </div>
                <h3>Features</h3>
                <div class="features2-wrapper">
                    <div class="feat1">
                        <div class="item"><span class="material-symbols-outlined">check_circle</span>Cruise Control</div>
                        <div class="item"><span class="material-symbols-outlined">check_circle</span>Built-in GPS</div>
                        <div class="item"><span class="material-symbols-outlined">check_circle</span>Music System</div>
                    </div>
                    <div class="feat2">
                        <div class="item"><span class="material-symbols-outlined">check_circle</span>Wireless Charging</div>
                        <div class="item"><span class="material-symbols-outlined">check_circle</span>Air Conditioning</div>
                        <div class="item"><span class="material-symbols-outlined">check_circle</span>Parking Sensors</div>
                    </div>
                </div>
            </div>
        </div>`;

    if (carDetailContainer) {
        carDetailContainer.innerHTML = ""; // Clear previous content
        carDetailContainer.appendChild(carDetailCard);
    }
}

function changeImage(image){
    const largeImage = document.getElementById('main-img');
    if (largeImage) { // Check if element exists
        largeImage.src = image;
    }
}

// Load cars on window load — with home page filters support (for cars.html)
window.addEventListener('load', async () => {
    // Only execute this logic if on cars.html
    if (window.location.pathname.includes('cars.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        let selectedBrand = urlParams.get('brand')?.toLowerCase().trim() || "";
        let selectedType = urlParams.get('type')?.toLowerCase().trim() || "";
        let selectedLocation = urlParams.get('location')?.toLowerCase().trim() || "";

        const cars = await fetchCars(); 
        let filtered = cars;

        if (selectedBrand || selectedType || selectedLocation) {
            filtered = cars.filter(c => {
                const carBrand = c.car_brand?.toLowerCase().trim() || "";
                const carType = c.car_type?.toLowerCase().trim() || "";
                const carLocation = c.location?.toLowerCase().trim() || "";

                return (!selectedBrand || carBrand.includes(selectedBrand)) &&
                       (!selectedType || carType.includes(selectedType)) &&
                       (!selectedLocation || carLocation.includes(selectedLocation));
            });
        }
        displayCars(filtered);
    }
});

// Handle user input for searching cars (for cars.html)
async function fetchProducts() {
    if (!window.location.pathname.includes('cars.html')) return; // Only run on cars.html
    const cars = await fetchCars();
    const userInput = document.getElementById("car-search-input").value.toLowerCase();
    const filteredCars = cars.filter(car => car.car_name.toLowerCase().includes(userInput));
    displayCars(filteredCars);
}

// Handle Enter key press for searching (for cars.html)
function handleEnter(event) {
    if (window.location.pathname.includes('cars.html') && event.key === "Enter") {
        fetchProducts();
    }
}

// Event listener for search button (for cars.html)
const carSearchButton = document.getElementById("car-search-button");
if (carSearchButton) {
    carSearchButton.addEventListener("click", fetchProducts);
}

// Event listener for the search input (for cars.html)
const carSearchInput = document.getElementById("car-search-input");
if (carSearchInput) {
    carSearchInput.addEventListener("keydown", handleEnter);
}

// Filter cars based on selected checkboxes and radio buttons (for cars.html)
async function applyFilters() {
    if (!window.location.pathname.includes('cars.html')) return; // Only run on cars.html
    const cars = await fetchCars(); // Fetch all cars to re-filter
    const selectedTypes = Array.from(document.querySelectorAll('.car-type:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('.car-brand:checked')).map(cb => cb.value);
    const selectedPriceRange = document.querySelector('input[name="select"]:checked')?.value;

    const filteredCars = cars.filter(car => {
        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(car.car_type.toLowerCase());
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(car.car_brand.toLowerCase());
        const priceMatch = filterByPrice(car.price, selectedPriceRange);

        return typeMatch && brandMatch && priceMatch;
    });
    displayCars(filteredCars);
}

// Check if car price matches the selected price range (for cars.html)
function filterByPrice(price, range) {
    if (!range || range === 'all') return true;

    const numericPrice = parseFloat(price); // Ensure price is a number
    if (isNaN(numericPrice)) return false; // Handle invalid prices gracefully

    switch (range) {
        case '84-109':
            return numericPrice >= 84 && numericPrice <= 109;
        case '110-194':
            return numericPrice >= 110 && numericPrice <= 194;
        case '195-above':
            return numericPrice >= 195;
        default:
            return true;
    }
}

// Event listener for checkboxes and radio buttons (for cars.html)
document.querySelectorAll('.car-type, .car-brand, .price').forEach(input => {
    input.addEventListener('change', applyFilters); // Call applyFilters on change
});

// Location button functionality (for cars.html)
document.querySelectorAll('.location-button').forEach(button => {
    button.addEventListener('click', async () => {
        if (!window.location.pathname.includes('cars.html')) return; // Only run on cars.html
        const cars = await fetchCars();
        const location = button.getAttribute('data-location');
        if (location === 'show-all') { // Corrected logic for 'Show All'
             displayCars(cars);
        } else {
            const filteredCars = cars.filter(car => car.location.toLowerCase() === location.toLowerCase());
            displayCars(filteredCars);
        }
    });
});

// ==================== Bookings Page Specific Logic =======================


// ==================== Bookings Page Specific Logic =======================

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const summaryAndPaymentWrapper = document.querySelector('.summary-and-payment-wrapper');
    const generateInvoiceBtn = document.getElementById('generateInvoiceBtn');
    const mockPaymentBtn = document.getElementById('mockPaymentBtn'); // Assuming this button exists

    // Ensure the summary wrapper is hidden when the bookings page loads
    if (summaryAndPaymentWrapper) {
        summaryAndPaymentWrapper.style.display = 'none';
    }

    let selectedCar = null;
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('id') && urlParams.has('price')) {
        selectedCar = {
            id: urlParams.get('id'),
            car_name: urlParams.get('name') ? decodeURIComponent(urlParams.get('name')) : 'N/A',
            car_brand: urlParams.get('brand') ? decodeURIComponent(urlParams.get('brand')) : 'N/A',
            location: urlParams.get('location') ? decodeURIComponent(urlParams.get('location')) : 'N/A',
            price: parseFloat(urlParams.get('price')) 
        };
        console.log("Selected Car for Booking (from URL):", selectedCar);
    } else {
        console.warn("No car selected via URL. Please select a car from the cars page to ensure accurate booking calculations.");
    }

    if (bookingForm) {
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const pickupAddressInput = document.getElementById('pickupAddress');
        const pickupDateInput = document.getElementById('pickupDate');
        const pickupTimeInput = document.getElementById('pickupTime');
        const dropoffAddressInput = document.getElementById('dropoffAddress');
        const dropoffDateInput = document.getElementById('dropoffDate');
        const dropoffTimeInput = document.getElementById('dropoffTime');
        const numberOfDaysInput = document.getElementById('no-of-days');

        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            const phoneNumber = phoneNumberInput.value.trim();
            const pickupAddress = pickupAddressInput.value.trim();
            const pickupDate = pickupDateInput.value.trim();
            const pickupTime = pickupTimeInput.value;
            const dropoffAddress = dropoffAddressInput.value.trim();
            const dropoffDate = dropoffDateInput.value.trim();
            const dropoffTime = dropoffTimeInput.value;
            const numberOfDays = parseInt(numberOfDaysInput.value);

            if (!fullName || !email || !phoneNumber || !pickupAddress || !pickupDate || !pickupTime ||
                !dropoffAddress || !dropoffDate || !dropoffTime || isNaN(numberOfDays) || numberOfDays <= 0) {
                alert('Please fill in all required fields!');
                return;
            }

            if (!selectedCar || isNaN(selectedCar.price)) {
                alert('Please go back to the cars and select a car to proceed.');
                return;
            }

            // Calculate prices
            const pricePerHour = selectedCar.price;
            const hours = numberOfDays * 24; 
            const baseRent = pricePerHour * hours;
            const gstRate = 0.05; 
            const gstAmount = baseRent * gstRate;
            const totalAmount = baseRent + gstAmount;

            // Populate Order Summary
            document.getElementById('summaryCarName').textContent = selectedCar.car_name;
            document.getElementById('summaryCarBrand').textContent = selectedCar.car_brand;
            document.getElementById('summaryCarLocation').textContent = selectedCar.location;
            document.getElementById('summaryPricePerHour').textContent = "INR " + pricePerHour.toFixed(2);
            document.getElementById('summaryNumDays').textContent = numberOfDays;

            // Populate Price Details
            document.getElementById('displayNumDays').textContent ="Rent (for " + numberOfDays + " days)";
            document.getElementById('basePrice').textContent = `INR ${baseRent.toFixed(2)}`;
            document.getElementById('gstAmount').textContent = `INR ${gstAmount.toFixed(2)}`;
            document.getElementById('totalPrice').textContent = `INR ${totalAmount.toFixed(2)}`;

            // Show the summary and payment section
            if (summaryAndPaymentWrapper) {
                summaryAndPaymentWrapper.style.display = 'block';
                summaryAndPaymentWrapper.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Event listener for Generate Invoice button - MOVED HERE, NO NESTED DOMContentLoaded
    generateInvoiceBtn.addEventListener('click', function () {
        // Create a new element to hold the invoice content for PDF generation
        const pdfContent = document.createElement('div');

        // Dynamically get all values just before generating the PDF
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const pickupAddress = document.getElementById('pickupAddress').value;
        const pickupDate = document.getElementById('pickupDate').value;
        const pickupTime = document.getElementById('pickupTime').value;
        const dropoffAddress = document.getElementById('dropoffAddress').value;
        const dropoffDate = document.getElementById('dropoffDate').value;
        const dropoffTime = document.getElementById('dropoffTime').value;

        const summaryCarName = document.getElementById('summaryCarName').textContent;
        const summaryCarBrand = document.getElementById('summaryCarBrand').textContent;
        const summaryCarLocation = document.getElementById('summaryCarLocation').textContent;
        const summaryPricePerHour = document.getElementById('summaryPricePerHour').textContent;
        const summaryNumDays = document.getElementById('summaryNumDays').textContent;

        const displayNumDays = document.getElementById('displayNumDays').textContent;
        const gstAmount = document.getElementById('gstAmount').textContent;
        const totalPrice = document.getElementById('totalPrice').textContent;

        pdfContent.innerHTML = `
            <style>
                /* Define styles directly within the HTML for better PDF rendering */
                body {
                    font-family: Arial, sans-serif;
                }
                .invoice-container {
                    padding: 20px;
                    border: 1px solid #eee; /* Optional: Add a border for visual separation */
                    max-width: 800px; /* Optional: Constrain width */
                    margin: auto; /* Optional: Center the content */
                }
                h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }
                hr {
                    border-top: 1px solid #eee;
                    margin-bottom: 20px;
                }
                h4 {
                    color: #555;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                p {
                    margin-bottom: 5px;
                    line-height: 1.5;
                }
                strong {
                    font-weight: bold;
                }
                .total-amount {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #007bff;
                    margin-top: 20px;
                }
                .thank-you {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #777;
                }
            </style>
            <div class="invoice-container">
                <h2>Booking Invoice - WheelWorks</h2>
                <hr>

                <h4>Customer Details</h4>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phoneNumber}</p>

                <h4>Pickup Details</h4>
                <p><strong>Address:</strong> ${pickupAddress}</p>
                <p><strong>Date:</strong> ${pickupDate}</p>
                <p><strong>Time:</strong> ${pickupTime}</p>

                <h4>Dropoff Details</h4>
                <p><strong>Address:</strong> ${dropoffAddress}</p>
                <p><strong>Date:</strong> ${dropoffDate}</p>
                <p><strong>Time:</strong> ${dropoffTime}</p>

                <h4>Your Ride Details</h4>
                <p><strong>Car Name:</strong> ${summaryCarName}</p>
                <p><strong>Brand:</strong> ${summaryCarBrand}</p>
                <p><strong>Location:</strong> ${summaryCarLocation}</p>
                <p><strong>Price per Hour:</strong> ${summaryPricePerHour}</p>
                <p><strong>Number of Days:</strong> ${summaryNumDays}</p>

                <h4>Payment Summary</h4>
                <p>${displayNumDays}</p>
                <p>GST(+18%): ${gstAmount}</p>
                <p class="total-amount">Total Amount: ${totalPrice}</p>

                <p class="thank-you">Thank you for choosing WheelWorks!</p>
            </div>
        `;

        // Log the content to the console to verify before PDF generation
        console.log("PDF Content HTML:", pdfContent.innerHTML);

        // Generate PDF
        html2pdf().from(pdfContent).save('WheelWorks_Booking_Invoice.pdf');
    });
});