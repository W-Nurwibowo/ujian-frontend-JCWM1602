import axios from 'axios'
import React from 'react'

export default class DetilePrroduct extends React.Component{

    state = {
        userLogin: null,
        dataDetileProduct: null,
        imageProduct: null
    }

    componentDidMount(){
        this.onGeDataProduct()
        this.onUserLogin()
      
    }

    onGeDataProduct = () =>{
        let idProduct = this.props.location.pathname.split('/')[2]

        axios.get(`http://localhost:2000/products/${idProduct}`)
        .then((res) => {
            console.log(res.data)
            this.setState({dataDetileProduct: res.data})
            this.setState({imageProduct: res.data.img})
        })
        .catch((err) =>{
            console.log(err)
        })

          
    }

    onUserLogin = () =>{
        let id = localStorage.getItem('id')
        if(id !== null){
            this.setState({userLogin: true})
        }else{
            this.setState({userLogin: false})
        }
    }

    addToCart = () => {

        let idProduct = this.props.location.pathname.split('/')[2]
        let idUser = localStorage.getItem('id')

        let dataSend = {
            idProduct: idProduct,
            idUser: idUser,
            quantity: 1

        }

        axios.get(`http://localhost:2000/cart?idProduct=${idProduct}`)
        .then((res) =>{

            console.log(res.data)
            if(res.data.length === 0){
                axios.post(`http://localhost:2000/cart`, dataSend)
                .then((res) =>{
                    // console.log(res)
                    alert('product berhasil di tambahkan')

                    window.location = `/detile-product/${idProduct}`
                })
                .catch((err) =>{
                    console.log(err)
                })
            }else{

                let qtyDataBase = res.data[0].quantity
                let idCart = res.data[0].id
                axios.patch(`http://localhost:2000/cart/${idCart}`,{quantity: qtyDataBase + 1})

                .then((res) =>{
                    console.log(res)
                    axios.get(`http://localhost:2000/cart?idUser=${idUser}`)
                    .then((res) =>{
                        console.log(res)
                        alert('product berhasil di tambahkan')
                    })
                    .catch((err) =>{
                        console.log(err)
                    })           
                    
                })
                .catch((err) =>{
                    console.log(err)
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })

       

    }

    login = () => {
        let confirm = window.confirm('Anda Harus Log in dahulu')
        if(confirm){
            window.location = '/log-in'
        }
    }


    render(){
        if(this.state.dataDetileProduct === null){
            return(
                <div>
                    loading....
                </div>
            )
        }
        return(
            <div className="container" style={{boxShadow: "-1px 2px 5px grey", borderRadius: '20px'}}>

                <div className="row mt-5" style={{}}>
                    
                    <div className="p-3 col-12 col-md-6" style={{}}>
                        
                        <div className="" style={{textAlign: 'center'}}>
                          {/* {
                              this.state.imageProduct?
                                this.state.imageProduct
                              : */}
                              <img src={this.state.imageProduct} alt="gambar" width="100%" style={{borderRadius: '15px'}} />
                                
                        {/* //   } */}
                            
            
                        </div>
                        
                        
                    </div>

                    <div className="col-12 col-md-6 p-3" >
                        <div style={{fontSize: '25px'}}>
                           <b>{this.state.dataDetileProduct.name}</b>
                        </div>
                        <div className="mt-3">
                            Rp. {(this.state.dataDetileProduct.price).toLocaleString()}
                        </div>
                        <div>
                            {
                                
                            }
                        </div>
                        <hr/>
                        <div>
                           Stock &nbsp; &nbsp;: &nbsp; &nbsp;{
                                this.state.dataDetileProduct.stock
                            } Unit
                        </div>
                        <div>
                            Weigth&nbsp;:  &nbsp; &nbsp; &nbsp;{
                                (this.state.dataDetileProduct.weight/1000)
                            } KG
                        </div>
                        <hr/>
                        <div className='mb-3 mr-3'>
                            <b>Description:</b>  <br/>
                            <div style={{textAlign: 'justify'}}>
                                {
                                    this.state.dataDetileProduct.description
                                }
                            </div>
                        </div>

                        {
                            this.state.userLogin? 
                            
                                <div >
                                    <button className='btn btn-danger' onClick={this.addToCart} >Add To Cart</button>
                                    
                                </div>
                            :
                                <div class="alert alert-warning" role="alert">
                                    <button className='btn btn-warning ml-5' onClick={this.login} >Add To Cart</button>
                                </div>
                        }
                        

                                
                    </div>

                </div>

                <br/><br/><br/><br/>
                

                

            </div>
        )
    
    }
}