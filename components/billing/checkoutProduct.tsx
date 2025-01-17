import { API_URL } from "@/config";

const CheckoutForm: React.FC = () => {
    return (
      <form action={`${API_URL}/api/stripe/create-checkout-session`} method="POST" className="mt-8">
            <button className="button w-full py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300">
                Checkout
            </button>
      </form>
    );
};

export default CheckoutForm;