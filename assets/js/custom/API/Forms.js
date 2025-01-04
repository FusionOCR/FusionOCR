
// const BackURL = "https://fusionocr.com/api"
const BackURL = "https://fusionocr.com/api"
async function getData(){
    const response = await fetch(`${BackURL}/forms_list?limit=100`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.ok) {
        const formsList = await response.json();
        if (formsList.length > 0 ){

            document.querySelector("#FilesTable").innerHTML =''
        }
        for (let i = 0; i < formsList.length; i++) {
            const form = formsList[i];
            var statusStyle = ''
            if (form.status === 'Checking'){
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
            console.log(form)
            const link = 
            (form.status !== "Proccessing" && form.status !== "Pending")?
                                `<a href="./forms/document" id="${form.form_id}" onClick="localStorage.setItem('activeDoc',${form.form_id})" class="text-gray-800 text-hover-primary">${form.name}</a>`
                            :
                                `<a  id="${form.form_id}" onClick="localStorage.setItem('activeDoc',${form.form_id})" class="text-gray-800 text-hover-primary">${form.name}</a>`
            const uploadDate = new Date(form.uploaded_at)
            const formattedDate = `${uploadDate.getDate()} ${uploadDate.toLocaleString('default', { month: 'short' })} ${uploadDate.getFullYear()}, ${uploadDate.getHours() % 12 || 12}:${uploadDate.getMinutes().toString().padStart(2, '0')} ${uploadDate.getHours() >= 12 ? 'PM' : 'AM'}`;

            const formDiv = `
                    <tr>
                        <td>
                            
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
                        <td></td>
                        <td>${formattedDate}</td>
                        <td class="text-start">
                            <span class="badge ${statusStyle}">${form.status}</span>

                        </td>
                        <td class="text-end" data-kt-filemanager-table="action_dropdown">
                            <div class="d-flex justify-content-end">
                                
                                <!--begin::More-->
                                
                                <!--end::More-->
                            </div>
                        </td>
                    </tr>
                    `
            document.querySelector("#FilesTable").innerHTML += formDiv;
        }
        document.querySelector("#kt_file_manager_items_counter").innerHTML = `${formsList.length} Items`
        // document.querySelector("#Demo").remove()

    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
}

{/*
    <div class="form-check form-check-sm form-check-custom form-check-solid">
                                <input class="form-check-input" type="checkbox" value="1" />
                            </div>
    */}
{/*
    <div class="ms-2">
                                    <button type="button" class="btn btn-sm btn-icon btn-light btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                        <i class="ki-duotone ki-dots-square fs-5 m-0">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                            <span class="path4"></span>
                                        </i>
                                    </button>
                                    <!--begin::Menu-->
                                   <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4" data-kt-menu="true">
                                    <!--begin::Menu item-->
                                    <div class="menu-item px-3">
                                        <a href="#" class="menu-link px-3">Download File</a>
                                    </div>
                                    <!--end::Menu item-->
                                    <!--begin::Menu item-->
                                    <div class="menu-item px-3">
                                        <a href="#" class="menu-link text-danger px-3" data-kt-filemanager-table-filter="delete_row">Delete</a>
                                    </div>
                                    <!--end::Menu item-->
                                    </div> 
                                    <!--end::Menu-->
                                </div>  
    */}
fileInput = document.getElementById('kt_file_manager_upload_file');
// uploadingButton.style.display = 'none';
fileInput.addEventListener('change', async () => {
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

        const response = await fetch(`${BackURL}/upload`, {
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
            // document.getElementById('ResFName').value = response.data["file_id"].first_name;
            // console.log(response.data)
            // console.log(response)
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
getData()
setInterval(getData, 15000);



