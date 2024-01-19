import app from './app.js'
import mongoose from 'mongoose'


mongoose.connect(process.env.MONGODB)
  .then(() => {
    console.log('Connected to MongoDB!')

    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`Connected to the server: port ${port}!`))
  }).catch(err => {
  console.log(err)
})

