async function getData(){
    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to extract query parameters
    const urlParams = new URLSearchParams(new URL(currentUrl).search);

    // Get the value of the "id" parameter
    const formID = urlParams.get('id');
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
        const formattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        document.getElementById('FormDate').innerHTML = formattedDate


        document.getElementById('PatientName').innerHTML = details.patient_name?details.patient_name:'-'
        document.getElementById('PatientID').innerHTML = details.patient_id?details.patient_id:'-'
        document.getElementById('PatientGender').innerHTML = details.gender?details.gender:'-'  
        document.getElementById('PatientDOB').innerHTML = details.date_of_birth?details.date_of_birth:'-'
        document.getElementById('PatientAddress').innerHTML = details.address?details.address:'-'
        document.getElementById('PatientCity').innerHTML = details.city?details.city:'-'
        document.getElementById('PatientDOS').innerHTML = details.dos?details.dos:'-'
        document.getElementById('PatientMobile').innerHTML = details.mobile_number?details.mobile_number:'-'
        document.getElementById('PatientInsurance').innerHTML = details.insurance?details.insurance:'-'
        document.getElementById('PatientInsurance2').innerHTML = details.insurance_2?details.insurance_2:'-'
        document.getElementById('PatientPolicy').innerHTML = details.insurance_policy?details.insurance_policy:'-'
        document.getElementById('PatientPolicy2').innerHTML = details.insurance_policy_2?details.insurance_policy_2:'-'
        document.getElementById('PatientFasting').innerHTML = details.fasting?"Checked":'Not Checked'
        document.getElementById('PatientStat').innerHTML = details.stat?"Checked":'Not Checked'
        document.getElementById('PatientDiagnosis').innerHTML = details.diagnosis?details.diagnosis:'No Diagnosis Detected'
        if(formInfo.form_type === "accu_reference"){
            document.getElementById('PatientTestRequested').innerHTML = details.test_requested?details.test_requested:'No Checked Boxes Detected'
            document.getElementById('PatientTestPanels').innerHTML = details.test_panels?details.test_panels:'No Checked Boxes Detected'
            document.getElementById('PatientCanser_Markers').innerHTML = details.canser_markers?details.canser_markers:'No Checked Boxes Detected'
            document.getElementById('PatientMicroBiology').innerHTML = details.microbiology?details.microbiology:'No Checked Boxes Detected'
            document.getElementById('PatientCovid_19_Tests').innerHTML = details.covid_19_tests?details.covid_19_tests:'No Checked Boxes Detected'
            document.getElementById('PatientGynecology').innerHTML = details.gynecology?details.gynecology:'No Checked Boxes Detected'
    
        } else{
            document.getElementById('PatientTestRequested').innerHTML = details.test_requested?details.test_requested:'No Test Detected'
            document.getElementById('PatientTestPanelsContainer').style.display = "none"
            document.getElementById('PatientCanser_MarkersContainer').style.display = "none"
            document.getElementById('PatientMicroBiologyContainer').style.display = "none"
            document.getElementById('PatientCovid_19_TestsContainer').style.display = "none"
            document.getElementById('PatientGynecologyContainer').style.display = "none"

        }       
        
        // document.getElementById("DocumentReview").innerHTML = `<embed src="${BackURL}/file/${formInfo.file_name}" type="application/pdf" width="100%" height="600px" />`
        document.getElementById('EditButton').href = `/forms/document/edit/?id=${formID}`
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
        document.getElementById("DocumentReview").innerHTML = `<embed src="${objectUrl}" type="application/pdf" width="100%" height="600px" />`
        })
        .catch((error) => {
            document.getElementById("DocumentReview").innerHTML = "Cannot load the PDF Preview";
            console.error(error);
        });
    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }else{
        const error = await response.json();
        Swal.fire({
            text: "Error Getting Document Info, "+error.message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn fw-bold btn-primary",
            }
        })
    }
}
function StorePatientInfo(){
    // Store Patient Info in Local Storage
    const PatientName = document.getElementById('PatientName').innerHTML
    const PatientID  = document.getElementById('PatientID').innerHTML
    const PatientGender = document.getElementById('PatientGender').innerHTML
    const PatientDOB = document.getElementById('PatientDOB').innerHTML
    const PatientAddress = document.getElementById('PatientAddress').innerHTML
    const PatientCity = document.getElementById('PatientCity').innerHTML
    const PatientDOS = document.getElementById('PatientDOS').innerHTML
    const PatientMobile = document.getElementById('PatientMobile').innerHTML
    const PatientInsurance = document.getElementById('PatientInsurance').innerHTML
    const PatientInsurance2 = document.getElementById('PatientInsurance2').innerHTML
    const PatientPolicy = document.getElementById('PatientPolicy').innerHTML
    const PatientPolicy2 = document.getElementById('PatientPolicy2').innerHTML
    const PatientFasting = document.getElementById('PatientFasting').innerHTML
    const PatientStat = document.getElementById('PatientStat').innerHTML
    const PatientTestPanels = document.getElementById('PatientTestPanels').innerHTML
    const PatientTests = document.getElementById('PatientTestRequested').innerHTML
    const PatientCanser_Markers = document.getElementById('PatientCanser_Markers').innerHTML
    const PatientMicroBiology = document.getElementById('PatientMicroBiology').innerHTML
    const PatientCovid_19_Tests = document.getElementById('PatientCovid_19_Tests').innerHTML
    const PatientGynecology = document.getElementById('PatientGynecology').innerHTML
    const PatientDiagnosis = document.getElementById('PatientDiagnosis').innerHTML
    

    // Form name, status Date
    const FormName = document.getElementById('FormName').innerHTML
    const FormStatus = document.getElementById('FormStatus').innerHTML
    const FormDate = document.getElementById('FormDate').innerHTML

    localStorage.setItem('FormName', FormName)
    localStorage.setItem('FormStatus', FormStatus)
    localStorage.setItem('FormDate', FormDate)

    localStorage.setItem('PatientName', PatientName)
    localStorage.setItem('PatientID', PatientID)
    localStorage.setItem('PatientGender', PatientGender)
    localStorage.setItem('PatientDOB', PatientDOB)
    localStorage.setItem('PatientAddress', PatientAddress)
    localStorage.setItem('PatientCity', PatientCity)
    localStorage.setItem('PatientDOS', PatientDOS)
    localStorage.setItem('PatientMobile', PatientMobile)
    localStorage.setItem('PatientInsurance', PatientInsurance)
    localStorage.setItem('PatientInsurance2', PatientInsurance2)
    localStorage.setItem('PatientPolicy', PatientPolicy)
    localStorage.setItem('PatientPolicy2', PatientPolicy2)
    localStorage.setItem('PatientFasting', PatientFasting)
    localStorage.setItem('PatientStat', PatientStat)
    localStorage.setItem('PatientTestPanels', PatientTestPanels !== "No Checked Boxes Detected"?PatientTestPanels:'')
    localStorage.setItem('PatientTestRequested', PatientTests !== "No Checked Boxes Detected"?PatientTests:'')
    localStorage.setItem('PatientCanser_Markers', PatientCanser_Markers !== "No Checked Boxes Detected"?PatientCanser_Markers:'')
    localStorage.setItem('PatientMicroBiology', PatientMicroBiology !== "No Checked Boxes Detected"?PatientMicroBiology:'')
    localStorage.setItem('PatientCovid_19_Tests', PatientCovid_19_Tests !== "No Checked Boxes Detected"?PatientCovid_19_Tests:'')
    localStorage.setItem('PatientGynecology', PatientGynecology !== "No Checked Boxes Detected"?PatientGynecology:'')
    localStorage.setItem('PatientDiagnosis', PatientDiagnosis !== "No Diagnosis Detected"?PatientDiagnosis:'')

}
getData()



function DeleteForm(){
    // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
    Swal.fire({
        text: "Are you sure you want to delete selected Document?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "No, cancel",
        customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary"
        }
    }).then(function (result) {
        if (result.value) {
            // Send to API to Delete the Docuemnt
            // Get the current URL
            const currentUrl = window.location.href;

            // Parse the URL to extract query parameters
            const urlParams = new URLSearchParams(new URL(currentUrl).search);

            // Get the value of the "id" parameter
            const formID = urlParams.get('id');
            fetch(`${BackURL}/form?form_id=${formID}`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    form_id: formID
                })
            }).then((response) => {
                if (response.ok) {

                    Swal.fire({
                        text: "You have deleted The Document.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(function () {
                        window.location.replace("/forms");
                    });
                } else if(response.status === 401){
                    window.location.replace("/sign-in");
                }
            }
            );
        } else if (result.dismiss === 'cancel') {
            Swal.fire({
                text: "Selected Document was not deleted.",
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