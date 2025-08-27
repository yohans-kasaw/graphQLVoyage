import { GET_LOCATIONS } from '@lib/queries.ts'

export default [
    {
        request: {
            query: GET_LOCATIONS,
            variables: {},
        },
        result: {
            data: {
                locations: [
                    {
                        id: '1',
                        name: 'Rufus',
                        description: 'Poodle',
                    },
                    {
                        id: '2',
                        name: 'Buddy',
                        description: 'Golden Retriever',
                    },
                ],
            },
        },
    },
]
