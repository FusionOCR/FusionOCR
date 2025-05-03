
// Check Token For Login
fetch(`${BackURL}/user/token-validate`, {
    method: 'GET',
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
}).then((response) => {
    if(response.status === 401){
        window.location.replace("/sign-in");
    }
})


function loadFromLocalStorage(){
    // Input [Names]: lname, fname, sex:malle-female-other, date_of_birth, address, city, DOS, telephone, test_panels, tests
    document.querySelector('input[name="patientName"]').value = localStorage.getItem('PatientName') ==='-' ? '' : localStorage.getItem('PatientName')
    document.querySelector('input[name="patientID"]').value = localStorage.getItem('PatientID') === '-' ? '' : localStorage.getItem('PatientID')
    document.querySelector('input[name="ClientID"]').value = localStorage.getItem('ClientID') === '-' ? '' : localStorage.getItem('ClientID')

    document.querySelector('select[name=sex').value = localStorage.getItem('PatientGender').toLowerCase()
    document.querySelector('input[name="date_of_birth"]').value = localStorage.getItem('PatientDOB') === '-' ? '' : localStorage.getItem('PatientDOB')
    document.querySelector('input[name="address"]').value = localStorage.getItem('PatientAddress') === '-' ? '' : localStorage.getItem('PatientAddress')
    document.querySelector('input[name="city"]').value = localStorage.getItem('PatientCity') === '-' ? '' : localStorage.getItem('PatientCity')
    document.querySelector('input[name="DOS"]').value = localStorage.getItem('PatientDOS') === '-' ? '' : localStorage.getItem('PatientDOS')
    document.querySelector('input[name="telephone"]').value = localStorage.getItem('PatientMobile') === '-' ? '' : localStorage.getItem('PatientMobile')
    document.querySelector('input[name="test_panels"]').value = localStorage.getItem('PatientTestPanels') === '-' ? '' : localStorage.getItem('PatientTestPanels')
    document.querySelector('input[name="Insurance"]').value = localStorage.getItem('PatientInsurance') === '-' ? '' : localStorage.getItem('PatientInsurance')
    document.querySelector('input[name="InsurancePolicy"]').value = localStorage.getItem('PatientPolicy') === '-' ? '' : localStorage.getItem('PatientPolicy')
    document.querySelector('input[name="Insurance2"]').value = localStorage.getItem('PatientInsurance2') === '-' ? '' : localStorage.getItem('PatientInsurance2')
    document.querySelector('input[name="InsurancePolicy2"]').value = localStorage.getItem('PatientPolicy2') === '-' ? '' : localStorage.getItem('PatientPolicy2')
    document.querySelector('input[name="test_requested"]').value = localStorage.getItem('PatientTestRequested') === '-' ? '' : localStorage.getItem('PatientTestRequested')
    document.querySelector('input[name="canser_markers"]').value = localStorage.getItem('PatientCanser_Markers') === '-' ? '' : localStorage.getItem('PatientCanser_Markers')
    document.querySelector('input[name="microbiology"]').value = localStorage.getItem('PatientMicroBiology') === '-' ? '' : localStorage.getItem('PatientMicroBiology')
    document.querySelector('input[name="covid_19_tests"]').value = localStorage.getItem('PatientCovid_19_Tests') === '-' ? '' : localStorage.getItem('PatientCovid_19_Tests')
    document.querySelector('input[name="gynecology"]').value = localStorage.getItem('PatientGynecology') === '-' ? '' : localStorage.getItem('PatientGynecology')
    document.querySelector('input[name="diagnosis"]').value = localStorage.getItem('PatientDiagnosis') === '-' ? '' : localStorage.getItem('PatientDiagnosis')
    
    document.querySelector('input[name="Fasting"]').checked = localStorage.getItem('PatientFasting') === 'Checked'
    document.querySelector('input[name="Stat"]').checked = localStorage.getItem('PatientStat') === 'Checked' 
    

    document.querySelector('#FormNameInput').value = localStorage.getItem('FormName')
    document.querySelector('#FormStatus').innerHTML = localStorage.getItem('FormStatus')
    document.querySelector('#FormDate').innerHTML = localStorage.getItem('FormDate')
    // if date is 08/29/97, then it should be 1997-08-29
    if (localStorage.getItem('PatientDOB').length > 8){
        document.querySelector('input[name="date_of_birth"]').value = localStorage.getItem('PatientDOB')

    }else{
        const dob = localStorage.getItem('PatientDOB').split('/')
        if (dob[2] <= 24){
        document.querySelector('input[name="date_of_birth"]').value = `20${dob[2]}-${dob[0]}-${dob[1]}`
        }else{
        document.querySelector('input[name="date_of_birth"]').value = `19${dob[2]}-${dob[0]}-${dob[1]}`
        }
         
    }
    
}

