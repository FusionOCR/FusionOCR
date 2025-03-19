


const socket = io(`${BackSocketURL}`,{transports: ["websocket", "polling"],withCredentials: false}); // Connect to the backend

// Get the current URL
const currentUrl = window.location.href;

// Parse the URL to extract query parameters
const urlParams = new URLSearchParams(new URL(currentUrl).search);

// Get the value of the "page" parameter
const page = urlParams.get('page');
const limit = urlParams.get("limit") || 50;
const url = new URL(currentUrl);
document.querySelector('[data-kt-filemanager-table-select="page_size"]').value = limit
// Load Filters From Local Storage
var filters = {}

if (localStorage.getItem("fromDateFilter")){
    addDateFromFilter({value:localStorage.getItem("fromDateFilter")})
    filters['fromDate'] = localStorage.getItem("fromDateFilter")
}
if (localStorage.getItem("toDateFilter")){
    addDateToFilter({value:localStorage.getItem("toDateFilter")})
    filters['toDate'] = localStorage.getItem("toDateFilter")
}
if (localStorage.getItem("formTypeFilter")){
    addFormTypeFilter({innerHTML:localStorage.getItem("formTypeFilter")})
    filters['formType'] = localStorage.getItem("formTypeFilter")
}
// Get the elements
const dateFromInput = document.getElementById('DateExportFrom');
const dateToInput = document.getElementById('DateExportTo');
const formTypeFilter = document.getElementById('FormTypeFilter');
const exportButton = document.querySelector('.ExportButton');
// Get the current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Set the max attribute for both date inputs
document.getElementById('DateExportFrom').setAttribute('max', today);
document.getElementById('DateExportTo').setAttribute('max', today);

var orderByName = localStorage.getItem("orderByName") || null;
var orderByUpload = localStorage.getItem("orderByUpload") || null;
var orderStatus = localStorage.getItem("orderStatus") || null;
var orderValid = localStorage.getItem("orderValid") || null;
orderByName = orderByName ==='null'?null:orderByName
orderByUpload = orderByUpload ==='null'?null:orderByUpload
orderStatus = orderStatus ==='null'?null:orderStatus
orderValid = orderValid ==='null'?null:orderValid
document.querySelector(".NameFilter").innerHTML = orderByName === 'asc'?'<i class="fa-solid fa-arrow-down-short-wide"></i>':orderByName === 'desc'?'<i class="fa-solid fa-arrow-down-wide-short"></i>':''
document.querySelector(".UploadFilter").innerHTML = orderByUpload === 'asc'?'<i class="fa-solid fa-arrow-down-short-wide"></i>':orderByUpload === 'desc'?'<i class="fa-solid fa-arrow-down-wide-short"></i>':''
document.querySelector(".StatusFilter").innerHTML = orderStatus === 'asc'?'<i class="fa-solid fa-arrow-down-short-wide"></i>':orderStatus === 'desc'?'<i class="fa-solid fa-arrow-down-wide-short"></i>':''
document.querySelector(".ValidFilter").innerHTML = orderValid === 'asc'?'<i class="fa-solid fa-arrow-down-short-wide"></i>':orderValid === 'desc'?'<i class="fa-solid fa-arrow-down-wide-short"></i>':''


