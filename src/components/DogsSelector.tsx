import { useSuspenseQuery } from '@apollo/client/react'
import { GET_DOGS } from '@lib/queries'
import type { Dog } from '@lib/types'
import React from 'react'

function DogsSelector({
    onDogSelected,
}: {
    onDogSelected: React.ChangeEventHandler<HTMLSelectElement>
}) {
    const { data, error } = useSuspenseQuery<{ dogs: Dog[] }>(GET_DOGS)

    if (error) return <>error .. {error.message}</>

    return (
        <>
            <h4 style={{ color: 'red' }}>select dog please</h4>
            <select name="select dog" onChange={onDogSelected}>
                {data.dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                        {dog.breed}
                    </option>
                ))}
            </select>
        </>
    )
}

export default DogsSelector
