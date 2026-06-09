import React, {useContext, createContext, useState, useEffect} from 'react'
import useApi from '../hooks/useApi'

const ProductContext = createContext({
    products: [],
    setProducts: ()=>{},
    productSelected: null,
    setProductSelected: () => {},
    loadProducts: ()=>{}

})

export function ProvideProduct({children}){
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState(null);
    const { loading, error, fetchData } = useApi(setProducts);

    const loadProducts = React.useCallback(()=>{
        fetchData('get','http://localhost:5000/products')
    },[fetchData])

    useEffect(()=>{
            loadProducts()
            
        },[loadProducts]);
    
    

    const conextValues = React.useMemo(()=>({
        products,
        setProducts,
        productSelected,
        setProductSelected,
        loading,
        error,
        loadProducts
    }),
    [products, productSelected,loading,error,loadProducts]
    );

    return (
        <ProductContext.Provider value={conextValues}>
            {children}
        </ProductContext.Provider>
    )
}


export const useProduct = () => useContext(ProductContext)

