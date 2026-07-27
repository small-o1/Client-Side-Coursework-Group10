document.addEventListener('DOMContentLoaded', () => {
    
    const reservationForm = document.querySelector('.reservation-form');

    reservationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const bookTitle = document.getElementById('book-select').value;
        const fullName = document.getElementById('full-name').value;
        const mailingAddress = document.getElementById('address').value;

        const newReservation = {
            id: Date.now(), // ID based on the current timestamp
            book: bookTitle,
            name: fullName,
            address: mailingAddress,
            dateReserved: new Date().toLocaleDateString()
        };

        let savedReservations = JSON.parse(localStorage.getItem('libraryReservations')) || [];

        savedReservations.push(newReservation);

        localStorage.setItem('libraryReservations', JSON.stringify(savedReservations));

        alert(`Thank you, ${fullName}! Your reservation for "${bookTitle}" has been confirmed.`);
        reservationForm.reset();
    });

});