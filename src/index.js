import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost'
import 'dotenv/config'

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN} `
      }
    })
  }
})

const GET_REPOSITORY_OF_ORGANIZATION = gql`
  query($organization: String!, $cursor: String){
      organization(login: $organization){
          name,
          url
          repositories(
              first: 5
              orderBy: {direction: DESC, field: STARGAZERS}
              after: $cursor
          ){
              edges{
                  node{
                      name
                      url
                  }
              }
              pageInfo {
                  endCursor
                  hasNextPage
              }
          }
      }
  }
  fragment repository on Repository {
      name
      url
  }
`

client
  .query({
    query: GET_REPOSITORY_OF_ORGANIZATION,
    variables: {
      organization: 'the-road-to-learn-react',
      cursor: undefined
    }
  })
  // resolve the first page
  .then(result => {
    const { pageInfo, edges } = result.data.organization.repositories
    const { endCursor, hasNextPage } = pageInfo

    console.log('second page', edges.length)
    console.log('endCursor', endCursor)
    return pageInfo

  })
  // query second page
  .then(({ endCursor, hasNextPage}) => {
    if (!hasNextPage){
      throw Error('no next page')
    }
    return client.query({
      query: GET_REPOSITORY_OF_ORGANIZATION,
      variables: {
        organization: 'the-road-to-learn-react',
        cursor: endCursor
      }
    })
  })
  // resolve second page
  .then(result => {
    const { pageInfo, edges } = result.data.organization.repositories
    const { endCursor, hasNextPage } = pageInfo

    console.log('second page', edges.length)
    console.log('endCursor', endCursor)
    return pageInfo
  })
  // log error when there is no next page
  .catch(console.log)

const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!){
      addStar(input: { starrableId: $repositoryId }){
          starrable{
              id
              viewerHasStarred
          }
      }
  }
`
const REMOVE_STAR = gql`
  mutation removeStar($repositoryId: ID!){
      addStar(input: { starrableId: $repositoryId }){
          starrable{
              id
              viewerHasStarred
          }
      }
  }
`

client
 .mutate({
    mutation: ADD_STAR,
    variables: {
      repositoryId: "MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw=="
    }
  })
  .then(console.log)




const userCredentials = { firstname: 'Aimable' };
const userDetails = { nationality: 'Rwandan/Italian' };

const user = {
  ...userCredentials,
  ...userDetails,
};

console.log(user);

console.log(process.env.SOME_ENV_VARIABLE);
