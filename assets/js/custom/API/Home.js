// const BackURL = "https://fusionocr.com/api"
const BackURL = "http://localhost:5000"

async function getData(){
    const response = await fetch(`${BackURL}/user/user_list`, {
        method: 'GET'
    });
    
    if (response.ok) {
        const userList = await response.json();

        for (let i = 0; i < userList.length; i++) {
            const user = userList[i];
            console.log(user);
            const userDiv = `
                    <!--begin::Item-->
                    <div class="d-flex align-items-sm-center mb-7">
                        <div class="symbol symbol-50px me-5">
                            <span class="symbol-label">
                                <img src="assets/media/avatars/blank.png" class="h-50 align-self-center" alt="" />
                            </span>
                        </div>
                        <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                            <div class="flex-grow-1 me-2">
                                <a href="./users-list/user/" class="text-gray-800 text-hover-primary fs-6 fw-bold">${user.first_name} ${user.last_name}</a>
                                <span class="text-muted fw-semibold d-block fs-7">${user.email}</span>
                            </div>
                            <span class="badge badge-light fw-bold my-2">${user.uploaded_forms_num} Files</span>
                        </div>
                    </div>
                    <!--end::Item-->
            `
            document.querySelector("#users-list").innerHTML += userDiv;
        }

    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
}


getData()