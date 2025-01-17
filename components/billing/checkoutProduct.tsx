import { API_URL } from "@/config";

const CheckoutForm: React.FC = () => {
    return (
      <>
        <h1 className="text-lg text-blue-800">Individual Plan</h1>
        <form action={`${API_URL}/api/stripe/create-checkout-individual-monthly-session`} method="POST" className="mt-8">
          <button className="button w-full py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300">
            Purchase monthly plan for an individual user
          </button>
        </form>
        <h1 className="text-lg text-red-800">Team Plan</h1>
        <form action={`${API_URL}/api/stripe/create-checkout-team-monthly-session`} method="POST" className="mt-8">
          <button className="button w-full py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300">
            Purchase monthly plan for a team account
          </button>
        </form>
      </>
    );
};

export default CheckoutForm;