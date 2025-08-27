import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { GetLocationsData } from '@lib/types'

const GET_LOCATIONS = gql`
    query GetLocations {
        locations {
            id
            name
            description
            photo
        }
    }
`

function Locations(){

    const { loading, data, error } = useQuery<GetLocationsData>(GET_LOCATIONS)

    if (loading) return <> ... leading </>
    if (error) return <> Error {error.message}</>
    if (!data) return <>404 No data</>

    return data.locations.map(({ id, name, photo, description }) => (
        <div key={id} className='m-auto w-1/2'>
            <h3>{name}</h3>
            <div className="flex justify-center">
                <img
                    height="50px"
                    width="300px"
                    alt="location_image"
                    src={photo}
                />
            </div>
            <br />
            <b>About this location:</b>
            <div className='text-left'>{description}</div>
        </div>
    ))

}

export default Locations
