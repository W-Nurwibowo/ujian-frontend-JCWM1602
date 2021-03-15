import axios from 'axios'
import React from 'react'
import LinkAPI from '../Const/LinkAPI'


export default class Transaction extends React.Component{

    state = {
        dataPembelian: null,
        dataProduct: null,
        // detileProduct: null
    }

    componentDidMount(){
        this.onGetDataPembelian()
        this.onGetDataProduct()
    }

    onGetDataProduct = () =>{
        axios.get(`${LinkAPI}products`)
        .then((res) =>{
            console.log(res.data)
            this.setState({dataProduct: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onGetDataPembelian = () => {
        let id = localStorage.getItem('id')

        axios.get(`${LinkAPI}transaction?idUser=${id}`)
        .then((res) =>{
            console.log(res.data)
            this.setState({dataPembelian: res.data})
            // this.setState({detileProduct: res.data[0].detile})


        })
        .then((err) =>{
            console.log(err)
        })
    }

    redirectPage = (idTransaction) =>{
        window.location = `/check-out/${idTransaction}`
    }

    cancelPayment = (idTransaction, qty, idProduct) =>{
        let confirm = window.confirm('Cancel Transaksi?')
        let qtyDB 

        if(confirm){
            this.state.dataProduct.forEach((value, index) => {
                qtyDB = this.state.dataProduct[index].stock
                
                console.log(qtyDB)
                qtyDB += qty
    
                
                
                axios.get(`${LinkAPI}products?id=${idProduct}`)
    
                .then((res) =>{
                    
                    axios.patch(`${LinkAPI}products/${idProduct}`, ({stock: qtyDB}))
                    .then((res) =>{
    
                        axios.delete(`${LinkAPI}transaction/${idTransaction}`)
                        .then((res) =>{
                            console.log(res.status)
                            if(res.status === 200){
                                window.location = '/user-history'
                            }
                            
                        })
                        .catch((err) =>{
                            console.log(err)
                        })
                    })
                    .catch((err) =>{
                        console.log(err)
                    })
                })
                .catch((err) =>{
                    console.log(err)
                })
            });
            
        }

    }

    render(){
        if(this.state.dataPembelian === null || this.state.detileProduct === null){
            return(
                null
            )
        }
        return(
            <div className="">
                                <div className='container mt-3'>
                    {
                        this.state.dataPembelian.map((value, index) =>{
                            return(
                                <>
                                    <div className="row shadow py-4 mb-3">
                                        <div className="col-4">
                                                        <h5 style={{lineHeight: '5px'}}>Status :</h5>
                                                            <p>{value.status}</p>
                                                    </div>
                                        
                                        
                                        <div className="col-4 text-center border-left border-right">
                                            <p>
                                                {value.createdAt} WIB
                                            </p>
                                        </div>
                                        <div className="col-4 text-right">
                                            {
                                                value.status === 'Belum Terbayar' ?
                                                    <div>
                                                        <input type='button' value='Pay Now' className='btn btn-primary' onClick={() =>this.redirectPage(value.id)}  />
                                                        <input type='button' value='Cancel' className='btn btn-danger' onClick={()=>this.cancelPayment(value.id, value.detile[0].productQuantity, value.detile[0].productId)}  />
                                                    </div>
                                                :
                                                null
                                            }
                                            
                                        </div>

                                        {
                                            value.detile.map((value, index) =>{
                                                return(
                                                    <>
                                                        <div className="col-2 mt-3 mb-4">
                                                            {/* Image */}
                                                            <img src={value.productImage} width='100px' height='50px' />
                                                        </div>
                                                        <div className="col-6 mt-3 mb-4">
                                                            {/* Detail Product */}
                                                            <h6 style={{lineHeight: '5px'}}>
                                                                {value.productName}
                                                            </h6>
                                                            <p>
                                                                {value.productQuantity} Item x Rp {(value.productPrice).toLocaleString('id-ID')} <span className="mx-5">{(value.productDiscount ? `${value.productDiscount}%` : null)}</span>
                                                            </p>
                                                            
                                                        </div>

                                                        <div className="col-4 text-right mt-3 mb-4">
                                                            {/* Total Price Per-Product */}
                                                            <p>
                                                                Total Belanja
                                                            </p>
                                                            <h6>
                                                                <b>
                                                                    Rp {
                                                                    (value.productQuantity * value.productPrice).toLocaleString('id-ID')
                                                                    }
                                                                </b>
                                                            </h6>
                                                        </div>

                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                    
                                </>
                            )
                        })
                    }

                    
                </div>
            </div>
        )
    }
}