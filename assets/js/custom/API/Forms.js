
const BackURL = "https://fusionocr.com/api"
// const BackURL = "http://localhost:5000"

const BackSocketURL = "wss://fusionocr.com"
// const BackSocketURL = "http://localhost:5000"

const socket = io(`${BackSocketURL}`,{transports: ["websocket", "polling"],withCredentials: false}); // Connect to the backend

// Get the current URL
const currentUrl = window.location.href;

// Parse the URL to extract query parameters
const urlParams = new URLSearchParams(new URL(currentUrl).search);

// Get the value of the "page" parameter
const page = urlParams.get('page');
const limit = urlParams.get("limit") || 25;
document.querySelector('[data-kt-filemanager-table-select="page_size"]').value = limit


// Get the elements
const dateFromInput = document.getElementById('DateExportFrom');
const dateToInput = document.getElementById('DateExportTo');
const exportButton = document.querySelector('.ExportButton');
// Get the current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Set the max attribute for both date inputs
document.getElementById('DateExportFrom').setAttribute('max', today);
document.getElementById('DateExportTo').setAttribute('max', today);


async function getData(){


    // set to Be Loading
    if (!document.querySelector("#FilesTable").innerHTML){
        document.querySelector("#NotFoundForms").innerHTML ='Loading ...'
    }


    // Check for Search 
    const searchQuery = document.getElementById("FormsSearch").value
    var endpoint = `forms_list?limit=${limit}&offset=${page?page-1:0}`
    document.querySelector("#paginationNav").style.display = 'flex'

    if (searchQuery){
        var endpoint = `forms_search_list?search_query=${searchQuery}&offset=${page?page-1:0}`
        document.querySelector("#paginationNav").style.display = 'none'
    
        const response = await fetch(`${BackURL}/${endpoint}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const res = await response.json();
            const formsList = res['forms'];
            const totalCount = res['total'];
            
            updateUI(formsList, totalCount,page)

        }else if(response.status === 401){
            window.location.replace("/sign-in");
        }
    }else{
        socket.emit('get_forms', { limit: limit, offset: page?page-1:0 });

    }
    // KTFileManagerList.init();
    
    

};

// Delete Forms
async function deleteForms() {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    if (checked.length === 0) {
        alert('Please select at least one form to download.');
        return;
    }
    // for each Form, Send a Delete Request
    const response = await fetch(`${BackURL}/forms`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ form_ids: checked }),
    });

    if (response.ok) {
        Swal.fire({
            text: "You have deleted " + checked.length + " Forms!.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn fw-bold btn-primary",
            }
        }).then(function () {
            socket.emit('get_forms', { limit: limit, offset: page?page-1:0 });
            document.getElementsByClassName('DownloadButtons')[0].classList.add('d-none');
            document.getElementsByClassName('DownloadButtons')[1].classList.add('d-none');
            document.getElementById('DeleteButton').classList.add('d-none');
            document.getElementById('upButton').classList.remove('d-none');
        });
    }else{

        const error = await response.json();
        Swal.fire({
            text: "Forms was not deleted.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn fw-bold btn-primary",
            }
        });
    }




}
async function downloadForms(fileType = 'xlsx') {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    if (checked.length === 0) {
        alert('Please select at least one form to download.');
        return;
    }

    try {
        
        const response = await fetch(`${BackURL}/download-${fileType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ form_ids: checked, file_type: fileType }),
        });

        if (!response.ok) {
            Swal.fire({
                text: "Error in Downloading Forms",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                }
            });
            return
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `forms.${fileType}`; // Set the downloaded file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.error('Error during file download:', err);
        alert('An error occurred while downloading the file.');
    }
}
async function downloadFormsByDate(fileType = 'xlsx') {
    const fromValue = dateFromInput.value;
    const toValue = dateToInput.value;

    console.log(fromValue, toValue)
    if (!fromValue || !toValue) {
        alert('Please select From and To Date');
        return;
    }

    try {
        
        const response = await fetch(`${BackURL}/download-${fileType}-date`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ from_date: fromValue, to_date: toValue }),
        });

        if (!response.ok) {
            Swal.fire({
                text: "Error in Downloading Forms",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                }
            });
            return
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `forms.${fileType}`; // Set the downloaded file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.error('Error during file download:', err);
        alert('An error occurred while downloading the file.');
    }
}

