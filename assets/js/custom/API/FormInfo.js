
// const BackURL = "https://fusionocr.com/api"
const BackURL = "https://fusionocr.com/api"

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

        document.getElementById("DocumentReview").innerHTML = `<embed src="${BackURL}/file/${formInfo.file_name}" type="application/pdf" width="100%" height="600px" />`
    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
}

getData()