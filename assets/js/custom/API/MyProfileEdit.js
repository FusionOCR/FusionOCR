async function getMyData(){
    const response = await fetch(`${BackURL}/user/user/${localStorage.getItem('id')}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.ok) {
        const userInfo = await response.json();

        // Add to the Header
        // change the attribute data-kt-countup-value="23" to the value of the user's age
        document.getElementById('MyUploadedFiles').innerHTML = `<div class="fs-2 fw-bold" id="" data-kt-countup="true"  data-kt-countup-value="${userInfo.uploaded_forms_num}" data-kt-countup-prefix="">${userInfo.uploaded_forms_num}</div>`
        document.getElementById("MyName").innerHTML = `${userInfo['first_name']} ${userInfo['last_name']}`
        document.getElementById("MyEmail").innerHTML = userInfo['email']
        document.getElementById("subEmail").innerHTML = userInfo['email']
        document.querySelector('#kt_account_profile_details_form input[name="lname"]').value = userInfo['last_name']
        document.querySelector('#kt_account_profile_details_form input[name="fname"]').value = userInfo['first_name']
    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
}
getMyData()

// Update the user's first and last name
document.getElementById('kt_account_profile_details_submit').addEventListener('click', async function(e){
    e.preventDefault()
    const Button = e.currentTarget
    Button.disabled = true
    const data = {
        first_name: document.querySelector('#kt_account_profile_details_form input[name="fname"]').value,
        last_name: document.querySelector('#kt_account_profile_details_form  input[name="lname"]').value
    }
    const response = await fetch(`${BackURL}/user/user_name/${localStorage.getItem('id')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        await response.json();
        document.getElementById("MyName").innerHTML = `${data['first_name']} ${data['last_name']}`
        localStorage.setItem('first_name', data['first_name'])
        localStorage.setItem('last_name', data['last_name'])
    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
    Button.disabled = false
})