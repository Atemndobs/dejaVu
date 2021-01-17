<template>
  <div>
    <div id="paypal-button-container"></div>
    <div v-if="success" class="alert alert-success">
      <strong>Success!</strong> Payment successfuly done
    </div>
    <div v-if="error" class="alert alert-danger">
      <strong>Ooops!</strong>  something went wrong
    </div>
  </div>
</template>

<script>
export default {
  name: "paypal",

  methods:{
    sendDataPaypal ( data) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:1337/checkoutpaypal',data)
          .then(res => {
            return resolve()
      }).catch((err) => {
        return reject(err)
      })
      })
  },
  mounted() {
    let  client = {
      sandbox:'your paypal sendbox client id ',
    }
    let  payment = (data, actions) => {
// Make a call to the REST api to create the payment
      return actions.payment.create({
        payment: {
          transactions: [
            {
              amount: { total:this.amount, currency: 'USD' }
            }
          ]
        }
      });
    }
    let  onAuthorize = (data) => {
      var data = {
        paymentID: data.paymentID,
        payerID: data.payerID,
        amount:this.amount
      };
      this.sendDataPaypal({data:data}).then(() => {
        this.success=true // to display the success message
      }).catch(err=>{
        this.error=true  // to display  the error message
      });
    }
    paypal.Button.render({
      env: 'sandbox', // sandbox | production
      commit: true,
      client,
      payment,
      onAuthorize
    }, '#paypal-button-container');
  }
  }
}
</script>

<style scoped>

</style>
