import { useState, createContext, useMemo } from 'react';

const UserContext = createContext();

const UserProvider = (props) => {
    const [token, setToken] = useState('');
    // the state that we'll be storing the username into

    /* because we will be providing an object to the provider, it is better to put the value inside a useMemo so that the component will only re-render when there's a change in the value. */

    const value = useMemo(
        () => ({ token, setToken }), [token])


    return (
        <UserContext.Provider
            value={value}
        >
            {props.children}
        </UserContext.Provider>
    );
}
export { UserContext, UserProvider };