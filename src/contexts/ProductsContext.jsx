import productData from '../data/products.json'
import React, {useContext, createContext, useState} from 'react'

const ProductContext = createContext({
    products: [],
    setProducts: ()=>{},
    productSelected: null,
    setProductSelected: () => {},
})

export function ProvideProduct({children}){
    const [products, setProducts] = useState(productData);
    const [productSelected, setProductSelected] = useState(null);

    const conextValues = React.useMemo(()=>({
        products,
        setProducts,
        productSelected,
        setProductSelected,
    }),
    [products, productSelected]
    );


    return (
        <ProductContext.Provider value={conextValues}>
            {children}
        </ProductContext.Provider>
    )
}


export const useProduct = () => useContext(ProductContext)

