$(document).ready(function() {
    
    const $reservationForm = $('.reservation-form');

    $reservationForm.on('submit', function(event) {
        event.preventDefault();

        const bookTitle = $('#book-select').val();
        const fullName = $('#full-name').val();
        const mailingAddress = $('#address').val();

        const newReservation = {
            id: Date.now(),
            book: bookTitle,
            name: fullName,
            address: mailingAddress,
            dateReserved: new Date().toLocaleDateString()
        };

        let savedReservations = JSON.parse(localStorage.getItem('libraryReservations')) || [];
        savedReservations.push(newReservation);
        localStorage.setItem('libraryReservations', JSON.stringify(savedReservations));

        alert(`Thank you, ${fullName}! Your reservation for "${bookTitle}" has been confirmed.`);
        
        this.reset();
    });

});