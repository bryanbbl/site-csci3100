import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products (Matches FR03.1.1)
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const res = await axios.get(`/api/products?search=${searchQuery}`);
  //     setProducts(res.data.products);
  //   };
  //   fetchProducts();
  // }, [searchQuery]);

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search gems..." 
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="product-grid">
        {products.map(product => (
          <ProductCard 
            key={product._id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
}

export default Products;