import supertest from 'supertest'
import app from '../../../app.js'
import User from '../../models/User.js'
import bcrypt from 'bcryptjs'


jest.mock('../../models/User')


describe('updateUserToken controller', () => {
  const url = '/api/user/update_token'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('updateUserToken_successfully', async () => {
    const userData = {
      _id: 'id',
      email: 'email@example.com',
      password: 'password',
    }

    const user = {
      ...userData,
      toJSON: jest.fn().mockReturnValue(userData),
    }

    User.findOne.mockReturnValue(user)

    const response = await supertest(app)
      .post(url)
      .send({ _id: 'id' })

    expect(response.status).toBe(200)

  })

  it('updateUserToken_not_found', async () => {
    User.findOne.mockReturnValue(null)
    const response = await supertest(app)
      .post(url)
      .send({
        _id: 'id',
      })

    expect(response.status).toBe(404)
  })
})


describe('addTransaction controller', () => {
  const url = '/api/user/add_transaction'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('add_successfully', async () => {
    const userData = {
      _id: 'id',
      name: 'name',
      email: 'email@example.com',
      password: await bcrypt.hash('password', await bcrypt.genSalt(10)),
      transactions: [],
      save: jest.fn(),
    }

    const user = {
      ...userData,
      toJSON: jest.fn().mockReturnValue(userData),
    }

    User.findOne.mockReturnValue(user)

    const loginResponse = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'email@example.com',
        password: 'password',
      })

    expect(loginResponse.status).toBe(200)


    const userTransactions = {
      amount: 100,
      target: 'test',
    }

    const response = await supertest(app)
      .post(url)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send(userTransactions)

    expect(response.status).toBe(200)

    expect(user.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          amount: userTransactions.amount,
          target: userTransactions.target,
        }),
      ]),
    )
  })
})


describe('deleteTransaction controller', () => {
  const url = '/api/user/delete_transaction'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('delete_successfully', async () => {
    const userData = {
      _id: 'id',
      name: 'name',
      email: 'email@example.com',
      password: await bcrypt.hash('password', await bcrypt.genSalt(10)),
      transactions: [{
        _id: 'transaction_id',
        amount: 100,
        target: 'test',
      }],
      save: jest.fn(),
    }

    const user = {
      ...userData,
      toJSON: jest.fn().mockReturnValue(userData),
    }

    user.transactions.pull = jest.fn((query) => {
      user.transactions = user.transactions.filter(transaction => transaction._id !== query._id)
    })

    User.findOne.mockReturnValue(user)

    const loginResponse = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'email@example.com',
        password: 'password',
      })

    expect(loginResponse.status).toBe(200)

    const response = await supertest(app)
      .post(url)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send({
        transaction_id: 'transaction_id',
      })

    expect(response.status).toBe(200)

    expect(user.transactions).toEqual([])
  })
})