import {  createContext, useState } from "react";
import PropTypes from 'prop-types'

export const StockContext = createContext({})

StockContextProvider.propTypes = {
    children: PropTypes.node
}

export function StockContextProvider( {children} ) {
    const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem('stock')
        if(!storedItems) {
            return []
        } else {
            const items = JSON.parse(storedItems)
            items.forEach((item) => {
                item.createdAt = new Date(item.createdAt) 
                item.updatedAt = new Date(item.updatedAt)
            })
            return items
        }
    })

    const addItem = (item) => {
        setItems(currentState => {
            const updatedItems = [item, ...currentState] 
            localStorage.setItem('stock', JSON.stringify(updatedItems))
            return updatedItems
        })
    }

    const updateItem = (itemId, newAttributes) => {
        setItems(currentState => {
            const itemIndex = currentState.findIndex(item => item.id === +itemId)
            const updatedItems = [...currentState]
            Object.assign(updatedItems[itemIndex], newAttributes, { updatedAt: new Date()})
            localStorage.setItem('stock', JSON.stringify(updatedItems))
            return updatedItems
        })
    }

    const deleteItem = (itemId) => {
        setItems(currentState => {
            const updateItems = currentState.filter(item => item.id !== itemId)
            localStorage.setItem('stock', JSON.stringify(updateItems))
            return updateItems
        })
    }

    const getItem = (itemId) => {
        return items.find(item => item.id === +itemId)
    }

    const stock = {
        items,
        addItem,
        getItem,
        updateItem,
        deleteItem,
        
    }

    return (
        <StockContext.Provider value={stock}>
            {children}
        </StockContext.Provider>
    )
}