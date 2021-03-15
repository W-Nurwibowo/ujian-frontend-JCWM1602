import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import { faArrowCircleDown, faArrowCircleUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LinkAPI from '../Const/LinkAPI'

export default class CartPage extends React.Component{
    
    state = {
        dataCarts: null,
        dataProducts: null,
        totalItem: 0,
        totalPrice: 0,
        idUser : null
    }

    componentDidMount(){
        this.getDataCarts()
    }

    getDataCarts = () => {
        let id = localStorage.getItem('id')
        this.setState({idUser: id})

        // Get Data dari API userName dengan id (log in) memili data cart berapa banyak
        axios.get(`${LinkAPI}cart?idUser=${id}`)
        .then((res) => {
            let linkURLToGetDataProduct = ''
            
            // Lalu setelah mendapatkan Datanya maka data di looping untuk mendapatkan idProductnya
            res.data.forEach((value) => {
                linkURLToGetDataProduct += `id=${value.idProduct}&`
            })

            // karna hasil loping Data Produknya tidak urut maka di urutkan dari nomor terkecil ke terbesar
            // karna data dari ApI memiliki urutan sejak Data tersebut Ter buat
            res.data.sort((a, b) => {
                return a.idProduct - b.idProduct
            })

            // simpan hasil data dalam state
            this.setState({dataCarts: res.data})
            console.log(this.state.dataCarts)

            

            // setelah Mendapatkan data dari cart user jnagn lupa untuk mengeget data prodaknya untuk mengkompailed apakah sudah sesuai ataubelum
            axios.get(`${LinkAPI}products?${linkURLToGetDataProduct}`)
            .then((res) => {
                // bila suda simpan respon data di state
                this.setState({dataProducts: res.data})
                
                console.log(this.state.dataProducts)
                this.getOrderSummary()
            })
            .catch((err) => {
                console.log(err)
            })
        })

        .catch((err) => {
            console.log(err)
        })
    }

    getOrderSummary = () => {
        let totalItem = 0
        let totalPrice = 0

        this.state.dataCarts.forEach((value, index) => {
            totalItem += value.quantity
            totalPrice += (this.state.dataProducts[index].price) * value.quantity
        })

        this.setState({totalItem: totalItem, totalPrice: totalPrice})
    }

    updateQuantity = (button, idCart, quantity) => {
        let quantityDBcart = quantity
        let quantityBaru = 0
        if(button === 'Plus'){
            quantityBaru = quantityDBcart + 1
        }else{
            quantityBaru = quantityDBcart - 1
        }

        axios.patch(`${LinkAPI}cart/${idCart}`, {quantity: quantityBaru})
        .then((res) =>{
            if(res.status === 200){
                this.getDataCarts()
            }
        })
    }

    deleteProduct = (idCart) => {
       swal({
            title: "Are you sure want to delete this product?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) =>{
              if(willDelete){
                  axios.delete(`${LinkAPI}cart/${idCart}`)
                  .then((res) =>{
                    swal({
                        title: "Product delete succesfull!",
                        icon: "success",
                        button: "Ok",
                        
                    });

                    this.getDataCarts()
                  })
                  .catch((err) =>{
                    swal({
                        title: {err},
                        icon: "cancel",
                        button: "Ok",
                    });

                  })
                  window.location = '/cart'
              }
          })
    }

    createTranssaction = () =>{
        // ambil IdUser
        let idUser = localStorage.getItem('id')


        // get Tangganggal dan waktu transaksi
        let date = new Date()
        date = date.toString()

        let newDate = (`${date.split(' ')[2]}-${date.split(' ')[1]}-${date.split(' ')[3]} ${date.split(' ')[4]}`)

        // Get total Price
        let totalPrice = this.state.totalPrice

        // get Items
        let detailItems = this.state.dataCarts.map((value, index) =>{
            return{
                
                productName : this.state.dataProducts[index].name,
                productId: this.state.dataProducts[index].id,
                productPrice: this.state.dataProducts[index].price,
                productQuantity: value.quantity,
                productImage: this.state.dataProducts[index].img
            }
            
        })

        const dataToSend = {
            idUser: idUser,
            status: 'Belum Terbayar',
            createdAt: newDate,
            total: totalPrice,
            detile: detailItems
        }

        // post / creat transaction
        axios.post(`${LinkAPI}transaction`, dataToSend)
        .then((res) =>{
            // setelah berhasil create update stock product
            let idTransaction = res.data.id

            this.state.dataCarts.forEach((value, index) =>{
                let stockSeblum = this.state.dataProducts[index].stock
                let stockTerbaru = stockSeblum - value.quantity
                axios.patch(`${LinkAPI}products/${value.idProduct}`, {stock: stockTerbaru})
                .then((res) =>{
                    // setelah update data baru delete
                    axios.delete(`${LinkAPI}cart/${value.id}`)
                        .then((res) =>{
                            console.log(res)
                            window.location = `/check-out/${idTransaction}`

                        })
                        .catch((err) =>{
                            console.log(err)
                        })
                })
                .catch((err) =>{
                    console.log(err)
                })
            })
        })
        .catch((err) =>{

            console.log(err)
        })
    }

    render(){

        if(this.state.dataCarts === null || this.state.dataProducts === null){
            return(
                null
            )
        }
        return(
            <div className="container mt-3 "  >
                <div className="row justify-content-between px-4 py-3">

                    {/* sisih kiri */}
                    <div className="col-12 col-lg-6 " style={{width: '60%', boxShadow: "-1px 2px 5px grey", borderRadius: '15px'}} >
                        <h3 className="mb-1 p-3">
                            Shopping Cart :
                        </h3>
                        <hr/>

                        {
                             this.state.dataCarts.map((value, index) =>{
                                 return(
                                   
                                    <div className="row p-3" key={index}>
                                        <div className="col-5">
                                            <img src={this.state.dataProducts[index].img} alt="" height="120px" width="100%"/>
                                        </div>

                                        <div className="col-7 ">
                                            <div>
                                                <h5>{this.state.dataProducts[index].name}</h5>
                                                
                                                       <div >
                                                            
                                                            <h6 style={{fontSize: '15px' }}>
                                                            Rp. {((this.state.dataProducts[index].price).toLocaleString())}
                                                            </h6>
                                                       </div>
                                                        
                                                        
                                                
                                            </div>
                                            <div className="d-flex justify-content-between align-items-end mt-3" style={{ position: 'relative'}}>
                                                <button disabled={value.quantity === 1? true : false} className='btn btn-outline-dark' onClick={() => this.updateQuantity('Minus', value.id, value.quantity)} style={{height: '30px',textAlign:'center'}}>
                                                    <FontAwesomeIcon icon={faArrowCircleDown} style={{marginBottom: '10px'}} />
                                                </button>
                                                <span className='' >
                                                    {value.quantity}
                                                </span>
                                                <button disabled={value.quantity === this.state.dataProducts[index].stock? true : false} className='btn btn-outline-dark' onClick={() => this.updateQuantity('Plus', value.id, value.quantity)} style={{height: '30px',textAlign:'center'}}>
                                                    <FontAwesomeIcon icon={faArrowCircleUp} style={{marginBottom: '10px'}} />
                                                </button>

                                                <div className=''>
                                                <div className='btn btn-outline-dark justify-content-center align-items-center' onClick={() => this.deleteProduct(value.id)} style={{height: '30px',textAlign:'center'}}>
                                                    <FontAwesomeIcon icon={faTrashAlt} style={{marginBottom: '10px'}} />
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr/>
                                    </div>

                                   
                                 )
                             })
                        }
                    </div>

                    {/* sisih kanan */}
                    <div className="border col-12 col-lg-5 mt-5 mt-lg-0" style={{width: '38%', boxShadow: "-1px 2px 5px grey", borderRadius: '15px'}} >
                        <div className=' bg-white'>
                            <div className='col-12 p-3'>
                                    <h3 style={{textAlign: 'center'}}>
                                        Order Summary
                                    </h3>
                                    <hr/>
                                    <div className ='p-1'>
                                        {
                                            this.state.dataCarts.map((value, index) =>{
                                                return(
                                                <div className="d-flex justify-content-between">
                                                    <span style={{width: '200px'}}>
                                                        {this.state.dataProducts[index].name}
                                                    </span>
                                                    <span>
                                                        {value.quantity}
                                                    </span>
                                                    <span>
                                                        Rp. {(this.state.dataProducts[index].price).toLocaleString()}
                                                    </span>
                                                </div>
                                                )
                                            })
                                        }
                                        <hr/>
                                       <div className="d-flex justify-content-between">
                                            <div>
                                                Total Item
                                            </div>

                                            <div >
                                                {this.state.totalItem} Item
                                            </div>
                                       </div>
                                        
                                    </div>
                                    
                                    <hr/>
                            </div>
                            <div className='col-12'>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <h5>Order Total</h5>
                                    </div>
                                    <div>
                                        <h5>
                                            Rp. {this.state.totalPrice.toLocaleString()}
                                        </h5>
                                    </div>
                                </div> 
                            </div> 
                                    
                                    {/* Button here */}
                                    
                        </div>
                        <div className ='d-flex justify-content-center mt-4 mb-2'>
                            {   this.state.idUser && this.state.totalItem !==0 ?
                                    <div className = 'ml-3 mb-3'>
                                        <input type='button' value='Checkout' className ='btn btn-warning' onClick={this.createTranssaction} />
                                    </div>
                                    :
                                    null
                            
                            }
                                
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}