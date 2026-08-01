$(document).ready(function() {
    
    const $reservationForm = $('.reservation-form');

    if ($reservationForm.length) {
        $reservationForm.on('submit', function(event) {
            event.preventDefault();

            const bookTitle = $('#book-select').val();
            const fullName = $('#full-name').val();
            const mailingAddress = $('#address').val();

            if (!bookTitle || !fullName || !mailingAddress) return;

            const newReservation = {
                id: Date.now(),
                book: bookTitle,
                name: fullName,
                address: mailingAddress,
                dateReserved: new Date().toLocaleDateString(),
                status: 'pending'
            };

            try {
                let savedReservations = JSON.parse(localStorage.getItem('libraryReservations')) || [];
                savedReservations.push(newReservation);
                localStorage.setItem('libraryReservations', JSON.stringify(savedReservations));

                alert(`Thank you, ${fullName}! Your reservation for "${bookTitle}" has been confirmed.`);
                this.reset();
            } catch (error) {
                console.error("Local Storage Error. Please clear your browser cache.", error);
                alert("There was an error saving your reservation. Please check the console.");
            }
        });
    }

    const $pendingTable = $('#dynamic-holds-table');
    const $readyTable = $('#ready-table');
    const $borrowedTable = $('#borrowed-table');
    const $lookupBtn = $('#btn-lookup');
    const $lookupInput = $('#lookup-address');
    const $displayArea = $('#reservations-display');
    const $errorArea = $('#lookup-error');

    if ($lookupBtn.length) {
        
        $lookupBtn.on('click', function() {
            const searchAddress = $lookupInput.val().trim().toLowerCase();
            
            if (!searchAddress) {
                alert("Please enter an address to search.");
                return;
            }

            let allReservations = [];
            try {
                allReservations = JSON.parse(localStorage.getItem('libraryReservations')) || [];
            } catch (error) {
                console.error("Failed to load reservations.", error);
            }

            const userReservations = allReservations.filter(res => res.address.toLowerCase() === searchAddress);

            if (userReservations.length === 0) {
                $displayArea.hide();
                $errorArea.show();
            } else {
                $errorArea.hide();
                $displayArea.show();
                
                $pendingTable.empty();
                $readyTable.empty();
                $borrowedTable.empty();

                const pendingItems = userReservations.filter(res => res.status === 'pending');
                const readyItems = userReservations.filter(res => res.status === 'ready');
                const borrowedItems = userReservations.filter(res => res.status === 'borrowed');

                if (pendingItems.length === 0) {
                    $pendingTable.append('<tr><td colspan="4" style="text-align: center; color: #777;">No pending holds found.</td></tr>');
                } else {
                    pendingItems.forEach(function(res) {
                        $pendingTable.append(`
                            <tr>
                                <td>${res.book}</td>
                                <td>Reserved by: ${res.name}</td>
                                <td>Date: ${res.dateReserved}</td>
                                <td><a href="#" class="btn-outline cancel-btn" data-id="${res.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Cancel Hold</a></td>
                            </tr>
                        `);
                    });
                }

                if (readyItems.length === 0) {
                    $readyTable.append('<tr><td colspan="4" style="text-align: center; color: #777;">No items ready for pickup.</td></tr>');
                } else {
                    readyItems.forEach(function(res) {
                        $readyTable.append(`
                            <tr>
                                <td>${res.book}</td>
                                <td>Reserved by: ${res.name}</td>
                                <td style="color: #27ae60; font-weight: bold;">Available Now</td>
                                <td><a href="#" class="btn-outline cancel-btn" data-id="${res.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Cancel Hold</a></td>
                            </tr>
                        `);
                    });
                }

                if (borrowedItems.length === 0) {
                    $borrowedTable.append('<tr><td colspan="4" style="text-align: center; color: #777;">No items currently borrowed.</td></tr>');
                } else {
                    borrowedItems.forEach(function(res) {
                        $borrowedTable.append(`
                            <tr>
                                <td>${res.book}</td>
                                <td>Reserved by: ${res.name}</td>
                                <td>Date: ${res.dateReserved}</td>
                                <td><a href="#" class="btn-outline renew-btn" data-id="${res.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Renew</a></td>
                            </tr>
                        `);
                    });
                }
            }
        });

        $(document).on('click', '.cancel-btn', function(e) {
            e.preventDefault();
            const reservationId = $(this).data('id');
            let currentReservations = JSON.parse(localStorage.getItem('libraryReservations')) || [];
            
            currentReservations = currentReservations.filter(r => r.id !== reservationId);
            localStorage.setItem('libraryReservations', JSON.stringify(currentReservations));
            $lookupBtn.trigger('click');
        });
    }
});