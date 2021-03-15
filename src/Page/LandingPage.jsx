import axios from 'axios'
import React from 'react'
import LinkAPI from './../Const/LinkAPI'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { Link } from 'react-router-dom'


export default class LandingPage extends React.Component{

    state ={
        dataProduct : null,
        dataCart: null,

        userLogin: null,
        showModal: false,
        productSelect: null
    }

    componentDidMount( ){
        this.getdataProduct()
        this.getDataCart()
        this.userLogin()
    }

    userLogin =() =>{
        let id = localStorage.getItem('id')
        if(id){
            this.setState({userLogin: id})
        }

    }
    getdataProduct = () =>{

        axios.get(`${LinkAPI}products`)
        .then((res) =>{
            console.log(res.data)
            this.setState({dataProduct: res.data})
            
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    getDataCart = () =>{
        axios.get(`${LinkAPI}cart`)
        .then((res) =>{
            console.log(res)
            this.setState({dataCart: res.data})

        })
        .catch((err) =>{
            console.log(err)
        })
    }

    addToCart = () =>{
        // let idProduct = this.state.productSelect
        // let idUser = localStorage.getItem('id')
        // let qty = this.refs.inputUser.value

        //  let dataSend = {
        //     idProduct: idProduct,
        //     idUser: idUser,
        //     quantity: qty

        // }

        // axios.get(`${LinkAPI}cart?idProduct=${idProduct}`)
        // .then((res) =>{

        //     console.log(res.data)
        //     if(res.data.length === 0){
        //         axios.post(`${LinkAPI}cart`, dataSend)
        //         .then((res) =>{
        //             // console.log(res)

        //             // window.location = `/detile-product/${idProduct}`
        //         })
        //         .catch((err) =>{
        //             console.log(err)
        //         })
        //     }else{

        //         let qtyDataBase = res.data[0].quantity
        //         let idCart = res.data[0].id
        //         axios.patch(`${LinkAPI}cart/${idCart}`,{quantity: qty})

        //         .then((res) =>{
        //             console.log(res)
        //             axios.get(`${LinkAPI}cart?idUser=${idUser}`)
        //             .then((res) =>{
        //                 console.log(res)
        //             })
        //             .catch((err) =>{
        //                 console.log(err)
        //             })           
                    
        //         })
        //         .catch((err) =>{
        //             console.log(err)
        //         })
        //     }
        // })
        // .catch((err) => {
        //     console.log(err)
        // })


        
        
    }

    render(){
        if(this.state.dataProduct === null){
            return(
                <div>

                </div>
            )
        }
        return(
            <div>
                <div className="bg-warning" style={{height: "60vh"}}>
                    JumboTron
                </div>
                <div className="container">
                    {
                        this.state.dataProduct.map((value, index) =>{
                            return(
                                <div className="d-flex flex-wrap border mb-3 mt-2">
                                    <div style={{width: '300px'}}>
                                        <img src={value.img} alt="gambar produk" width="90%"/>

                                        <div className="mt-5 align-items-center" style={{textAlign: 'center'}}>
                                            <Link to={`/detile-product/${value.id}`}><button className="btn btn-warning border px-5" onClick={()=>this.setState({productSelect: `${value.id}`})}>DetileProduct</button></Link> 
                                        </div>

                                    </div>

                                    <div style={{width: '300px'}}>
                                        <h4>
                                            {value.name}
                                        </h4>
                                        <div>
                                           Harga : Rp {(value.price).toLocaleString('id-ID')}
                                        </div>
                                        <div>
                                            Stoct &nbsp; : {value.stock} Unit
                                        </div>
                                        <div>
                                            <b>
                                                Description :
                                            </b>
                                            <p style={{textAlign: 'justify'}}>
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>

                    <Modal toggle={() => this.setState({showModal: false})} isOpen={this.state.showModal}>
                        <div className="container align-items-center">
                            {
                                this.state.userLogin?
                                <div>
                                    <ModalHeader className="justify-content-center"><b style={{textAlign: 'center'}}>Silahkan Input Jumlah Quantity</b></ModalHeader>
                                        <ModalBody>

                                            
                                            <div className='my-3 justify-content-center'>
                                                <input type='number' ref='inputUser' placeholder='Quantity' className='form form-control' />
                                            </div>
                                        
                                            <p style={{textAlign: 'right'}}></p>
                                            
                                            <center><input type='button' value='Add To Cart' className='btn btn-success mt-3 'onClick={this.addToCart} style={{height: '40px', width: '100px'}}/></center> 
                                        
                                    </ModalBody>
                                </div>
                                
                                :
                                <div>
                                    <ModalHeader className="justify-content-center"><b style={{textAlign: 'center'}}>Silahkan Login Terlebih Dahulu</b></ModalHeader>
                                        <ModalBody>
                                        
                                            <p style={{textAlign: 'right'}}> <Link to='/log-in'> Login Page </Link> </p>
                                            
                                            
                                        
                                    </ModalBody>
                                </div>

                            }
                        </div>
                    </Modal>
            </div>
        )
    }
}