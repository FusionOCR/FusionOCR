"use strict";
var KTUsersList = function () {
    // Define shared variables
    var table = document.getElementById('kt_table_users');
    var datatable;
    var toolbarBase;
    var toolbarSelected;
    var selectedCount;

    // Private functions
    var initUserTable = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            // const lastLogin = dateRow[1].innerText.toLowerCase(); // Get last login time
            let timeCount = 0;
            let timeFormat = 'minutes';

            // // Determine date & time format -- add more formats when necessary
            // if (lastLogin.includes('yesterday')) {
            //     timeCount = 1;
            //     timeFormat = 'days';
            // } else if (lastLogin.includes('mins')) {
            //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
            //     timeFormat = 'minutes';
            // } else if (lastLogin.includes('hours')) {
            //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
            //     timeFormat = 'hours';
            // } else if (lastLogin.includes('days')) {
            //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
            //     timeFormat = 'days';
            // } else if (lastLogin.includes('weeks')) {
            //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
            //     timeFormat = 'weeks';
            // }

            // Subtract date/time from today -- more info on moment datetime subtraction: https://momentjs.com/docs/#/durations/subtract/
            // const realDate = moment().subtract(timeCount, timeFormat).format();

            // Insert real date to last login attribute
            // dateRow[1].setAttribute('data-order', realDate);

            // Set real date for joined column
            const joinedDate = moment(dateRow[2].innerHTML, "DD MMM YYYY, LT").format(); // select date from 5th column in table
            dateRow[2].setAttribute('data-order', joinedDate);
        });

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            "pageLength": 10,
            "lengthChange": false,
            'columnDefs': [
                { orderable: false, targets: 0 }, // Disable ordering on column 0 (checkbox)
            ]
        });

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            initToggleToolbar();
            handleDeleteRows();
            toggleToolbars();
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-user-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }



    


    // Delete subscirption
    var handleDeleteRows = () => {
        // Select all delete buttons
        const deleteButtons = table.querySelectorAll('[data-kt-users-table-filter="delete_row"]');

        deleteButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function (e) {
                e.preventDefault();

                // Select parent row
                const parent = e.target.closest('tr');

                // Get user name
                const userName = parent.querySelectorAll('td')[1].querySelectorAll('a')[1].innerText;

                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Are you sure you want to delete " + userName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted " + userName + "!.",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        }).then(function () {
                            // Remove current row
                            datatable.row($(parent)).remove().draw();
                        }).then(function () {
                            // Detect checked checkboxes
                            toggleToolbars();
                        });
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: customerName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
        });
    }

    // Init toggle toolbar
    var initToggleToolbar = () => {
        // Toggle selected action toolbar
        // Select all checkboxes
        const checkboxes = table.querySelectorAll('[type="checkbox"]');

        // Select elements
        toolbarBase = document.querySelector('[data-kt-user-table-toolbar="base"]');
        toolbarSelected = document.querySelector('[data-kt-user-table-toolbar="selected"]');
        selectedCount = document.querySelector('[data-kt-user-table-select="selected_count"]');
        const deleteSelected = document.querySelector('[data-kt-user-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function () {
                setTimeout(function () {
                    toggleToolbars();
                }, 50);
            });
        });

        // Deleted selected rows
        deleteSelected.addEventListener('click', function () {
            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            Swal.fire({
                text: "Are you sure you want to delete selected customers?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, delete!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(async function (result) {
                if (result.value) {
                        const promises = [];

                        // Remove all selected customers
                        checkboxes.forEach((c,i) => {
                            if (c.checked) {
                                const userID = c.closest('tbody tr')?.id.split("-")[1]
                                // Send to Delete the User by DELETE /user with userID
                                const deletePromise = fetch(`${BackURL}/user/user`, {
                                    method: 'DELETE',
                                    headers: {
                                        authorization: `Bearer ${localStorage.getItem('token')}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        user_id: userID
                                    })
                                }).then(response => {
                                    if (response.ok) {
                                        return response.json();
                                    } else {
                                        Swal.fire({
                                            text: "Something went wrong.",
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn fw-bold btn-primary",
                                            }
                                        });
                                    }
                                }).catch(error => {
                                    console.error('Error:', error);
                                    Swal.fire({
                                        text: "Something went wrong.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn fw-bold btn-primary",
                                        }
                                    });
                                });
                                promises.push(deletePromise);

                            }
                        })
                        Promise.all(promises)
                            .then(() => {
                                Swal.fire({
                                    text: "You have deleted all selected Users!.",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(()=>{
                                    if (result.isConfirmed) {
                                        // Remove header checked box
                                        const headerCheckbox = table.querySelectorAll('[type="checkbox"]')[0];
                                        headerCheckbox.checked = false;

                                        window.location.reload();

                                        toggleToolbars(); // Detect checked checkboxes
                                        initToggleToolbar(); // Re-init toolbar to recalculate checkboxes
                                    }
                                });

                            })
                            .catch(error => {
                                console.error('Error:', error);
                                Swal.fire({
                                    text: "Something went wrong.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                });
                            });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Selected Users was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        });
    }

    // Toggle toolbars
    const toggleToolbars = () => {
        // Select refreshed checkbox DOM elements 
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }
    }

    return {
        // Public functions  
        init: function () {
            if (!table) {
                return;
            }
            initUserTable();
            initToggleToolbar();
            handleSearchDatatable();
            handleDeleteRows();

        }
    }
}();

// // On document ready
// KTUtil.onDOMContentLoaded(function () {
//     KTUsersList.init();
// });