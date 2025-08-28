import './App.css'
import Locations from '@components/Locations'
import DogsSelector from './components/DogsSelector'
import DogsDescription from './components/DogsDescription'
import React, { useState } from 'react'

function App() {
    const [breed, setBreed] = useState('')
    function onDogSelected(event: React.ChangeEvent<HTMLSelectElement>) {
        setBreed(event.target.value)
    }

    return (
        <>
            <DogsSelector onDogSelected={onDogSelected} />
            <br />
            <DogsDescription breed={breed} />
            <br />
            <br />
            <Locations />
        </>
    )
}

export default App
