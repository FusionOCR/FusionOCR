
// const BackURL = "http://localhost:5000"
const BackURL = "http://localhost:5000"

async function getData(){
    const formID = localStorage.getItem('activeDoc')
    const response = await fetch(`${BackURL}/form?form_id=${formID}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.ok) {
        const formInfo = await response.json();
        const details = formInfo.details
        document.getElementById('FormName').innerHTML = formInfo.name
        document.getElementById('FormStatus').innerHTML = formInfo.status
        // Date in From of from Tue, 31 Dec 2024 06:09:51 GMT to  28/12/2024
        const date = new Date(formInfo.uploaded_at)
        const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        document.getElementById('FormDate').innerHTML = formattedDate


        document.getElementById('PatientName').innerHTML = details.patient_name
        document.getElementById('PatientGender').innerHTML = details.gender
        document.getElementById('PatientDOB').innerHTML = details.date_of_birth
        document.getElementById('PatientAddress').innerHTML = details.address
        document.getElementById('PatientCity').innerHTML = details.city
        document.getElementById('PatientDOS').innerHTML = details.dos
        document.getElementById('PatientMobile').innerHTML = details.mobile_number
        document.getElementById('PatientTestPanels').innerHTML = details.test_panels

        // document.getElementById("DocumentReview").innerHTML = `<embed src="${BackURL}/file/${formInfo.file_name}" type="application/pdf" width="100%" height="600px" />`
    
    fetch(`${BackURL}/file/${formInfo.file_name}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((response) => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error("Failed to fetch the PDF");
        })
        .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        // const embed = document.getElementById("DocumentReview");
        // embed = 
        // embed.src = objectUrl;
        document.getElementById("DocumentReview").innerHTML = `<embed src="${objectUrl}" type="application/pdf" width="100%" height="600px" />`
        })
        .catch((error) => {
            document.getElementById("DocumentReview").innerHTML = "Cannot load the PDF Preview";
            console.error(error);
        });
    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
}
function StorePatientInfo(){
    // Store Patient Info in Local Storage
    const PatientName = document.getElementById('PatientName').innerHTML
    const PatientGender = document.getElementById('PatientGender').innerHTML
    const PatientDOB = document.getElementById('PatientDOB').innerHTML
    const PatientAddress = document.getElementById('PatientAddress').innerHTML
    const PatientCity = document.getElementById('PatientCity').innerHTML
    const PatientDOS = document.getElementById('PatientDOS').innerHTML
    const PatientMobile = document.getElementById('PatientMobile').innerHTML
    const PatientTestPanels = document.getElementById('PatientTestPanels').innerHTML
    const PatientTests = document.getElementById('PatientTests').innerHTML

    // Form name, status Date
    const FormName = document.getElementById('FormName').innerHTML
    const FormStatus = document.getElementById('FormStatus').innerHTML
    const FormDate = document.getElementById('FormDate').innerHTML

    localStorage.setItem('FormName', FormName)
    localStorage.setItem('FormStatus', FormStatus)
    localStorage.setItem('FormDate', FormDate)

    localStorage.setItem('PatientName', PatientName)
    localStorage.setItem('PatientGender', PatientGender)
    localStorage.setItem('PatientDOB', PatientDOB)
    localStorage.setItem('PatientAddress', PatientAddress)
    localStorage.setItem('PatientCity', PatientCity)
    localStorage.setItem('PatientDOS', PatientDOS)
    localStorage.setItem('PatientMobile', PatientMobile)
    localStorage.setItem('PatientTestPanels', PatientTestPanels)
    localStorage.setItem('PatientTests', PatientTests)
}
getData()

