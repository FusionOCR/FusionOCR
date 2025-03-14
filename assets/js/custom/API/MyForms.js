async function getData(){
    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to extract query parameters
    const urlParams = new URLSearchParams(new URL(currentUrl).search);

    // Get the value of the "page" parameter
    const page = urlParams.get('page');

    // set to Be Loading
    if (!document.querySelector("#FilesTable").innerHTML){
        document.querySelector("#NotFoundForms").innerHTML ='Loading ...'
    }

    // Check for Search 
    const searchQuery = document.getElementById("FormsSearch").value
    var endpoint = `my_forms_list?user_id=${localStorage.getItem('id')}&limit=10&offset=${page?page-1:0}`
    document.querySelector("#paginationNav").style.display = 'flex'

    if (searchQuery){
        var endpoint = `my_forms_search_list?user_id=${localStorage.getItem('id')}&search_query=${searchQuery}&offset=${page?page-1:0}`
        document.querySelector("#paginationNav").style.display = 'none'
    }
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
                            <!-- <div class="form-check form-check-sm form-check-custom form-check-solid">
                                <input class="form-check-input" type="checkbox" value="1" />
                            </div> -->
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

    const totalPages = Math.ceil(totalCount / 10);
    var pageNav = '';
    const maxVisiblePages = 10; // Number of visible pages before adding "..."
    const activePage = Number(page) || 1;

    // Always show first 10 pages if active page is within first 6
    if (totalPages <= maxVisiblePages + 1) {
        for (let i = 1; i <= totalPages; i++) {
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == i ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list" href="/forms/myforms/?page=${i}">${i}</a>
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
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == 1 ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list" href="/forms/myforms/?page=${1}">1</a>
                </li>
            `;
        // }

        // Add "..." if there's a gap before the last page
        if (activePage > 7) {
            pageNav += `<li class="dt-paging-button page-item disabled"><span class="page-link">...</span></li>`;
        }

        

        // Render the first 10 pages or adjusted range
        for (let i = startPage; i <= endPage; i++) {
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == i ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list" href="/forms/myforms/?page=${i}">${i}</a>
                </li>
            `;
        }

        // Add "..." if there's a gap before the last page
        if (endPage < totalPages - 1) {
            pageNav += `<li class="dt-paging-button page-item disabled"><span class="page-link">...</span></li>`;
        }

        // Always show the last page
        if (endPage < totalPages) {
            pageNav += `
                <li class="dt-paging-button page-item ${activePage == totalPages ? 'active' : ''}">
                    <a class="page-link" aria-controls="kt_file_manager_list" href="/forms/myforms/?page=${totalPages}">${totalPages}</a>
                </li>
            `;
        }
    }
        document.querySelector("#paginationNav").innerHTML = pageNav;
        document.querySelector("#kt_file_manager_items_counter").innerHTML = `total ${totalCount} Forms`
        document.querySelector("#HeaderFormsCount").innerHTML = totalCount
        
        KTFileManagerList.reload()
        // KTFileManagerList.init();
        // const filterSearch = document.querySelector('[data-kt-filemanager-table-filter="search"]')
        // filterSearch.value = filterSearch.value+""

        // document.querySelector("#Demo").remove()

    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
    // KTFileManagerList.init();
    
    

};
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
        

    }
});

document.getElementById("FormsSearch")?.addEventListener("keyup", async function(event) {
    console.log(event.currentTarget.value)
    getData()
})
getData()
setInterval(getData, 20000);