document.getElementById("FormsSearch").value = url.searchParams.get('search_query')
var searchQuery =  url.searchParams.get('search_query')
// change order by name to be asc then desc then null
function changeOrderByName(){
    // check other orders to be null
    orderByUpload = null
    orderStatus = null
    orderValid = null
    localStorage.setItem("orderByUpload", orderByUpload)
    localStorage.setItem("orderStatus", orderStatus)
    localStorage.setItem("orderValid", orderValid)

    // Set UploadFilter,statusFilter,validFilter Empty
    document.querySelector(".UploadFilter").innerHTML = ''
    document.querySelector(".StatusFilter").innerHTML = ''
    document.querySelector(".ValidFilter").innerHTML = ''

    if (orderByName === null){
        orderByName = 'asc'
        document.querySelector(".NameFilter").innerHTML = '<i class="fa-solid fa-arrow-down-short-wide"></i>'
    }else if(orderByName === 'asc'){
        orderByName = 'desc'
        document.querySelector(".NameFilter").innerHTML = '<i class="fa-solid fa-arrow-down-wide-short"></i>'

    }else{
        orderByName =  null
        document.querySelector(".NameFilter").innerHTML = ''

    }
    localStorage.setItem("orderByName", orderByName)
    getData()
}
// change order by upload to be asc then desc then null
function changeOrderByUpload(){
    // check other orders to be null
    orderByName = null
    orderStatus = null
    orderValid = null
    localStorage.setItem("orderByName", orderByName)
    localStorage.setItem("orderStatus", orderStatus)
    localStorage.setItem("orderValid", orderValid)

    // Set NameFilter,statusFilter,validFilter Empty
    document.querySelector(".NameFilter").innerHTML = ''
    document.querySelector(".StatusFilter").innerHTML = ''
    document.querySelector(".ValidFilter").innerHTML = ''

    if (orderByUpload === null){
        orderByUpload = 'asc'
        document.querySelector(".UploadFilter").innerHTML = '<i class="fa-solid fa-arrow-down-short-wide"></i>'

    }else if(orderByUpload === 'asc'){
        orderByUpload = 'desc'
        document.querySelector(".UploadFilter").innerHTML = '<i class="fa-solid fa-arrow-down-wide-short"></i>'

    }else{
        orderByUpload =  null
        document.querySelector(".UploadFilter").innerHTML = ''

    }
    localStorage.setItem("orderByUpload", orderByUpload)
    getData()
}
// change order status to be asc then desc then null
function changeOrderStatus(){
    // check other orders to be null
    orderByName = null
    orderByUpload = null
    orderValid = null
    localStorage.setItem("orderByName", orderByName)
    localStorage.setItem("orderByUpload", orderByUpload)
    localStorage.setItem("orderValid", orderValid)

    // Set NameFilter,UploadFilter,validFilter Empty
    document.querySelector(".NameFilter").innerHTML = ''
    document.querySelector(".UploadFilter").innerHTML = ''
    document.querySelector(".ValidFilter").innerHTML = ''

    if (orderStatus === null){
        orderStatus = 'asc'
        document.querySelector(".StatusFilter").innerHTML = '<i class="fa-solid fa-arrow-down-short-wide"></i>'

    }else if(orderStatus === 'asc'){
        orderStatus = 'desc'
        document.querySelector(".StatusFilter").innerHTML = '<i class="fa-solid fa-arrow-down-wide-short"></i>'
    }else{
        orderStatus =  null
        document.querySelector(".StatusFilter").innerHTML = ''
    }
    localStorage.setItem("orderStatus", orderStatus)
    getData()
}

// change order valid to be asc then desc then null
function changeOrderValid(){
    // check other orders to be null
    orderByName = null
    orderByUpload = null
    orderStatus = null
    localStorage.setItem("orderByName", orderByName)
    localStorage.setItem("orderByUpload", orderByUpload)
    localStorage.setItem("orderStatus", orderStatus)

    // Set NameFilter,UploadFilter,statusFilter Empty
    document.querySelector(".NameFilter").innerHTML = ''
    document.querySelector(".UploadFilter").innerHTML = ''
    document.querySelector(".StatusFilter").innerHTML = ''
    if (orderValid === null){
        orderValid = 'asc'
        document.querySelector(".ValidFilter").innerHTML = '<i class="fa-solid fa-arrow-down-short-wide"></i>'
    }else if(orderValid === 'asc'){
        orderValid = 'desc'
        document.querySelector(".ValidFilter").innerHTML = '<i class="fa-solid fa-arrow-down-wide-short"></i>'
    }else{
        orderValid =  null
        document.querySelector(".ValidFilter").innerHTML = ''
    }
    localStorage.setItem("orderValid", orderValid)
    getData()
}
// add date From Filter
async function addDateFromFilter(event){
    const val = event.value
    const filterTitle = document.querySelector(".AppliedFilters .FiltersTitle")
    const filter =  document.querySelector(".AppliedFilters .FromDateFilter")
    if(val){
        filter.querySelector(".value").innerHTML  = val
        filter.classList.remove('d-none')
        filters['fromDate'] = val
        localStorage.setItem("fromDateFilter", val)
        if (filterTitle.classList.contains('d-none')){
            filterTitle.classList.remove('d-none')
        }
    }else{
        filter.classList.add('d-none')
        // If all .filterSpan spans has d-none, set title to d-none
        const allFilters = document.querySelectorAll(".AppliedFilters .filterSpan")
        var allHidden = true
        allFilters.forEach((filter)=>{
            if (!filter.classList.contains('d-none')){
                allHidden = false
            }
        })
        filters['fromDate'] = null
        localStorage.removeItem("fromDateFilter")
        if (allHidden){
            filterTitle.classList.add('d-none')
        }
    }
}

