require('dotenv').config()

const app = require('express')()
const { graphqlHTTP } = require('express-graphql')
const graphqlSchema = require('./schemas/user')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://root:W_6wFTntyNew3s3@cluster0.6813q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection error', err))

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true
}))

app.listen(process.env.PORT, () => console.log(`Now browse to localhost:${process.env.PORT}/graphql`))