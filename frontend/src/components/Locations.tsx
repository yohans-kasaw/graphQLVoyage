import { useQuery } from '@apollo/client/react'
import type { Location } from '@lib/types'
import { GET_LOCATIONS } from '@lib/queries'

function Locations() {
    const { loading, data, error } = useQuery<{ locations: Location[] }>(
        GET_LOCATIONS,
    )

    if (loading) return <> ... leading </>
    if (error) return <> Error {error.message}</>
    if (!data) return <>404 No data</>

    return data.locations.map(({ id, name, description }) => (
        <div key={id} className="m-auto w-1/2">
            <h3>{name}</h3>
            <span>About this location: </span>
            <i className="text-left">{description}</i>
            <br/>
            <br/>
        </div>
    ))
}

export default Locations
