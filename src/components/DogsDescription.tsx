import { useQuery } from '@apollo/client/react'
import { GET_DOG_BY_BREED } from '@src/lib/queries'
import type { Dog } from '@src/lib/types'

function DogsDescription({ breed }: { breed: string }) {
    const { loading, data, error } = useQuery<Dog>(GET_DOG_BY_BREED, {
        variables: { breed },
    })

    if (loading) return <>...loading</>
    if (error) return <>error .. {error.message}</>
    if (!data) return <> no data yet</>

    return <>
        <span>{data.name}</span>
        <span>{data.breed}</span>
        <span>{data.description}</span>
    </>
}

export default DogsDescription
