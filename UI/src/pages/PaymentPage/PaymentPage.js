import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutPayment';
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.REACT_APP_STRIPE_KEY || '';
//Publishable Key
const stripePromise = loadStripe(stripePublishableKey);

const PaymentPage = (props) => {

    const options = {
        mode: 'payment',
        amount: 100,
        currency: 'usd',
        // Fully customizable with appearance API.
        appearance: {
            theme: 'flat'
        },
      };
  return (
    <div>
        <Elements stripe={stripePromise} options={options}>
             <CheckoutForm {...props}/>   
        </Elements>
    </div>
  )
}

export default PaymentPage