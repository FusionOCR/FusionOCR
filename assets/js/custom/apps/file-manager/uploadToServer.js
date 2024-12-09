const fileInput = document.getElementById('fileInput');
const fileInputLabel = document.getElementById('FileInputLabel');
const uploadButton = document.getElementById('UploadMassage');
const uploadingButton = document.getElementById('UploadingMassage');
const RefreshPage = document.getElementById('RefreshPage');

document.addEventListener("DOMContentLoaded", () => {
    const fileInputLabel = document.querySelector("#FileInputLabel");
    if (fileInputLabel) {
        fileInputLabel.style.opacity = 1;
        fileInputLabel.style.pointerEvents = "all";
    }
});


// uploadingButton.style.display = 'none';
fileInput.addEventListener('change', async () => {
    console.log("Starting to upload file...");
    if (!fileInput.files[0]) return; // No file selected
    const file = fileInput.files[0];

    if (file.type !== 'application/pdf') {
        alert('Please select a valid PDF document.');
        return;
    }

    // fileInput.classList.add('disabled-opacity');
    // fileInput.disabled = true;
    uploadingButton.style.display = 'inline-block';
    uploadButton.style.display = 'none';
    fileInputLabel.style.disabled = true;
    fileInputLabel.style.opacity = 0.5;
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://fusionocr.com/api/upload', {
            method: 'POST',
            body: formData,
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
            if(json){
                document.getElementById('ResFName').innerText = json.first_name;
                document.getElementById('ResLName').innerText = json.last_name;
                document.getElementById('ResSex').innerText = json.sex? json.sex :' - ';
                document.getElementById('ResDOB').innerText = json.dob? json.dob :' - ';
                document.getElementById('ResAddress').innerText = json.address? json.address :' - ';
                document.getElementById('ResCity').innerText = json.city? json.city :' - ';
                document.getElementById('ResTestPanelSelected').innerText = json.test_panels_selected? json.test_panels_selected :' - ';
                document.getElementById('ResTestsSelected').innerText = json.tests_selected? json.tests_selected :' - ';
                // document.getElementById('ResState').innerText = json.state? json.state :' - ';
                // document.getElementById('ResZip').innerText = json.zip? json.zip :' - ';
                // document.getElementById('ResPhone').innerText = json.phone? json.phone :' - ';
                // document.getElementById('ResInsurance').innerText = json.insurance? json.insurance :' - ';
                // document.getElementById('ResInsuranceID').innerText = json.insurance_id? json.insurance_id :' - ';
                // document.getElementById('ResClient').innerText = json.client? json.client :' - ';
                // document.getElementById('ResCollection').innerText = json.collection? json.collection :' - ';
                // document.getElementById('ResTestReq').innerText = json.test_req? json.test_req :' - ';
                // document.getElementById('ResDiagnoseCode').innerText = json.diagnose_code? json.diagnose_code :' - ';
                document.getElementById('ResElse').innerText = json.else? json.else :' - ';


            }else{
                alert('File upload failed. (Empty Response)');
            }

        } else {
            alert('File upload failed.');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading.');
    } finally {
        // uploadButton.classList.remove('disabled-opacity');
        // uploadButton.disabled = false;
        uploadingButton.style.display = 'none';
        fileInputLabel.style.display = 'none';
        // uploadButton.style.display = 'inline-block';
        RefreshPage.style.display = 'inline-block';
        // fileInput.style.disabled = false;
    fileInputLabel.style.opacity = 1;


    }
});

document.getElementById("RefreshPage").addEventListener("click", function() {
    location.reload(); // Refreshes the current page
});