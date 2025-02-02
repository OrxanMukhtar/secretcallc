import React, {useState, useEffect} from "react";
import './registration.css'

function Registration() {

    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [pinCode, setPinCode] = useState('')


    function registerUser(event) {
        event.preventDefault()

        localStorage.setItem('userName', userName)
        localStorage.setItem('email', email)
        localStorage.setItem('password', password)
        localStorage.setItem('pinCode', pinCode)


    }

    return (



        <div>
            <h1>Registration</h1>

            <form className="regForm" onSubmit={registerUser}>

                <input type="text" value={userName} placeholder="User Name" required
                       onChange={(e) => setUserName(e.target.value)} />

                <input type="email" value={email}    placeholder="e-mail"    required
                       onChange={(e) => setEmail(e.target.value)} />

                <input type="password" value={password} placeholder="Password"  required
                       onChange={(e) => setPassword(e.target.value)} />

                <input type="password" value={pinCode}  placeholder="Pin Code"  required
                       onChange={(e) => setPinCode(e.target.value)}  />

                <button type="submit" className="galleryBtnColor regBtn btn">Done</button>
            </form>
        </div>
    )
}

export default Registration;