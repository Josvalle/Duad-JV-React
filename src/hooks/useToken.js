import {useState, useCallback} from 'react';
import axios from 'axios'

function useToken(setData){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const fetchDataToken = useCallback(async (method,url,body,token)=>{
        try{
            let res
            if (method === 'post'){
                res = await axios.post(url,body,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
            }else if(method === 'put'){
                res = await axios.put(url,body,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })

            }else if(method === 'delete'){res = await axios.delete(url,{
                    data:body
                },{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                } )}
        }catch(err){
            setError('No existe autorizacion para esta pagina ')
        }finally{
            setLoading(false)
        }
    },[setData])

    return {loading,error,fetchDataToken}
}

export default useToken