import { createContext } from 'react'

export const chatContext = createContext([]);

export const chatProvider = (props: any) => {
    return (
        <chatContext.Provider value={props.children} />
    )
}