// Function to handle checkbox change events
function handleCheckboxChange() {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    if (anyChecked) {
        // document.getElementsByClassName('DownloadButtons')[0].classList.remove('d-none');
        // document.getElementsByClassName('DownloadButtons')[1].classList.remove('d-none');
        // document.getElementById('DeleteButton').classList.remove('d-none');
        // document.getElementById('upButton').classList.add('d-none');
        document.querySelector(".NormalToolBar").classList.add('d-none');
        document.querySelector(".CheckedToolBar").classList.remove('d-none');
        document.querySelector(".dateExportForm").classList.add('d-none');

    } else {

        // document.getElementById('upButton').classList.remove('d-none');
        document.querySelector(".NormalToolBar").classList.remove('d-none');

        document.querySelector(".CheckedToolBar").classList.add('d-none');

        document.querySelector(".dateExportForm").classList.remove('d-none');

        console.log("none Checked");
    }
}

function updateUI(formsList, totalCount) {
    // Get Checked
    const checkboxes = document.querySelectorAll('.form-check-input');
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    if (formsList.length === 0 ){
        document.querySelector("#NotFoundForms").innerHTML ='No Forms Found'
        document.querySelector("#FilesTable").innerHTML =''
    }
    else{
        document.querySelector("#FilesTable").innerHTML =''
        document.querySelector("#NotFoundForms").innerHTML =""
    }
    for (let i = 0; i < formsList.length; i++) {
        const form = formsList[i];
        var statusStyle = ''
        if (form.status === 'Detecting Forms'){
            statusStyle = 'badge-badge-light-dark'
        }else if (form.status === 'Pending'){
            statusStyle = 'badge-badge-light-dark'
        }else if(form.status === 'Error'){
            statusStyle = 'badge-light-danger'
        }else if(form.status === 'Extracted'){
            statusStyle = 'badge-light-success'
        }else{
            statusStyle = 'badge-light-warning'
        }
        const link = 
        (form.status === "Extracted" || form.status === "Error")?
                            `<a href="./forms/document/?id=${form.form_id}" id="${form.form_id}" class="text-gray-800 text-hover-primary">${form.name}</a>`
                        :
                            `<a style="pointer-events:none" id="${form.form_id}" class="text-gray-800 text-hover-primary">${form.name}</a>`
        const uploadDate = new Date(form.uploaded_at)
        const formattedDate = `${uploadDate.getDate()} ${uploadDate.toLocaleString('default', { month: 'short' })} ${uploadDate.getFullYear()}, ${uploadDate.getHours() % 12 || 12}:${uploadDate.getMinutes().toString().padStart(2, '0')} ${uploadDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        const formDiv = `
                <tr>
                    <td>
                         <div class="form-check form-check-sm form-check-custom form-check-solid">
                            <input class="form-check-input" type="checkbox" value="${form.form_id}" ${checked.includes((form.form_id).toString()) ? 'checked':''} onChange="handleCheckboxChange()"/>
                        </div> 
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <i class="ki-duotone ki-file fs-2x text-primary me-4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                            </i>
                            ${link}
                        </div>
                    </td>
                    <td>${formattedDate}</td>
                    <td class="text-start">
                        <span class="badge ${statusStyle}">${form.status}</span>

                    </td>
                    <td>
                        <button type="button" title="Re Proccess" class="btn btn-flex ${form.status !== 'Error'?"d-none":''}" data-id="${form.form_id}"  onclick="reProccess(this)" >	
                            <i class="ki-duotone ki-arrows-circle fs-2 text-danger">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                        </button>
                    </td>
                </tr>
                `
        document.querySelector("#FilesTable").innerHTML += formDiv;
    }
    // Setting the Navbar Pages
    const totalPages = Math.ceil(totalCount / limit);
    var pageNav =''
    for (let i = 1; i <= totalPages; i++) {
        pageNav += `
            <li class="dt-paging-button page-item ${page == i || (!page && i==1) ? 'active' : ''}">
                <a class="page-link" aria-controls="kt_file_manager_list">${i}</a>
            </li>
        `
    }
    document.querySelector("#paginationNav").innerHTML = pageNav;
    document.querySelector("#kt_file_manager_items_counter").innerHTML = `${formsList.length} Forms`
    document.querySelector("#HeaderFormsCount").innerHTML = totalCount


    // Get the select element
    const pagingNavs = document.querySelectorAll('.dt-paging-button a');

    // Add an event listener to the select element
    pagingNavs.forEach((navButton)=>{
        navButton.addEventListener('click', (event) => {
            console.log("Heelo")
            // Get the selected value
            const selectedPage = event.target.innerHTML;

            // Get the current URL
            const currentUrl = window.location.href;

            // Parse the URL to modify query parameters
            const url = new URL(currentUrl);
            url.searchParams.set('page', selectedPage); // Set or update the "limit" parameter

            // Update the browser URL without reloading the page
            window.history.pushState({}, '', url);

            window.location.reload()
        })
    })
}

function reProccess(event){
    const formID = event.getAttribute('data-id')
    // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
    Swal.fire({
        text: "Are you sure you want to Re Proccess selected Document?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No, cancel",
        customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary"
        }
    }).then(function (result) {
        if (result.value) {
            fetch(`${BackURL}/form_reproccess?form_id=${formID}`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    form_id: formID
                })
            }).then((response) => {
                if (response.ok) {

                    // Swal.fire({
                    //     text: "You have deleted The Document.",
                    //     icon: "success",
                    //     buttonsStyling: false,
                    //     confirmButtonText: "Ok, got it!",
                    //     customClass: {
                    //         confirmButton: "btn fw-bold btn-primary",
                    //     }
                    // }).then(function () {
                    //     window.location.replace("/forms");
                    // });
                    socket.emit('get_forms', { limit: limit, offset: page?page-1:0 });
                    
                } else if(response.status === 401){
                    window.location.replace("/sign-in");
                }else{
                    Swal.fire({
                        text: "Form Can't Be Re-Procceesed, Please Try Again Later.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            }
            );
        } else if (result.dismiss === 'cancel') {
            Swal.fire({
                text: "Selected Document was not Re Proccessed.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                }
            });
        }
    });
}

// Function to check if both dates have values
function toggleExportButton() {
    const fromValue = dateFromInput.value;
    const toValue = dateToInput.value;

    // Enable the button if both dates are set; otherwise, disable it
    if (fromValue && toValue) {
        exportButton.disabled = false;
    } else {
        exportButton.disabled = true;
    }
}
let isUploading = false; // Track if upload is in progress

function handleTemplateChoose(event) {
    const LabTemplate = event.getAttribute("lab-template");
    localStorage.setItem("LabTemplate", LabTemplate)
    document.getElementById('kt_file_manager_upload_file').click()
}

// Handle File Upload
fileInput = document.getElementById('kt_file_manager_upload_file');
fileInput?.addEventListener('change', async () => {
    console.log("Starting to upload file...");
    if (!fileInput.files[0]) return; // No file selected
    const file = fileInput.files[0];

    if (file.type !== 'image/png' &&file.type !== 'application/pdf') {
        alert('Please select a valid PNG or PDF document.');
        return;
    }
    document.getElementById('ProccessButton').classList.remove("d-none");
    document.getElementById('upButton').classList.add("d-none");
    // Set uploading state to true
    isUploading = true;
    try {
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData)
        const response = await fetch(`${BackURL}/upload?id=${localStorage.getItem("id")}&template=${localStorage.getItem("LabTemplate")}`, {
            method: 'POST',
            body: formData,
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            // alert('File uploaded successfully!');

            // ResFileName, ResUploadDate, ResFName, ResLName, ResSex, ResDOB, ResAddress,ResCity, ResState, ResZip,
            // ResPhone, ResInsurance, ResInsuranceID, ResClient, ResCollection, ResTestReq, ResDiagnoseCode, ResElse
            var json = await response.json();
            console.log(json);
            json = json['file_id'];
            

            getData()

            document.getElementById('ProccessButton').classList.add("d-none");
            document.getElementById('upButton').classList.remove("d-none");

        }else if(response.status === 401){
            window.location.replace("/sign-in");
        } else {
            alert('File upload failed.');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading.');
    } finally {
        // Reset uploading state
        isUploading = false;

    }
});
// Prevent page close/reload during upload
window.addEventListener('beforeunload', (event) => {
    if (isUploading) {
        event.preventDefault();
        // event.returnValue = ''; // Display a confirmation dialog
    }
});

// Get the select element
const pageSizeSelect = document.querySelector('[data-kt-filemanager-table-select="page_size"]');
pageSizeSelect.addEventListener('change', (event) => {
    // Get the selected value
    const selectedLimit = event.target.value;

    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to modify query parameters
    const url = new URL(currentUrl);
    url.searchParams.set('limit', selectedLimit); // Set or update the "limit" parameter



    // Reload the page with the new limit
    total = Number(document.getElementById("HeaderFormsCount").innerHTML)
    if (selectedLimit * page > total){
        url.searchParams.set('page', 1); // Set or update the "limit" parameter

    }
    // Update the browser URL without reloading the page
    window.history.pushState({}, '', url);

    window.location.reload()
});


document.getElementById("FormsSearch")?.addEventListener("keyup", async function(event) {
    console.log(event.currentTarget.value)
    getData()
})

getData()

// Attach event listeners to both inputs
dateFromInput.addEventListener('input', toggleExportButton);
dateToInput.addEventListener('input', toggleExportButton);

// Initial state check
toggleExportButton();




socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
    
    // Request forms list
    socket.emit('get_forms', { limit: limit, offset: page?page-1:0 });
});
// update_front
socket.on('update_front', (data) => {
    console.log("update")
    // Request forms list
    getData()
});
// Handle forms update from server
socket.on('forms_update', (data) => {

    console.log('Received forms update:', data);
    updateUI(data.forms,data.total);
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});



