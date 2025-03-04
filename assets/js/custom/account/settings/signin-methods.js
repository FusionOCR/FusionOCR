"use strict";

// Class definition
var KTAccountSettingsSigninMethods = function () {
    var signInForm;
    var signInMainEl;
    var signInEditEl;
    var passwordMainEl;
    var passwordEditEl;
    var signInChangeEmail;
    var signInCancelEmail;
    var passwordChange;
    var passwordCancel;

    var toggleChangeEmail = function () {
        signInMainEl.classList.toggle('d-none');
        signInChangeEmail.classList.toggle('d-none');
        signInEditEl.classList.toggle('d-none');
    }

    var toggleChangePassword = function () {
        passwordMainEl.classList.toggle('d-none');
        passwordChange.classList.toggle('d-none');
        passwordEditEl.classList.toggle('d-none');
    }

    // Private functions
    var initSettings = function () {  
        if (!signInMainEl) {
            return;
        }        

        // toggle UI
        signInChangeEmail.querySelector('button').addEventListener('click', function () {
            toggleChangeEmail();
        });

        signInCancelEmail.addEventListener('click', function () {
            toggleChangeEmail();
        });

        passwordChange.querySelector('button').addEventListener('click', function () {
            toggleChangePassword();
        });

        passwordCancel.addEventListener('click', function () {
            toggleChangePassword();
        });
    }

    var handleChangeEmail = function (e) {
        var validation;        

        if (!signInForm) {
            return;
        }

        validation = FormValidation.formValidation(
            signInForm,
            {
                fields: {
                    emailaddress: {
                        validators: {
                            notEmpty: {
                                message: 'Email is required'
                            },
                            emailAddress: {
                                message: 'The value is not a valid email address'
                            }
                        }
                    },

                    confirmemailpassword: {
                        validators: {
                            notEmpty: {
                                message: 'Password is required'
                            }
                        }
                    }
                },

                plugins: { //Learn more: https://formvalidation.io/guide/plugins
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );

        signInForm.querySelector('#kt_signin_submit').addEventListener('click', function (e) {
            e.preventDefault();
            const Button = e.currentTarget
            Button.disabled = true
            validation.validate().then(async function (status) {
                if (status == 'Valid') {
                    const data = {
                        email: document.querySelector('#kt_signin_change_email input[name="emailaddress"]').value,
                        password: document.querySelector('#kt_signin_change_email input[name="confirmemailpassword"]').value
                    }
                    const response = await fetch(`${BackURL}/user/user_email/${localStorage.getItem('id')}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(data)
                    });
                    if (response.ok) {
                        await response.json();
                        document.getElementById("subEmail").innerHTML = userInfo['email']
                        document.getElementById("MyEmail").innerHTML = data['email']
                        localStorage.setItem('email', data['email'])
                        swal.fire({
                            text: "Email Changed Successfully",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        }).then(function(){
                            signInForm.reset();
                            validation.resetForm(); // Reset formvalidation --- more info: https://formvalidation.io/guide/api/reset-form/
                            toggleChangeEmail();
                        });
                    }else if(response.status === 401){
                        window.location.replace("/sign-in");
                    }else{
                        const res = await response.json();
                        swal.fire({
                            text: `Error Happened, ${res.message}`,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        })
                    }
                    Button.disabled = false

                    
                } else {
                    swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    });
                }
            });
        });
    }

    var handleChangePassword = function (e) {
        var validation;

        // form elements
        var passwordForm = document.getElementById('kt_signin_change_password');

        if (!passwordForm) {
            return;
        }

        validation = FormValidation.formValidation(
            passwordForm,
            {
                fields: {
                    // currentpassword: {
                    //     validators: {
                    //         notEmpty: {
                    //             message: 'Current Password is required'
                    //         }
                    //     }
                    // },

                    newpassword: {
                        validators: {
                            notEmpty: {
                                message: 'New Password is required'
                            }
                        }
                    },

                    confirmpassword: {
                        validators: {
                            notEmpty: {
                                message: 'Confirm Password is required'
                            },
                            identical: {
                                compare: function() {
                                    return passwordForm.querySelector('[name="newpassword"]').value;
                                },
                                message: 'The password and its confirm are not the same'
                            }
                        }
                    },
                },

                plugins: { //Learn more: https://formvalidation.io/guide/plugins
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );

        passwordForm.querySelector('#kt_password_submit').addEventListener('click', function (e) {
            e.preventDefault();
            const Button = e.currentTarget
            Button.disabled = true
            validation.validate().then(function (status) {
                if (status == 'Valid') {
                    // Send to Change Password to API
                    // const data = {
                        // current_password: passwordForm.querySelector('[name="currentpassword"]').value,
                        // new_password: passwordForm.querySelector('[name="newpassword"]').value
                    // }
                    // fetch(`${BackURL}/user/user_password/${localStorage.getItem('id')}`, {

                    // Get The Params
                    const email = localStorage.getItem("email");
                    const password = passwordForm.querySelector('[name="newpassword"]').value;
                    const data = new FormData();
                    data.append('email', email);
                    data.append('newPassword', password);

                    fetch(`${BackURL}/auth/reset-password`, {
                        method: 'POST',
                        headers: {
                            // 'Content-Type': 'application/json',
                            authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: data
                    }).then(async function(response){
                        if (response.ok) {
                            await response.json();
                            swal.fire({
                                text: "Password Changed Successfully",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            }).then(function(){
                                passwordForm.reset();
                                validation.resetForm(); // Reset formvalidation --- more info: https://formvalidation.io/guide/api/reset-form/
                                toggleChangePassword();
                            });
                        }else if(response.status === 401){
                            window.location.replace("/sign-in");
                        }else{
                            const res = await response.json();
                            swal.fire({
                                text: `Error Happened, ${res.message}`,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            })
                        }
                        Button.disabled = false
                    });
                } else {
                    swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    });
                }
            });
        });
    }

    // Public methods
    return {
        init: function () {
            signInForm = document.getElementById('kt_signin_change_email');
            signInMainEl = document.getElementById('kt_signin_email');
            signInEditEl = document.getElementById('kt_signin_email_edit');
            passwordMainEl = document.getElementById('kt_signin_password');
            passwordEditEl = document.getElementById('kt_signin_password_edit');
            signInChangeEmail = document.getElementById('kt_signin_email_button');
            signInCancelEmail = document.getElementById('kt_signin_cancel');
            passwordChange = document.getElementById('kt_signin_password_button');
            passwordCancel = document.getElementById('kt_password_cancel');

            initSettings();
            handleChangeEmail();
            handleChangePassword();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTAccountSettingsSigninMethods.init();
});
