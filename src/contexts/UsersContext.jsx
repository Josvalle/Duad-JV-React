import React, {useContext, createContext, useState, useEffect} from 'react'

const UsersContext = createContext({
    users: [],
    setUsers: ()=>{},
    userLogin: (false),
    setUserLogin:()=>{},
    userAdmin: (false),
    setUserAdmin:()=>{},
})

export function ProvideUsers({children}){
    const [users, setUsers] = useState([]);
    const [userLogin,setUserLogin] = useState(false);
    const [userAdmin,setUserAdmin] = useState(false);

    const userValues = React.useMemo(()=>({
        users,
        setUsers,
        userLogin,
        setUserLogin,
        userAdmin,
        setUserAdmin
    }),
    [users,userLogin,userAdmin]);

    return(
        <UsersContext.Provider value={userValues}>
            {children}
        </UsersContext.Provider>
    )
}

export const useUsers = () => useContext(UsersContext)