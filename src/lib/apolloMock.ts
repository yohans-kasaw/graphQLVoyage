import { GET_LOCATIONS, GET_DOGS, GET_DOG_BY_BREED } from '@lib/queries.ts'

export default [
    {
        request: {
            query: GET_LOCATIONS,
        },
        result: {
            data: {
                locations: [
                    {
                        id: '1',
                        name: 'Mars',
                        description: 'next to earth',
                    },
                    {
                        id: '2',
                        name: 'Earth',
                        description: "You live there, don't you",
                    },
                ],
            },
        },
    },
    {
        request: {
            query: GET_DOG_BY_BREED,
            variables: { breed: 'Golden Retriever' },
        },
        result: {
            data: {
                id: 1,
                name: 'Buddy',
                breed: 'Golden Retriever',
                description:
                    'A friendly and loyal family dog known for a gentle temperament and a playful attitude.',
            },
        },
    },
    {
        request: {
            query: GET_DOG_BY_BREED,
            variables: { breed: 'Labrador Retriever' },
        },
        result: {
            data: {
                id: 2,
                name: 'Lucy',
                breed: 'Labrador Retriever',
                description:
                    'An energetic and outgoing dog that is highly trainable and loves to swim and play fetch.',
            },
        },
    },
    {
        request: {
            query: GET_DOGS,
        },
        result: {
            data: {
                dogs: [
                    {
                        id: 1,
                        name: 'Buddy',
                        breed: 'Golden Retriever',
                        description:
                            'A friendly and loyal family dog known for a gentle temperament and a playful attitude.',
                    },
                    {
                        id: 2,
                        name: 'Lucy',
                        breed: 'Labrador Retriever',
                        description:
                            'An energetic and outgoing dog that is highly trainable and loves to swim and play fetch.',
                    },
                    {
                        id: 3,
                        name: 'Max',
                        breed: 'German Shepherd',
                        description:
                            'A highly intelligent and courageous dog, often used in police and military roles due to its strong work ethic.',
                    },
                    {
                        id: 4,
                        name: 'Daisy',
                        breed: 'Beagle',
                        description:
                            'A small, compact hound with a keen sense of smell, known for being cheerful and curious.',
                    },
                    {
                        id: 5,
                        name: 'Rocky',
                        breed: 'Bulldog',
                        description:
                            'A dog with a distinctive wrinkled face and a calm, dignified demeanor. They are known for being gentle and courageous.',
                    },
                    {
                        id: 6,
                        name: 'Sadie',
                        breed: 'Poodle',
                        description:
                            'An elegant and intelligent dog with a hypoallergenic coat. They are active and highly trainable.',
                    },
                ],
            },
        },
    },
]
