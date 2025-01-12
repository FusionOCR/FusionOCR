const BackURL = "https://fusionocr.com/api"
// const BackURL = "https://fusionocr.com/api"
const BackSocketURL = "wss://fusionocr.com"
const socket = io(`${BackSocketURL}`,{transports: ["websocket", "polling"],withCredentials: false}); // Connect to the backend

async function getUserData(){
    const response = await fetch(`${BackURL}/user/user_list?limit=10`, {
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
                    <!--begin::Item-->
                    <div class="d-flex align-items-sm-center mb-7">
                        <div class="symbol symbol-50px me-5">
                            <span class="symbol-label">
                                <img src="assets/media/avatars/blank.png" class="h-50 align-self-center" alt="" />
                            </span>
                        </div>
                        <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                            <div class="flex-grow-1 me-2">
                                <a  class="text-gray-800 text-hover-primary fs-6 fw-bold">${user.first_name} ${user.last_name}</a>
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


async function getformsData(){
    const response = await fetch(`${BackURL}/forms_list?limit=10`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.ok) {
        const res = await response.json();
        const formsList = res['forms'];
        document.querySelector("#forms_list").innerHTML = ''
        for (let i = 0; i < formsList.length; i++) {
            const form = formsList[i];
            var statusStyle = ''
            if (form.status === 'Detecting Forms'){
                statusStyle = 'badge-badge-light-dark'
            }else if (form.status === 'Pending'){
                statusStyle = 'badge-badge-light-dark'
            }else if(form.status === 'Error'){
                statusStyle = 'badge-light-danger'
            }else if(form.status === 'Extracted'){
                statusStyle = 'badge-light-success'
            }else{
                statusStyle = 'badge-light-warning'
            }
            const uploadDate = new Date(form.uploaded_at)
            const formattedDate = `${uploadDate.getDate()} ${uploadDate.toLocaleString('default', { month: 'short' })} ${uploadDate.getFullYear()}, ${uploadDate.getHours() % 12 || 12}:${uploadDate.getMinutes().toString().padStart(2, '0')} ${uploadDate.getHours() >= 12 ? 'PM' : 'AM'}`;
            const link = 
            (form.status !== "Proccessing" && form.status !== "Pending")?
                                `<a href="./forms/document/?id=${form.form_id}" id="${form.form_id}" class="text-gray-800 text-hover-primary">${form.name}</a>`
                            :
                                `<a  id="${form.form_id}"class="text-gray-800 text-hover-primary">${form.name}</a>`
            const subLink = 
            (form.status !== "Proccessing" && form.status !== "Pending")?
                                `<a href="./forms/document/?id=${form.form_id}" class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                                    <i class="ki-duotone ki-arrow-right fs-2">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </a>`
                            :
                                ``
            
            const formDiv = `
                    <tr>
                        <td>
                            <div class="symbol symbol-45px me-2">
                                <span class="symbol-label">
                                    <img src="assets/media/svg/files/pdf.svg" class="h-50 align-self-center" alt="" />
                                </span>
                            </div>
                        </td>
                        <td>
        ${link}
                            <span class="text-muted fw-semibold d-block">${formattedDate}</span>
                        </td>
                        <td class="text-end text-muted fw-bold"></td>
                        <td class="text-end">
                            <span class="badge ${statusStyle}">${form.status}</span>

                        </td>
                        <td class="text-end">
                            ${subLink}
                        </td>
                    </tr>
            `
            document.querySelector("#forms_list").innerHTML += formDiv;
        }

    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
}
async function updateformsData(formsList){

        // const res = await response.json();
        // const formsList = res['forms'];
        document.querySelector("#forms_list").innerHTML = ''
        for (let i = 0; i < formsList.length; i++) {
            const form = formsList[i];
            var statusStyle = ''
            if (form.status === 'Detecting Forms'){
                statusStyle = 'badge-badge-light-dark'
            }else if (form.status === 'Pending'){
                statusStyle = 'badge-badge-light-dark'
            }else if(form.status === 'Error'){
                statusStyle = 'badge-light-danger'
            }else if(form.status === 'Extracted'){
                statusStyle = 'badge-light-success'
            }else{
                statusStyle = 'badge-light-warning'
            }
            const uploadDate = new Date(form.uploaded_at)
            const formattedDate = `${uploadDate.getDate()} ${uploadDate.toLocaleString('default', { month: 'short' })} ${uploadDate.getFullYear()}, ${uploadDate.getHours() % 12 || 12}:${uploadDate.getMinutes().toString().padStart(2, '0')} ${uploadDate.getHours() >= 12 ? 'PM' : 'AM'}`;
            const link = 
            (form.status !== "Proccessing" && form.status !== "Pending")?
                                `<a href="./forms/document/?id=${form.form_id}" id="${form.form_id}" class="text-gray-800 text-hover-primary">${form.name}</a>`
                            :
                                `<a  id="${form.form_id}"class="text-gray-800 text-hover-primary">${form.name}</a>`
            const subLink = 
            (form.status !== "Proccessing" && form.status !== "Pending")?
                                `<a href="./forms/document/?id=${form.form_id}" class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                                    <i class="ki-duotone ki-arrow-right fs-2">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </a>`
                            :
                                ``
            
            const formDiv = `
                    <tr>
                        <td>
                            <div class="symbol symbol-45px me-2">
                                <span class="symbol-label">
                                    <img src="assets/media/svg/files/pdf.svg" class="h-50 align-self-center" alt="" />
                                </span>
                            </div>
                        </td>
                        <td>
        ${link}
                            <span class="text-muted fw-semibold d-block">${formattedDate}</span>
                        </td>
                        <td class="text-end text-muted fw-bold"></td>
                        <td class="text-end">
                            <span class="badge ${statusStyle}">${form.status}</span>

                        </td>
                        <td class="text-end">
                            ${subLink}
                        </td>
                    </tr>
            `
            document.querySelector("#forms_list").innerHTML += formDiv;
        }
}

// get status Count with /forms_status
async function getStatusCount(){
    const response = await fetch(`${BackURL}/forms_status`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.ok) {
        const statusCount = await response.json();
        document.querySelector("#pending").innerHTML = statusCount.Pending;
        document.querySelector("#error").innerHTML = statusCount.Error;
        document.querySelector("#extracted").innerHTML = statusCount.Extracted;
        document.querySelector("#processing").innerHTML = statusCount.Proccessing;
        document.querySelector("#totalFormCount").innerHTML = statusCount.Pending + statusCount.Error + statusCount.Extracted + statusCount.Proccessing;
    
        "use strict";
        console.log(Object.keys(statusCount).drop)
        // Class definition
        var KTProjectList = function () {    
            var initChart = function () {
                // init chart
                var element = document.getElementById("kt_project_list_chart");

                if (!element) {
                    return;
                }

                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [statusCount["Pending"], statusCount["Error"], statusCount["Extracted"], statusCount["Proccessing"]],
                            backgroundColor: ['#E4E6EF',"#f8285a",'#50CD89','#00A3FF']
                        }],
                        labels: ['Pending', 'Error', 'Extracted', 'Proccessing']
                    },
                    options: {
                        chart: {
                            fontFamily: 'inherit'
                        },
                        borderWidth: 0,
                        cutout: '75%',
                        cutoutPercentage: 65,
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: false
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        stroke: {
                            width: 0
                        },
                        tooltips: {
                            enabled: true,
                            intersect: false,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10,
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: '#20D489',
                            titleFontColor: '#ffffff',
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }                
                    }
                };

                var ctx = element.getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }

            // Public methods
            return {
                init: function () {
                    initChart();
                }
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function() {
            KTProjectList.init();
        });

    
    }else if(response.status === 401){
        window.location.replace("/sign-in");
    }
}
getUserData()
// getformsData()
getStatusCount()


// setInterval(getformsData, 10000);





socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
    
    // Request forms list
    socket.emit('get_forms', { limit: 10, offset: 0 });
});
// update_front
socket.on('update_front', (data) => {
    console.log("update")
    // Request forms list
    socket.emit('get_forms', { limit: 10, offset: 0 });
});
// Handle forms update from server
socket.on('forms_update', (data) => {
    console.log('Received forms update:', data);
    updateformsData(data.forms);
    console.log(data.forms); // Your function to update the UI
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});