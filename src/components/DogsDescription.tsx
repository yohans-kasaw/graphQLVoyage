import { useQuery } from '@apollo/client/react'
import { GET_DOG_BY_ID } from '@src/lib/queries'
import type { Dog } from '@src/lib/types'

function DogsDescription({ id }: { id: number }) {
    const { loading, data, error } = useQuery<{ dog: Dog }>(GET_DOG_BY_ID, {
        variables: { id },
    })

    if (loading) return <>...loading</>
    if (error) return <>error .. {error.message}</>
    if (!data) return <> no data yet</>

    return (
        <>
            <div>{data.dog.name}</div>
            <div>{data.dog.breed}</div>
            <div>{data.dog.description}</div>
        </>
    )
}

export default DogsDescription
