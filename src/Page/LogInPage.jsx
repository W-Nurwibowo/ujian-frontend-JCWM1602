import axios from 'axios'
import React from 'react'
import ValidationEmail from '../function/Email'
import LinkAPI from './../Const/LinkAPI'

export default class LoginPage extends React.Component{

    state = {
        error : null,
        email: null,
        password: null

    }

    emailValidation = () =>{
        let inputUser = this.refs.inputEmail.value
        


        let result = ValidationEmail(inputUser)


        if(result !== true){
            this.setState({error: "Masukan salah"})
        }else{
            this.setState({error: null, email: inputUser })
            // if(inputUser && inputPassword){
    
            //     axios.get(`${LinkAPI}users?email=${inputUser}&password=${inputPassword}`)
            //     .then((res) =>{
            //         console.log(res)
            //     })
            //     .catch((err) =>{
            //         console.log(err)
            //     })
            // }
        }

    }
    passwordValidation = () => {

        let inputPassword = this.refs.inputPassword.value

        if(inputPassword.length < 6){
            this.setState({error: 'Pasword harus 6 digit'})

        }else{
            this.setState({error: null, password: inputPassword})
        }


    }

    onUserLogin = () =>{

        let emailUser = this.state.email
        let passwordUser = this.state.password

        axios.get(`${LinkAPI}users?email=${emailUser}&password=${passwordUser}`)
        .then((res) =>{
            console.log(res.data.length)
            if(res.data.length === 1){
                alert('Login Berhasil')
                localStorage.setItem('id', res.data[0].id)
                window.location = '/'
            }else if(res.data.length === 0){

                axios.post(`${LinkAPI}users`)
                .then((res) =>{
                    console.log(res.data)
                    alert('Login Berhasil')
                    localStorage.setItem('id', res.data[0].id)
                    window.location = '/'

                })
                .catch((err) =>{
                    console.log(err)
                })
            }

        })
        .catch((err) =>{
            console.log(err)
        })
    }

    render(){
        return(
            <div className="container">
                <div className="border" style={{width: '350px', height: '200px'}}>

                    <p>
                        {
                            this.state.error
                        }
                    </p>

                    <input type="text" className="form-control mb-2" placeholder="Masukan Email" ref="inputEmail" onChange={this.emailValidation}/>
                    <input type="text" className="form-control mb-5" placeholder="masukan Password" ref="inputPassword" onChange={this.passwordValidation} />
                    
                    <button className="btn btn-warning" onClick={this.onUserLogin}>Log in</button>

                </div>

            </div>
        )
    }
}