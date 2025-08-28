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

export const GET_DOG_BY_BREED = gql`
    query GetDogByBreed($breed: String!) {
        dog(breed: $breed) {
            id
            name
            breed
            description
        }
    }
`
