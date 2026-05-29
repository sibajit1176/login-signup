const signupForm=document.querySelector('.signup-form')
const loginLink = document.querySelector('#loginLink');
const signupLink = document.querySelector('#signupLink');

const signupContainer = document.querySelector('.signup-container');
const loginContainer = document.querySelector('#loginContainer');

loginLink.addEventListener('click', (e) => {
    e.preventDefault();

    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

signupLink.addEventListener('click', (e) => {
    e.preventDefault();

    signupContainer.style.display = 'block';
    loginContainer.style.display = 'none';
});

signupForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const name=document.querySelector('#inputName').value
    const email=document.querySelector('#inputEmail').value
    const pass=document.querySelector('#pass').value
    const cpass=document.querySelector('#cpass').value

    if(pass!=cpass){
        alert('Password and confirm Password must be same')
        return
    }
    const payload ={
        name:name,
        email:email,
        password:pass
    }
    addUser(payload)

})

const addUser= async(payload)=>{
  try {
    const res =await axios.post('http://localhost:5000/user/signUp',payload)
    alert(res.data.message)
  } catch (error) {
    console.log(error);
    
  }
}