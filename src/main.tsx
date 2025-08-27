import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

import './index.css'
import App from './App.tsx'

const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://flyby-router-demo.herokuapp.com/' }),
    cache: new InMemoryCache(),
})

const rootElm = document.getElementById('root')
if (!rootElm) {
    throw new Error('Failed to find the root element with ID "root".')
}

createRoot(rootElm).render(
    <ApolloProvider client={apolloClient}>
        <StrictMode>
            <App />
        </StrictMode>
    </ApolloProvider>,
)
