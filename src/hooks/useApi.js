import {useState, useCallback} from 'react';
import axios from 'axios'

function useApi(setData ){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const fetchData = useCallback(async (method,url,body=null)=>{
        setLoading(true);
        setError(null);
        try{
            let res
            if(method === 'get'){
                res = await axios.get(url);
                setData(res.data);
            }else if(method === 'post'){
                res = await axios.post(url,body);
                
            }else if(method === 'put'){
                res = await axios.put(url,body);
                
            }else if(method === 'delete'){
                res = await axios.delete(url,{
                    data:body
                });
                
            }
            return res;
        }catch(err){
            setError('Error al hacer peticion')
            return err.response;
        }finally{
            setLoading(false)
        }
    }, [setData])

    return {loading, error,fetchData}
}

export default useApi