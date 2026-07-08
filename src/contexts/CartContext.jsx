import React, {useContext, createContext, useState} from "react";
import axios from "axios";
import useApi from "../hooks/useApi";

const CartContext = createContext({
    cart: [],
    total:null,
    bError:false,
    setCart: ()=>{},
    addToCart:()=>{},
    deleteToCart:()=>{},
    reduceToCart:()=>{},
    loadCart:()=>{}
})

export function ProvideCart({children}){
    const [cart, setCart] = useState([]);
    const { loading, error, fetchData } = useApi(setCart);
    const [bError,setBError] = useState(false)
    const API_URL = import.meta.env.VITE_URL;


    const total = React.useMemo(() => {
        return cart.reduce((counter, item) => {
            return counter + item.cantidad * item.precio;
                    }, 0);
                            }, [cart]);


    async function loadCart(userID) {
        const cartData = await fetchData('get',`${API_URL}/cart/${userID}`)
        setCart(cartData.data)
        
    }

    async function addToCart(apiUrl,itemID,userID){
        setBError(false)

        try{
            const itemExist = cart.some( item => item.id === itemID)
            

        if(itemExist === true){
            await axios.put(`${apiUrl}/cart/details/add/${itemID}`)
            await axios.put(`${apiUrl}/products/details/reduce/${itemID}`)
            const cartItems = await axios.get(`${apiUrl}/cart/${userID}`)
            setCart(cartItems.data) 
        }else{
            const backend_item = {
                'user_id': userID,
                'product_id':itemID,
                "cantidad": 1
            }
            await axios.post(`${apiUrl}/cart/new`, backend_item)
            await axios.put(`${apiUrl}/products/details/reduce/${itemID}`)
            const cartItems = await axios.get(`${apiUrl}/cart/${userID}`)
            setCart(cartItems.data)  
            
            }
        }catch{
            setBError(true)
        }
        
    }

    async function deleteToCart(apiUrl,itemID,userID,quantity) {
        setBError(false)

        try{
            if(quantity ===1){
            await axios.delete(`${apiUrl}/cart/delete/${itemID}`, {data: {"user_id":userID}} )
            const cartItems = await axios.get(`${apiUrl}/cart/${userID}`)
            setCart(cartItems.data)
        }else{
            const body = {
                            "stock":quantity
                        }
            await axios.delete(`${apiUrl}/cart/delete/${itemID}`, {data: {"user_id":userID}} )
            await axios.put(`${apiUrl}/products/details/adding/${itemID}`, body)
            const cartItems = await axios.get(`${apiUrl}/cart/${userID}`)
            setCart(cartItems.data)
        }
        }catch{
            setBError(true)
        }
        
    }

    async function reduceToCart(apiUrl,itemID,userID) {
        setBError(false)

        try{
            await axios.put(`${apiUrl}/cart/details/reduce/${itemID}`);
            await axios.put(`${apiUrl}/products/details/adding/${itemID}`);
            const cartItems = await axios.get(`${apiUrl}/cart/${userID}`);
            setCart(cartItems.data);
        }catch{
            setBError(true)
        }
        
    }


    const contextValues = React.useMemo(()=>({
        cart,
        total,
        setCart,
        addToCart,
        deleteToCart,
        reduceToCart,
        loadCart,
        bError,
        loading,
        error,
    }),[cart,total,bError,addToCart,deleteToCart,reduceToCart,loadCart,loading,error]);

    return(
        <CartContext.Provider value={contextValues}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)