import { configureStore } from '@reduxjs/toolkit'
import CompareProductsSlice from './features/CompareProductsSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            productCompare: CompareProductsSlice
        },
    })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']