// add date To Filter
async function addDateToFilter(event){
    const val = event.value
    const filterTitle = document.querySelector(".AppliedFilters .FiltersTitle")
    
    const filter =  document.querySelector(".AppliedFilters .ToDateFilter")
    if(val){
        filter.querySelector(".value").innerHTML  = val
        filters['toDate'] = val
        localStorage.setItem("toDateFilter", val)
        filter.classList.remove('d-none')
        if (filterTitle.classList.contains('d-none')){
            filterTitle.classList.remove('d-none')
        }
    }else{
        filter.classList.add('d-none')
        // If all .filterSpan spans has d-none, set title to d-none
        const allFilters = document.querySelectorAll(".AppliedFilters .filterSpan")
        var allHidden = true
        filters['toDate'] = null
        localStorage.removeItem("toDateFilter")
        allFilters.forEach((filter)=>{
            if (!filter.classList.contains('d-none')){
                allHidden = false
            }
        })
        if (allHidden){
            filterTitle.classList.add('d-none')
        }
    }
}

// add Form Type To Filter
async function addFormTypeFilter(event){
    const val = event.innerHTML
    console.log(val)
    const filterTitle = document.querySelector(".AppliedFilters .FiltersTitle")
    
    const filter =  document.querySelector(".AppliedFilters .FormTypeFilter")
    if(val){
        filter.querySelector(".value").innerHTML  = val
        filter.classList.remove('d-none')
        filters['formType'] = val
        localStorage.setItem("formTypeFilter", val)
        if (filterTitle.classList.contains('d-none')){
            filterTitle.classList.remove('d-none')
        }
    }else{
        filter.classList.add('d-none')
        // If all .filterSpan spans has d-none, set title to d-none
        const allFilters = document.querySelectorAll(".AppliedFilters .filterSpan")
        var allHidden = true
        filters['formType'] = null
        localStorage.removeItem("formTypeFilter")
        allFilters.forEach((filter)=>{
            if (!filter.classList.contains('d-none')){
                allHidden = false
            }
        })
        if (allHidden){
            filterTitle.classList.add('d-none')
        }
    }
    toggleExportButton()
}
async function getData(){


    // set to Be Loading
    if (!document.querySelector("#FilesTable").innerHTML){
        document.querySelector("#NotFoundForms").innerHTML ='Loading ...'
    }

    var orderValid = localStorage.getItem('orderValid') || null;

    // Check for Search 
    searchQuery = document.getElementById("FormsSearch").value
    document.querySelector("#paginationNav").style.display = 'flex'
    if (searchQuery){
        var endpoint = `forms_search_list?search_query=${searchQuery}&offset=${page?page-1:0}&limit=${limit}&filters=${JSON.stringify(filters)}`
        // document.querySelector("#paginationNav").style.display = 'none'
    
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
            const currentValue = res['selected']
            updateUI(formsList, totalCount,currentValue)

        }else if(response.status === 401){
            window.location.replace("/sign-in");
        }
    }else{
        socket.emit('get_forms', { limit: limit, offset: page?page-1:0,orderByName:orderByName,orderByUpload,orderByUpload,orderStatus,orderStatus,orderValid:orderValid,filters:filters });
        console.log("Getting Data")
        console.log(filters)
    }
    // KTFileManagerList.init();
    
    

};

