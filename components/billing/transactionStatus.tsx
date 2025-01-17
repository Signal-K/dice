interface TransactionStatusProps {
    status: string | null;
};
  
const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
    if (!status) return null;
  
    const bgColor = status === 'Transaction Successful' ? 'bg-green-500' : 'bg-red-500';
  
    return (
        <div className={`absolute top-0 left-0 w-full p-4 text-white ${bgColor}`}>
            <p className="text-center text-lg">{status}</p>
        </div>
    );
};  

export default TransactionStatus;