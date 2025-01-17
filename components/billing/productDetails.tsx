export interface Product {
    name: string;
    price: number;
};
  
interface ProductDetailsProps {
    product: Product | null;
};
  
const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    if (!product) {
        return (
            <p className="text-center mt-8">No product details available.</p>
        );
    };
  
    return (
        <div className="product mt-16 flex justify-between items-center w-[480px] h-[150px] bg-gray-100 shadow-md p-4 mx-auto">
            <div className="description pl-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <h5 className="text-lg text-gray-700">${product.price}</h5>
            </div>
        </div>
    );
};  

export default ProductDetails;