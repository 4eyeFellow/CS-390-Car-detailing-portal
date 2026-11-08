function SignIn({ navigate }) {
  return (
    <div className="page">
      <h1>Sign In</h1>
      <p>Sign-in form will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default SignIn