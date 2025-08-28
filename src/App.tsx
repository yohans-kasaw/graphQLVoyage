import './App.css'
import Locations from '@components/Locations'
import DogsSelector from './components/DogsSelector'
import DogsDescription from './components/DogsDescription'
import React, { useState } from 'react'

function App() {
    const [id, setId] = useState<number>(1)
    function onDogSelected(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = +event.target.value
        setId(isNaN(value) ? 1 : value)
    }

    return (
        <>
            <DogsSelector onDogSelected={onDogSelected} />
            <br />
            <DogsDescription id={id} />
            <br />
            <br />
            <Locations />
        </>
    )
}

export default App
