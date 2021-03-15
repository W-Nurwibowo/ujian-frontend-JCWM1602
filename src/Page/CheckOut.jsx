import axios from 'axios'
import React from 'react'
import LinkAPI from '../Const/LinkAPI'

export default class Checkout extends React.Component{

    state ={
        dataTransaction: null
    }

    componentDidMount(){
        this.getDtaTransaction()
    }

    getDtaTransaction = () => {

        let idTransaction = this.props.location.pathname.split('/')[2]
        
        axios.get(`${LinkAPI}transaction/${idTransaction}`)
        .then((res) => {
            console.log(res.data)
            this.setState({dataTransaction: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    payment = () => {

        let confirm = window.confirm('AKan melakukan Pembayaran??')

        if(confirm){

            let idTransaction = this.props.location.pathname.split('/')[2]
            let date = new Date()
            date = date.toString()
    
            let newDate = `${date.split(' ')[2]}-${date.split(' ')[1]}-${date.split(' ')[3]} ${date.split(' ')[4]}`
    
            axios.patch(`${LinkAPI}transaction/${idTransaction}`, {status: 'Terbayar', createdAt: newDate})
            .then((res) =>{
                console.log(res)
                if(res.status === 200){
                    alert('Product Telah Dibayar')
                    window.location = '/user-history'
                }
            })
            .catch((err) =>{
                console.log(err)
            })

        }
    }
 
    render() {
        if(this.state.dataTransaction === null){
            return(
                <div>

                </div>
            )
        }
        return(
            <div className="container">
                
                <div >
                    {
                        this.state.dataTransaction.detile.map((value, index) =>{
                            return(
                                <div className="row">
                                    <div style={{width: '300px'}}>
                                        <img src={value.productImage} alt="" width="95%"/>
                                    </div>
                                    <div>
                                        <p>
                                         {value.productName}
                                        </p>
                                        <p>
                                            HArga : Rp {
                                                (value.productPrice).toLocaleString('id-ID')
                                            }
                                        </p>

                                        <div className="mt-1">
                                            <div>
                                                <p className="mb-1">Total Bayar</p>
                                                <b><h6 className="my-0">Rp. {(this.state.dataTransaction.total).toLocaleString()}</h6></b>
                                            </div>
                                            <button type="button" className="btn btn-success h-50" onClick={this.payment}>Bayar Sekarang</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                </div>

            </div>
        )
    }
}