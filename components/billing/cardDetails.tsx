interface Last4DisplayProps {
    last4: string | null;
};
  
const Last4Display: React.FC<Last4DisplayProps> = ({ last4 }) => {
    if (!last4) return null;
  
    return (
        <div className="mt-4 text-center">
            <p className="text-lg text-gray-800">Last 4 digits of the card: **** **** **** {last4}</p>
        </div>
    );
};  

export default Last4Display;