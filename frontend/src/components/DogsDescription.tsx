import { useSuspenseQuery } from '@apollo/client/react'
import { GET_DOG_BY_ID } from '@src/lib/queries'
import type { Dog } from '@src/lib/types'

function DogsDescription({ id }: { id: number }) {
    const { data, error } = useSuspenseQuery<{ dog: Dog }>(GET_DOG_BY_ID, {
        variables: { id },
    })

    if (error) return <>error .. {error.message}</>

    return (
        <>
            <div>{data.dog.name}</div>
            <div>{data.dog.breed}</div>
            <div>{data.dog.description}</div>
        </>
    )
}

export default DogsDescription
