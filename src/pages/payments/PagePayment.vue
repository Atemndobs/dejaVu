<template>
<!--  <PayPal
    amount="10.00"
    currency="USD"
    :client="credentials"
    invoice-number="<some invoice number>">
  </PayPal>-->

  <div >
    <div class="q-pa-sm row items-start q-gutter-sm">
      <q-card class="my-card" flat bordered>
        <q-icon
          name="eva-shopping-cart-outline"
          size="50px"
        />

        <q-card-section>
          <div class="text-overline text-orange-9">Product</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Price : 10 €</div>
        </q-card-section>

        <q-card-actions>

          <q-space />

        </q-card-actions>

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

    <div id="paypal-button-container"></div>
  </div>

</template>




<script>

export default {
  name: "PagePayment",
  data() {
    return {
      amount:10,
      expanded: false,

    }

  },

  mounted() {
    // Render the PayPal button into #paypal-button-container

    paypal.Buttons({

      // Set up the transaction
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '10'
            }
          }]
        });
      },

      // Finalize the transaction
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          // Show a success message to the buyer
          alert('Transaction completed by ' + details.payer.name.given_name + '!');
        });
      }


    }).render('#paypal-button-container');
  }
}

</script>

<style scoped>

</style>
