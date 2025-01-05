
async function getData(){
    const response = await fetch(`${BackURL}/user/user_list?limit=1000`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.ok) {
        const userList = await response.json();

        for (let i = 0; i < userList.length; i++) {
            const user = userList[i];
            const userDiv = `
                    <tr>
                        <td>
                                <div class="form-check form-check-sm form-check-custom form-check-solid">
                                    <input class="form-check-input" type="checkbox" value="1" />
                                </div>
                            </td> 
                        <td class="d-flex align-items-center">
                            <!--begin:: Avatar -->
                            <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                <a href="./users-list/user">
                                    <div class="symbol-label">
                                        <img src="assets/media/avatars/blank.png" alt="${user['first_name']} ${user['last_name']}" class="w-100" />
                                    </div>
                                </a>
                            </div>
                            <!--end::Avatar-->
                            <!--begin::User details-->
                            <div class="d-flex flex-column">
                                <a href="./users-list/user" class="text-gray-800 text-hover-primary mb-1">${user['first_name']} ${user['last_name']}</a>
                                <span>${user['email']}</span>
                            </div>
                            <!--begin::User details-->
                        </td>
                        
                        <td>
                            <div class="badge badge-light fw-bold">${user['uploaded_forms_num']}</div>
                        </td>
                        <td></td>
                        <td>${user['joined_at']}</td>
                        
                    </tr>
            `
            document.querySelector("#users-list").innerHTML += userDiv;
        }

    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }

    KTUsersList.init();
}


getData()