import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import LinkAPI from '../Const/LinkAPI'



export default class Navbar extends React.Component{

    state = {
        user: null,
        datacart: 0
    }

    componentDidMount(){
        this.onGetUser()
        this.onGetDataCart()
    }
    onGetUser = () =>{
        let idUser = localStorage.getItem('id')

        axios.get(`${LinkAPI}users?id=${idUser}`)
        .then((res) =>{
            console.log((res.data[0].email))
            this.setState({user: (res.data[0].email)})
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    onLogOut = () =>{
        let confirm = window.confirm('Anda Yakin Akan Log Out?')
        if(confirm){
            localStorage.removeItem('id')
            window.location = '/'
        }
    }

    onGetDataCart = () => {
        let idUser = localStorage.getItem('id')
        axios.get(`${LinkAPI}cart?idUser=${idUser}`)
        .then((res) =>{
            this.setState({datacart: res.data.length})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    

    render(){
        return(
            <div>
                <div className="container">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#">Navbar</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item active">
                                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Link</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#">Something else here</a>
                                </div>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                        <form class="form-inline my-2 my-lg-0">

                            <div>
                                {
                                    this.state.user?
                                        <div className="row">
                                            <div>
                                                {this.state.user}
                                            </div>

                                            <div className="row">
                                                <img src="https://www.kindpng.com/picc/m/19-194789_logout-button-png-transparent-png.png" height="30px" className="ml-3" alt="logout" onClick={this.onLogOut}/>
                                                <Link to='/cart'>
                                                <img src="https://png.pngtree.com/png-vector/20190927/ourlarge/pngtree-shopping-cart-icon-png-image_1736144.jpg" className="ml-3" height="30px" alt="Gambar Cart"/>

                                                </Link>
                                                <div>
                                                    {this.state.datacart}
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <div>
                                            <Link to='/log-in'><img src="https://image.shutterstock.com/image-vector/thin-line-user-icon-on-260nw-519039097.jpg" alt="UserIcon"  height="50px"/></Link>
                                            <img src="https://png.pngtree.com/png-vector/20190927/ourlarge/pngtree-shopping-cart-icon-png-image_1736144.jpg" className="ml-3" height="30px" alt="Gambar Cart"/>
                                        </div>
                                }
                            </div>
                        </form>
                    </div>
                    </nav>
                </div>

                 

            </div>
        )
    }
}