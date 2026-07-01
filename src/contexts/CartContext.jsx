import React, {useContext, createContext, useState} from "react";

const CartContext = createContext({
    cart: [],
    setCart: ()=>{}
})

export function ProvideCart({children}){
    const [cart, setCart] = useState([]);
    const contextValues = React.useMemo(()=>({
        cart,
        setCart
    }),[cart]);

    return(
        <CartContext.Provider value={contextValues}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)