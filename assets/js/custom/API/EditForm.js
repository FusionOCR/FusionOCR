const BackURL = "http://localhost:5000"
function loadFromLocalStorage(){
    // Input [Names]: lname, fname, sex:malle-female-other, date_of_birth, address, city, DOS, telephone, test_panels, tests
    document.querySelector('input[name="patientName"]').value = localStorage.getItem('PatientName')
    document.querySelector('select[name=sex').value = localStorage.getItem('PatientGender').toLowerCase()
    document.querySelector('input[name="date_of_birth"]').value = localStorage.getItem('PatientDOB')
    document.querySelector('input[name="address"]').value = localStorage.getItem('PatientAddress')
    document.querySelector('input[name="city"]').value = localStorage.getItem('PatientCity')
    document.querySelector('input[name="DOS"]').value = localStorage.getItem('PatientDOS')
    document.querySelector('input[name="telephone"]').value = localStorage.getItem('PatientMobile')
    document.querySelector('input[name="test_panels"]').value = localStorage.getItem('PatientTestPanels')
    document.querySelector('input[name="tests"]').value = localStorage.getItem('PatientTests')
    document.querySelector('#FormName').innerHTML = localStorage.getItem('FormName')
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
    const data = {
        form_id: localStorage.getItem('activeDoc'),
        patient_name: document.querySelector('input[name="patientName"]').value,
        gender: document.querySelector('select[name]').value,
        date_of_birth: document.querySelector('input[name="date_of_birth"]').value,
        address: document.querySelector('input[name="address"]').value,
        city: document.querySelector('input[name="city"]').value,
        dos: document.querySelector('input[name="DOS"]').value,
        mobile_number: document.querySelector('input[name="telephone"]').value,
        test_panels: document.querySelector('input[name="test_panels"]').value,
        test_requested: document.querySelector('input[name="tests"]').value,
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
        localStorage.removeItem('PatientTests')
        localStorage.removeItem('FormName')
        localStorage.removeItem('FormStatus')
        localStorage.removeItem('FormDate')
        window.location.replace("/forms/document/");
    })
    .catch((error) => {
        console.error(error);
        e.currentTarget.disabled = false

    });
}
function DiscardEdits(e){
    e.preventDefault()
    e.currentTarget.disabled = true
    localStorage.removeItem('PatientName')
    localStorage.removeItem('PatientGender')
    localStorage.removeItem('PatientDOB')
    localStorage.removeItem('PatientAddress')
    localStorage.removeItem('PatientCity')
    localStorage.removeItem('PatientDOS')
    localStorage.removeItem('PatientMobile')
    localStorage.removeItem('PatientTestPanels')
    localStorage.removeItem('PatientTests')
    localStorage.removeItem('FormName')
    localStorage.removeItem('FormStatus')
    localStorage.removeItem('FormDate')
    window.location.replace("/forms/document/");
}

loadFromLocalStorage()