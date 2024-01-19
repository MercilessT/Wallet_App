import axios from 'axios'


export const handleSignup = async (email, password, name) => {
  try {
    const response = await axios.post('api/auth/signup',
      {
        email,
        password,
        name,
      })
    console.log(response.data)
    return { status: 201 }
  } catch (err) {
    console.log('Error during signup:', err)
    return { status: err.response.status }
  }
}
