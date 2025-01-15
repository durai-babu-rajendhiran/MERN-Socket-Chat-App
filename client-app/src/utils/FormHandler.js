export const HandleChanger = (e,setLoginForm)=>{
    const {value,name} = e.target
    setLoginForm((prev)=>({...prev,[name]:value}))
}