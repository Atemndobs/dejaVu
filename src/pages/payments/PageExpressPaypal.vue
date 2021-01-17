<template>
  <!-- Set up a container element for the button -->
  <div class="q-pa-xl">
    <q-btn color="teal" size="sm" label=" PayPal Smart Payment Buttons Integration | Server Demo ">
    </q-btn>
    <div class="q-pa-sm row items-start q-gutter-sm">
      <q-card class="my-card" flat bordered>
        <q-icon
          name="eva-shopping-cart-outline"
          size="50px"
        />
        <q-slide-transition>
          <div >
            <q-separator />
            <q-card-section >
              {{ amount }} EUR
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
    <div class="q-gutter-y-md" style="max-width: 600px" >

      <div id="paypal-button-container"></div>
    </div>
  </div>
</template>
<!-- Include the PayPal JavaScript SDK -->
<script>
export default {
name: "PageExpressPaypal",
  data() {

    return {
      amount:10,
      expanded: false,
      shop_url:"http://127.0.0.1:8000/api"
    }

  },
  methods:{
  notice(data){
           return     this.$q.notify({
                  message: data,
                  color: 'positive',
                  progress: true,
                  count:1,
                  // avatar: '../statics/avat_atem.png',
                  avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
                  actions: [
                    { label: 'Dismis',
                      color: 'white',
                      handler: () => { /!* ... *!/ }
                    }
                  ]
                })
    }
  },
  mounted() {
    let self = this
    // Render the PayPal button into #paypal-button-container
    paypal.Buttons({


      // Call your server to set up the transaction
      // https://payment.app/api/payment/create-order"
/*      createOrder: function(data, actions) {
        return fetch('http://127.0.0.1:8000/api/payment/create-order", {
          method: 'post'
        }).then(function(res) {
          return res.json();
        }).then(function(orderData) {
          return orderData.id;
        });
      },*/

      createOrder: function() {
        return fetch('http://127.0.0.1:8000/api/payment/create-order', {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          }
        }).then(function(res) {

          console.log(res)
          return res.json();
        }).then(function(data) {
          console.log(data)
          return data.order.id; // Use the same key name for order ID on the client and server
        });
      },

/*
      onShippingChange: function(data, actions) {

        return fetch('http://127.0.0.1:8000/api/payment/customer/'+ data.orderID, {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
         // body:    JSON.stringify(data)
        }).then(res => {
          if (!res || res.error) {
           // return actions.reject();
            console.log(res.error)
            console.log(res.order)
          }
          return actions.resolve();
        })
      },
*/


      onShippingChange: function(data, actions) {
        console.log( 'Shippind data ID:::')
        console.log( data)
/*        if (data.shipping_address.country_code !== 'DE') {
          return actions.reject();
        }*/

        const shippingAmount = data.shipping_address.country_code === 'DE' ? '5.00' : '5.00';
        return actions.order.patch([
          {
            op: 'replace',
            path: '/purchase_units/@reference_id==\'default\'/amount',
            value: {
              currency_code: 'EUR',
              value: (parseFloat(self.amount) + parseFloat(shippingAmount)).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: self.amount
                },
                shipping: {
                  currency_code: 'EUR',
                  value: shippingAmount
                }
              }
            }
          }
        ])
      },

      // Call your server to finalize the transaction
      onApprove: function(data, actions) {
        console.log('onApr: daata :')
        console.log(data)
        return fetch('http://127.0.0.1:8000/api/payment/order/' + data.orderID, {
          method: 'post'
        }).then(function(res) {

          console.log(res)
          return res.json();
        }).then(function(orderData) {
          console.log(orderData)
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you

          // This example reads a v2/checkout/orders capture response, propagated from the server
          // You could use a different API or structure for your 'orderData'
          var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

          if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
            return actions.restart(); // Recoverable state, per:
            // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
          }

          if (errorDetail) {
            var msg = 'Sorry, your transaction could not be processed.';
            if (errorDetail.description) msg += '\n\n' + errorDetail.description;
            if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
            return alert(msg); // Show a failure message
          }

          // Show a success message
          // alert('Transaction completed by ' + orderData.data.result.payer.name);
          let message = 'Transaction completed by ' + orderData.data.result.payer.name.given_name
          self.$q.notify({
            message: message,
            color: 'positive',
            progress: true,
            count:1,
            // avatar: '../statics/avat_atem.png',
            avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
            actions: [
              { label: 'Dismis',
                color: 'white',
                handler: () => { /!* ... *!/ }
              }
            ]
          })
        });
      }

    }).render('#paypal-button-container');
  }


  /*              onShippingChange: function(data, actions) {
                    console.log( 'Shippind data ID:::')
                    console.log( data)
                    /!*        if (data.shipping_address.country_code !== 'DE') {
                              return actions.reject();
                            }*!/

                    const shippingAmount = data.shipping_address.country_code === 'DE' ? '5.00' : '5.00';
                    return actions.order.patch([
                        {
                            op: 'replace',
                            path: '/purchase_units/@reference_id==\'default\'/amount',
                            value: {
                                currency_code: 'EUR',
                                value: (parseFloat(self.amount) + parseFloat(shippingAmount)).toFixed(2),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: self.amount
                                    },
                                    shipping: {
                                        currency_code: 'EUR',
                                        value: shippingAmount
                                    }
                                }
                            }
                        }
                    ])
                },*/

  /*  onShippingChange: function(data, actions) {
        return fetch('/expresscheckout/paypal', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body:    JSON.stringify(data)
        }).then(res => {


          //  return actions.resolve();
        });
    },*/



  /**
   *             let self = this

   // Render the PayPal button into #paypal-button-container
   paypal.Buttons({

                createOrder: function(data, actions) {

                    console.log(cart_id)
                    return actions.order.create({
                        purchase_units:purchase_units
                    });
                },


                // Finalize the transaction
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        // Show a success message to the buyer
                        console.log(details)

                        axios.get('https://local.fashionette.de/expresscheckout/paypal/complete')
                            .then(response => {
                                return response;
                            }).catch(error => {
                            console.log(error)
                        })
                    });
                }

            }).render('#paypal-button')


   */


}
</script>

<style scoped>

</style>



