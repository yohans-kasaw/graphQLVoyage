import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


import { MockedProvider } from '@apollo/client/testing/react'
import apolloMock from './lib/apolloMock.ts'

// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
// import { ApolloProvider } from '@apollo/client/react'
// const apolloClient = new ApolloClient({
//     link: new HttpLink({ uri: 'https://flyby-router-demo.herokuapp.com/' }),
//     cache: new InMemoryCache(),
// })


const rootElm = document.getElementById('root')
if (!rootElm) {
    throw new Error('Failed to find the root element with ID "root".')
}

createRoot(rootElm).render(
    <MockedProvider mocks={apolloMock}>
      <StrictMode>
          <App />
      </StrictMode>
    </MockedProvider>

    //<ApolloProvider client={apolloClient}>
    //    <StrictMode>
    //        <App />
    //    </StrictMode>
    //</ApolloProvider>
)
