import { gql } from '@apollo/client'

export const GET_LOCATIONS = gql`
    query GetLocations {
        locations {
            id
            name
            description
        }
    }
`

export const GET_DOGS = gql`
    query GetDogs {
        dogs {
            id
            breed
        }
    }
`

export const GET_DOG_BY_ID = gql`
    query GetDogByBreed($id: Int!) {
        dog(id: $id) {
            id
            name
            breed
            description
        }
    }
`
