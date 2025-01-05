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

    // if (file.type !== 'application/pdf') {
    //     alert('Please select a valid PDF document.');
    //     return;
    // }
    if (file.type !== 'image/png' &&file.type !== 'application/pdf') {
        alert('Please select a valid PNG or PDF document.');
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

        const response = await fetch(`${BackURL}/upload?user_id=${localStorage.getItem("id")}`, {
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
            // {
            // 'ComprehensiveMetabolicPanel': '', 'Covid19': '',
            //  'FluABandRSVTest': '', 'GastroPathogenPanel': '', 'GroupAStrip': '', 'LipidPanel': '',
            //  'Patient_first_name': 'Karen', 'RespiratoryPathoenPanel': '', 'STIEssential': '', 'UTIWithABSBYMicro': '',
            //  'UTIWithGeneResistanceByPCR': '', 'WoundInfectionWithABSByMicro': '',
            //  'WoundInfectionWithGeneResistanceByPCR': ''}
            if(json){
                // DOM Manipulation
                document.getElementById('ResFName').innerText = json.Patient_first_name || ' - ';
                document.getElementById('ResLName').innerText = json.Patient_last_name || ' - ';
                document.getElementById('ResBithDate').innerText = json.BithName || ' - ';
                document.getElementById('ResAddress').innerText = json.Address || ' - ';
                document.getElementById('ResCity').innerText = json.city || ' - ';
                document.getElementById('ResGender').innerText = json.Male?"Male": (json.Female?"Female": "un-Detected");

                const params = [
                    "AnemiaProfile",
                    "ArthritisProfile",
                    "B12FOLATEDeficiency",
                    "BasicMetabolicPanel",
                    "BasicMetabolicPanellonizeCalcium",
                    "BasicMetabolicProfile",
                    "ComprehensiveMetabolicPanel",
                    "Covid19",
                    "DiabeticProfile",
                    "Electrolytes",
                    "ElectrolytesPanel",
                    "FluABandRSVTest",
                    "GastroPathogenPanel",
                    "GroupAStrip",
                    "HepaticFunction",
                    "HepaticFunctionPanel",
                    "HepatitisPanel",
                    "LipidPanel",
                    "NMR_LIPOPROFILE",
                    "ProstateHealth",
                    "Prot_elect_ph_spep",
                    "PSATotal_free",
                    "QuantiFeron-TB_Gold_plus",
                    "RenalFucntionPanel",
                    "RespiratoryPathoenPanel",
                    "STIEssential",
                    "Testosterone-free-total",
                    "ThyroidProfile",
                    "UTIWithABSBYMicro",
                    "UTIWithGeneResistanceByPCR",
                    "WoundinfectionWithABSByMicro",
                    "WoundInfectionWithGeneResistanceByPCR"
                ]
                
                var checkedParams= []
                for (let i = 0; i < params.length; i++) {
                    if(json[params[i]]){
                        // Check Dublicated
                        if (params[i] === "HepaticFunctionPanel" && checkedParams.includes("HepaticFunction")) {
                            continue;
                        }
                        else if (params[i] === "ElectrolytesPanel" && checkedParams.includes("Electrolytes")) {
                            continue;
                        }else if (params[i] === "BasicMetabolicProfile" && checkedParams.includes("BasicMetabolicPanel")) {
                            continue;
                        }
                        checkedParams.push(params[i])
                    }
                }
                var addeddHTML = "  "
                if (json['MobileNumber']){
                    addeddHTML += `
                    <!-- Last Name -->
                    <div class="row mb-7">
                        <label class="col-lg-4 fw-semibold text-muted">MobileNumber</label>
                        <div class="col-lg-8">
                            <span class="fw-bold fs-6 text-gray-800">${json['MobileNumber']}</span>
                        </div>
                    </div>
                    `
                }
                // SpecimenCollectionDate
                if (json['SpecimenCollectionDate']){
                    addeddHTML += `
                    <!-- Last Name -->
                    <div class="row mb-7">
                        <label class="col-lg-4 fw-semibold text-muted">Specimen Collection Date</label>
                        <div class="col-lg-8">
                            <span class="fw-bold fs-6 text-gray-800">${json['SpecimenCollectionDate']}</span>
                        </div>
                    </div>
                    `
                }

                document.getElementById('ResTestPanel').innerText = checkedParams.length? checkedParams.join(",") : 'No Checked Paramters Found';
                
                // document.getElementById('ResElse').innerText = json.else? json.else :' - ';
                // add to addeddHTML to #ChangableParams
                document.getElementById('ChangableParams').innerHTML += addeddHTML;


            }else{
                alert('File upload failed. (Empty Response)');
            }

        }else if(response.status === 401){
            window.location.replace("/sign-in");
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