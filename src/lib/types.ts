interface Location {
    id: string
    name: string
    description: string
    photo: string
}

interface GetLocationsData {
    locations: Location[]
}

export type { Location, GetLocationsData }
