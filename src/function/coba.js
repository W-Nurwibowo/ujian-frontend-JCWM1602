function Email (inputEmail) {
     // email di pisah berdasarkan '@'
     let emailSplit = inputEmail.split('@')

     // cek element email..terdiri dari 2 elemen string bila tidak false
     if(emailSplit.length !== 2) return false
 
     let emailName = emailSplit[0]
     
     
     emailName.forEach((value, index) => {
         
 
     });
 
     // cek elemen 1 bila di awali angka => false
     if(emailName[0] >= 0) return false
 
     let hostingEmail = emailSplit[1]
 
     // pemisahan hosting berdasrkan '.'
     let houstingEmailSplit = hostingEmail.split('.')
     
     if(houstingEmailSplit <= 1)  return false
         for(let i = 0; i < houstingEmailSplit.length; i++){
             if(houstingEmailSplit[i] === ''|| houstingEmailSplit === ' '){
                 console.log('false')
                 return false
             }
         }
         console.log('true')
     return true

}

Email('wahyu12@gmail.com')
Email('wahyu@gmail.com')