// Delete Forms
async function deleteForms() {
    const checkboxes = document.querySelectorAll('.form-check-input-sub');
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
            socket.emit('get_forms', { limit: limit, offset: page?page-1:0,orderByName:orderByName,orderByUpload,orderByUpload,orderStatus,orderStatus,orderValid:orderValid,filters:filters });
            // document.getElementsByClassName('DownloadButtons')[1].classList.add('d-none');
            document.querySelector(".form-check-input-main").checked = false;
            
            document.querySelector(".NormalToolBar").classList.remove('d-none');

            document.querySelector(".CheckedToolBar").classList.add('d-none');

            document.querySelector(".dateExportForm").classList.remove('d-none');
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
    const checkboxes = document.querySelectorAll('.form-check-input-sub');
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
// async function ApplyFilters(fileType = 'xlsx') {
//     var fromValue = dateFromInput.value;
//     var toValue = dateToInput.value;
//     const formType = formTypeFilter.innerHTML

//     if (!toValue && fromValue){
//         toValue = new Date().toISOString().split('T')[0];
//     }
//     else if (!fromValue && toValue){
//         fromValue = toValue
//     }

//     try {
        
//         const response = await fetch(`${BackURL}/filtered-list?${fromValue?`fromDate=${fromValue}&`:''}${toValue?`toDate=${toValue}&`:''}${formType?`formType=${formType}&`:''}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 authorization: `Bearer ${localStorage.getItem('token')}`,
//             }
//         });

//         if (!response.ok) {
//             Swal.fire({
//                 text: "Error in Downloading Forms",
//                 icon: "error",
//                 buttonsStyling: false,
//                 confirmButtonText: "Ok, got it!",
//                 customClass: {
//                     confirmButton: "btn fw-bold btn-primary",
//                 }
//             });
//             return
//         }

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `forms.${fileType}`; // Set the downloaded file name
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//     } catch (err) {
//         console.error('Error during file download:', err);
//         alert('An error occurred while downloading the file.');
//     }
// }
async function ApplyFilters(fileType = 'xlsx') {
    getData()
}
function CheckAll(){
    var checkboxes = document.querySelectorAll('.form-check-input-sub');
    checkboxes.forEach((checkbox)=>{
        checkbox.click()
    }
    )
    handleCheckboxChange()
}
// Function to handle checkbox change events
function handleCheckboxChange() {

    var checkboxes = document.querySelectorAll('.form-check-input-sub');
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

function updateUI(formsList, totalCount,FilteredCount = null) {
    // Get Checked
    const checkboxes = document.querySelectorAll('.form-check-input-sub');
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
                            <input class="form-check-input form-check-input-sub " type="checkbox" value="${form.form_id}" ${checked.includes((form.form_id).toString()) ? 'checked':''} onChange="handleCheckboxChange()"/>
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
                        ${form.valid? 
                        '<span class="badge badge-light-success">Valid To Extract</span>'
                        :'<span class="badge badge-light-danger">Need Supervision</span>'}
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
    // Setting the Navbar Pages to Be Max 10 Pages Shown, and the Rest will be hidden
    // const totalPages = Math.ceil(totalCount / limit);
    // var pageNav =''
    // for (let i = 1; i <= totalPages; i++) {
    //     pageNav += `
    //         <li class="dt-paging-button page-item ${page == i || (!page && i==1) ? 'active' : ''}">
    //             <a class="page-link" aria-controls="kt_file_manager_list">${i}</a>
    //         </li>
    //     `
    // }

    const totalPages = Math.ceil((FilteredCount !==null?FilteredCount:totalCount) / limit);
    var pageNav = '';
    const maxVisiblePages = 10; // Number of visible pages before adding "..."
    const activePage = Number(page) || 1;
    if (activePage > totalPages && totalPages !== 0) {
        window.location.replace(`/forms?page=${1}`);
    }
    // Always show first 10 pages if active page is within first 6
    if (totalPages <= maxVisiblePages + 1) {
        for (let i = 1; i <= totalPages; i++) {
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == i ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list">${i}</a>
                </li>
            `;
        }
    } else {
        let startPage = Math.max(1, activePage - 5);
        let endPage = Math.min(totalPages, activePage + 5);
        // Always show first 10 pages if user is within first 6 pages
        if (activePage <= 6) {
            startPage = 2;
            endPage = maxVisiblePages;
        }

        // Always show last 10 pages if user is within last 6 pages
        if (activePage > totalPages - 6) {
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        }

        // Always show the First page
        // if (activePage > maxVisiblePages) {
            if (activePage < 7){
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == 1 ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list">1</a>
                </li>
            `;
            }
        // }

        // Add "..." if there's a gap before the last page
        if (activePage > 7) {
            pageNav += `<li class="dt-paging-button page-item disabled"><span class="page-link"><</span></li>`;
            // pageNav += `
            //     <li class="dt-paging-button page-item}">
            //         <a class="page-link" aria-controls="kt_file_manager_list">1</a>
            //     </li>
            // `;
        }

        

        // Render the first 10 pages or adjusted range
        for (let i = startPage; i <= endPage; i++) {
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == i ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list">${i}</a>
                </li>
            `;
        }

        // Add "..." if there's a gap before the last page
        if (endPage < totalPages - 1) {
            pageNav += `<li class="dt-paging-button page-item disabled"><span class="page-link">></span></li>`;
        }

        // Always show the last page
        if (endPage < totalPages) {
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == totalPages ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list">${totalPages}</a>
                </li>
            `;
        }
    }

    document.querySelector("#paginationNav").innerHTML = pageNav;
    document.querySelector("#kt_file_manager_items_counter").innerHTML = `${formsList.length} Forms`
    document.querySelector("#HeaderFormsCount").innerHTML = totalCount


    // Get the select element
    const pagingNavs = document.querySelectorAll('.dt-paging-button a');

    // Add an event listener to the select element
    pagingNavs.forEach((navButton)=>{
        navButton.addEventListener('click', (event) => {
            // Get the selected value
            const selectedPage = event.target.innerHTML;

            // Get the current URL
            const currentUrl = window.location.href;

            // Parse the URL to modify query parameters
            url.searchParams.set('page', selectedPage); // Set or update the "limit" parameter

            // Update the browser URL without reloading the page
            window.history.pushState({}, '', url);

            window.location.reload()
        })
    })
    if (FilteredCount !==null && FilteredCount !== totalCount){
        document.querySelector("#FilteredFormsContainer").classList.remove("d-none")
        document.querySelector("#FilteredFormsCount").innerHTML = `${FilteredCount} Forms`
    }else{
        if (!document.querySelector("#FilteredFormsContainer").classList.contains("d-none")){
            document.querySelector("#FilteredFormsContainer").classList.add("d-none")
        }
    }
}
function removeFiltersFromLocal(){
    localStorage.removeItem("fromDateFilter")
    localStorage.removeItem("toDateFilter")
    localStorage.removeItem("formTypeFilter")
    window.location.reload()
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
                    socket.emit('get_forms', { limit: limit, offset: page?page-1:0,orderByName:orderByName,orderByUpload,orderByUpload,orderStatus,orderStatus,orderValid:orderValid });
                    
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
    const formType = formTypeFilter.innerHTML
    // Enable the button if both dates are set; otherwise, disable it
    if ((fromValue && toValue ) || formType) {
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
    url.searchParams.set('search_query', event.currentTarget.value);
    window.history.pushState({}, '', url);
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
    if (!searchQuery){

        socket.emit('get_forms', { limit: limit, offset: page?page-1:0,orderByName:orderByName,orderByUpload,orderByUpload,orderStatus,orderStatus,orderValid:orderValid,filters:filters });
    }
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
    updateUI(data.forms,data.total,data.selected);
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});



