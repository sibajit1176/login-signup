const signupForm=document.querySelector('.signup-form')
const loginLink = document.querySelector('#loginLink');
const signupLink = document.querySelector('#signupLink');

const signupContainer = document.querySelector('.signup-container');
const loginContainer = document.querySelector('#loginContainer');

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userdetails')
      if(token){
            window.location.href =`expense.html`;
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
    document.querySelector('#inputName').value = '';
        document.querySelector('#inputEmail').value = '';
        document.querySelector('#pass').value = '';
        document.querySelector('#cpass').value = '';

        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
         localStorage.setItem('userdetails',res.data.token)
  } catch (error) {
    console.log(error);
    
  }
}

const login=document.querySelector('#loginform')

login.addEventListener('submit',(e)=>{
    e.preventDefault()
    const loginPass=document.querySelector('#loginPass').value
    const loginEmail=document.querySelector('#loginEmail').value
    const payload={
        email:loginEmail,
        password:loginPass
    }
    loginuser(payload)
})

const loginuser=async(payload)=>{
 try {
    const res= await axios.post('http://localhost:5000/user/login',payload)
    alert(res.data.message)
    window.location.href =`expense.html`;
    localStorage.setItem('userdetails',res.data.token)
 } catch (error) {
    console.log(error);
    
 }
}

window.addEventListener('load',(e)=>{
   const token=  localStorage.getItem('userdetails')
   if(token){
     signupContainer.style.display = 'none';
     window.location.href =`expense.html`;
            return
   }
})