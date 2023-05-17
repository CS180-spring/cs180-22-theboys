import React from "react";
import ProductGrid from './ProductGrid.js';
import ProductViewLabel from './ProductViewLabel.js'
import ProductFilterHeader from './ProductFilterHeader.js'
import useGetCards from '../Hooks/useGetCards.js';
import ProductFilter from './ProductFilter.js'
import '../Styles/GridStyles.css'
import '../Hooks/useGetCards.js'
import '../Styles/ProductViewPageStyles.css'

export default function ProductViewPage({}) {
    let products =  useGetCards();
    return (
      <div>
      <ProductViewLabel/>
      <ProductFilterHeader/>
        <div className="product-viewpage-body">
          <ProductFilter/>
          <ProductGrid products={products}/>
        </div>
      </div>
    );
  }
  