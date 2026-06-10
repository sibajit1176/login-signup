const signupForm = document.querySelector('.signup-form')
const loginLink = document.querySelector('#loginLink');
const signupLink = document.querySelector('#signupLink');

const signupContainer = document.querySelector('.signup-container');
const loginContainer = document.querySelector('#loginContainer');
const forgotPasswordLink = document.querySelector('#forgotPasswordLink');
const forgotPasswordContainer = document.querySelector('#forgotPasswordContainer');
const backToLogin = document.querySelector('#backToLogin');

let currentResetEmail = '';

loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  const token = localStorage.getItem('userdetails')
  if (token) {
    window.location.href = `expense.html`;
    return
  }
  signupContainer.style.display = 'none';
  loginContainer.style.display = 'block';
});

signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  const token = localStorage.getItem('userdetails')

  signupContainer.style.display = 'block';
  loginContainer.style.display = 'none';
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = document.querySelector('#inputName').value
  const email = document.querySelector('#inputEmail').value
  const pass = document.querySelector('#pass').value
  const cpass = document.querySelector('#cpass').value

  if (pass != cpass) {
    alert('Password and confirm Password must be same')
    return
  }
  const payload = {
    name: name,
    email: email,
    password: pass
  }
  addUser(payload)

})
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();

  loginContainer.style.display = 'none';
  forgotPasswordContainer.style.display = 'block';
});
backToLogin.addEventListener('click', (e) => {
  e.preventDefault();

  forgotPasswordContainer.style.display = 'none';
  loginContainer.style.display = 'block';
});

const addUser = async (payload) => {
  try {
    const res = await axios.post('http://localhost:5000/user/signUp', payload)
    alert(res.data.message)
    document.querySelector('#inputName').value = '';
    document.querySelector('#inputEmail').value = '';
    document.querySelector('#pass').value = '';
    document.querySelector('#cpass').value = '';

    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    localStorage.setItem('userdetails', res.data.token)
  } catch (error) {
    console.log(error);

  }
}

const login = document.querySelector('#loginform')

login.addEventListener('submit', (e) => {
  e.preventDefault()
  const loginPass = document.querySelector('#loginPass').value
  const loginEmail = document.querySelector('#loginEmail').value
  const payload = {
    email: loginEmail,
    password: loginPass
  }
  loginuser(payload)
})

const loginuser = async (payload) => {
  try {
    const res = await axios.post('http://localhost:5000/user/login', payload)
    alert(res.data.message)
    window.location.href = `expense.html`;
    localStorage.setItem('userdetails', res.data.token)
  } catch (error) {
    console.log(error);

  }
}

const forgotpasswordForm =
  document.querySelector('#forgotPasswordForm');

const otpForm =
  document.querySelector('#otpForm');

const sendOtpBtn =
  document.querySelector('#sendOtpBtn');

forgotpasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();


  const email =
    document.querySelector('#forgotEmail').value;
  console.log('forgot click....otp sent', email);

  sendOtpBtn.disabled = true;
  sendOtpBtn.innerText = "Sending OTP...";

  sendOtp(email)
});
const sendOtp = async (email) => {
  try {

    currentResetEmail = email;

    const sendOtpBtn =
      document.querySelector('#sendOtpBtn');

    sendOtpBtn.disabled = true;
    sendOtpBtn.innerText = 'Sending OTP...';

    const res = await axios.post(
      'http://localhost:5000/user/sendOtp',
      { email }
    );

    document.querySelector('#forgotPasswordForm')
      .style.display = 'none';

    document.querySelector('#otpForm')
      .style.display = 'block';

    document.querySelector('#otpSentEmail')
      .innerText = `OTP sent to ${email}`;

  } catch (error) {

    alert(
      error.response?.data?.message ||
      'Failed to send OTP'
    );

  } finally {

    const sendOtpBtn =
      document.querySelector('#sendOtpBtn');

    sendOtpBtn.disabled = false;
    sendOtpBtn.innerText = 'Send OTP';
  }
};
const resendOtpBtn =
  document.querySelector('#resendOtp');

const verifyOtpButton = document.querySelector('#verifyOtp')
verifyOtpButton.addEventListener('submit', (e) => {
  e.preventDefault()
  const getOtp = document.querySelector('#otpInput').value
  verifyOtp(getOtp)
})

otpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const getOtp = document.querySelector('#otpInput').value;

  await verifyOtp(getOtp);
});
const verifyOtp = async (otp) => {
  try {

    const res = await axios.post(
      'http://localhost:5000/user/verifyOtp',
      {
        email: currentResetEmail,
        otp
      }
    );

    alert(res.data.message);

    document.querySelector('#otpForm')
      .style.display = 'none';

    document.querySelector('#resetPasswordForm')
      .style.display = 'block';

    document.querySelector('#resetPasswordEmail')
      .innerText =
      `Changing password for ${currentResetEmail}`;

  } catch (error) {

    alert(
      error.response?.data?.message ||
      'Invalid OTP'
    );
  }
};

resendOtpBtn.addEventListener('click', async (e) => {

  e.preventDefault();

  if (!currentResetEmail) {
    return alert('Email not found');
  }

  try {

    resendOtpBtn.innerText =
      'Sending...';

    resendOtpBtn.style.pointerEvents =
      'none';

    await axios.post(
      'http://localhost:5000/user/sendOtp',
      {
        email: currentResetEmail
      }
    );

    alert('OTP resent successfully');

  } catch (error) {

    alert(
      error.response?.data?.message ||
      'Failed to resend OTP'
    );

  } finally {

    resendOtpBtn.innerText =
      'Resend OTP';

    resendOtpBtn.style.pointerEvents =
      'auto';
  }

});

const resetPasswordForm = document.querySelector('#resetPasswordForm');

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword =
        document.querySelector('#newPassword').value;

    try {

        const res = await axios.post(
            'http://localhost:5000/user/updatePassword',
            {
                email: currentResetEmail,
                password: newPassword
            }
        );

        alert(res.data.message);

        // Hide forgot password flow
        document.querySelector(
            '#forgotPasswordContainer'
        ).style.display = 'none';

        // Show login form
        document.querySelector(
            '#loginContainer'
        ).style.display = 'block';

        // Clear form data
        resetPasswordForm.reset();
        currentResetEmail = '';

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            'Password update failed'
        );
    }
});

window.addEventListener('load', (e) => {
  const token = localStorage.getItem('userdetails')
  if (token) {
    signupContainer.style.display = 'none';
    window.location.href = `expense.html`;
    return
  }
})
