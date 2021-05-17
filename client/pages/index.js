import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return (
    <div>
      { currentUser ? <h1>You are signed in</h1> : <h1>You must sign in</h1> }
    </div>
  );
};

// getInitialProps: function that gets execute on the server side
// before the component render
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')
  return data
}

export default LandingPage;