// Send to The API after Submit the Edited Input
function SubmitEditedForm(e){
    e.preventDefault()
    e.currentTarget.disabled = true
    const token = localStorage.getItem('token')    
    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to extract query parameters
    const urlParams = new URLSearchParams(new URL(currentUrl).search);

    // Get the value of the "id" parameter
    const formID = urlParams.get('id');
    const data = {
        form_id: formID,
        patient_name: document.querySelector('input[name="patientName"]').value,
        patient_id: document.querySelector('input[name="patientID"]').value,
        client_id: document.querySelector('input[name="ClientID"]').value,
        gender: document.querySelector('select[name]').value,
        date_of_birth: document.querySelector('input[name="date_of_birth"]').value,
        address: document.querySelector('input[name="address"]').value,
        city: document.querySelector('input[name="city"]').value,
        dos: document.querySelector('input[name="DOS"]').value,
        mobile_number: document.querySelector('input[name="telephone"]').value,
        insurance: document.querySelector('input[name="Insurance"]').value,
        insurance_policy: document.querySelector('input[name="InsurancePolicy"]').value,
        insurance_2: document.querySelector('input[name="Insurance2"]').value,
        insurance_policy_2: document.querySelector('input[name="InsurancePolicy2"]').value,
        fasting: document.querySelector('input[name="Fasting"]').checked,
        stat: document.querySelector('input[name="Stat"]').checked,
        test_panels: document.querySelector('input[name="test_panels"]').value,
        test_requested: document.querySelector('input[name="test_requested"]').value,
        canser_markers: document.querySelector('input[name="canser_markers"]').value,
        microbiology: document.querySelector('input[name="microbiology"]').value,
        covid_19_tests: document.querySelector('input[name="covid_19_tests"]').value,
        gynecology: document.querySelector('input[name="gynecology"]').value,
        diagnosis: document.querySelector('input[name="diagnosis"]').value
    }
    console.log(data)
    const f = new FormData()
    
    fetch(`${BackURL}/form`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Failed to update the patient info");
    })
    .then((data) => {
        localStorage.removeItem('PatientName')
        localStorage.removeItem('PatientGender')
        localStorage.removeItem('PatientDOB')
        localStorage.removeItem('PatientAddress')
        localStorage.removeItem('PatientCity')
        localStorage.removeItem('PatientDOS')
        localStorage.removeItem('PatientMobile')
        localStorage.removeItem('PatientTestPanels')
        localStorage.removeItem('PatientTestRequested')
            // for inputs canser_markers, microbiology, covid19_tests, gynecology

        localStorage.removeItem('PatientCanser_Markers')
        localStorage.removeItem('PatientMicroBiology')
        localStorage.removeItem('PatientCovid_19_Tests')
        localStorage.removeItem('PatientGynecology')
        localStorage.removeItem('PatientDiagnosis')
        localStorage.removeItem('FormName')
        localStorage.removeItem('FormStatus')
        localStorage.removeItem('FormDate')
        window.location.replace(`/forms/document/?id=${formID}`);
    })
    .catch((error) => {
        console.error(error);
        e.currentTarget.disabled = false

    });
}
function DiscardEdits(e){
    e.preventDefault()
    const token = localStorage.getItem('token')    
    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to extract query parameters
    const urlParams = new URLSearchParams(new URL(currentUrl).search);

    // Get the value of the "id" parameter
    const formID = urlParams.get('id');
    e.currentTarget.disabled = true
    localStorage.removeItem('PatientName')
    localStorage.removeItem('PatientGender')
    localStorage.removeItem('PatientDOB')
    localStorage.removeItem('PatientAddress')
    localStorage.removeItem('PatientCity')
    localStorage.removeItem('PatientDOS')
    localStorage.removeItem('PatientMobile')
    localStorage.removeItem('PatientTestPanels')
    localStorage.removeItem('PatientTestRequested')
    localStorage.removeItem('FormName')
    localStorage.removeItem('FormStatus')
    localStorage.removeItem('FormDate')
    window.location.href = `/forms/document/?id=${formID}`;
}

// send to rename Form with the Value of #FormNameInput 
function renameForm(event){
    event.preventDefault()
    const token = localStorage.getItem('token')
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const formID = urlParams.get('id');
    const data = {
        form_id: formID,
        form_name: document.querySelector('#FormNameInput').value
    }
    fetch(`${BackURL}/rename-form`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(async (response) => {
        if (response.ok) {
            Swal.fire({
                text: "Document Name Changed Successfully",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                }
            })
        }else{
            const errorMessage =await  response.json()
            Swal.fire({
                text: "Failed to update the document name, "+errorMessage.message,
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                }
            })
        }
    })
    .then((data) => {
        localStorage.setItem('FormName', document.querySelector('#FormNameInput').value)
        document.querySelector('#FormNameInput').value = localStorage.getItem('FormName')
    })
    .catch((error) => {
        console.error(error);
    });
}

loadFromLocalStorage()