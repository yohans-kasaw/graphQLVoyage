import './App.css'
import Locations from '@components/Locations'
import DogsSelector from './components/DogsSelector'
import DogsDescription from './components/DogsDescription'
import React, { useState, Suspense } from 'react'

function App() {
    const [id, setId] = useState<number>(1)
    function onDogSelected(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = +event.target.value
        setId(isNaN(value) ? 1 : value)
    }

    return (
        <>
            <Suspense fallback={<div>..leading</div>}>
                <DogsSelector onDogSelected={onDogSelected} />
            </Suspense>
            <br />
            <Suspense fallback={<div>..leading</div>}>
                <DogsDescription id={id} />
            </Suspense>
            <br />
            <br />
            <Locations />
        </>
    )
}

export default App
