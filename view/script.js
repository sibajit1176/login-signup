const signupForm=document.querySelector('.signup-form')

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