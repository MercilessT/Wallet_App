import supertest from 'supertest'
import app from '../../../app.js'
import User from '../../models/User.js'
import bcrypt from 'bcryptjs'


jest.mock('../../models/User')


describe('signup controller', () => {
  const url = '/api/auth/signup'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('signup_successfully', async () => {
    const response = await supertest(app)
      .post(url)
      .send({
        name: 'name',
        email: 'email@example.com',
        password: 'password',
      })

    expect(response.status).toBe(201)
  })

  it('signup_no_email', async () => {
    const response = await supertest(app)
      .post(url)
      .send({
        password: 'password',
      })

    expect(response.status).toBe(400)
  })

  it('signup_no_password', async () => {
    const response = await supertest(app)
      .post(url)
      .send({
        email: 'email@example.com',
      })

    expect(response.status).toBe(400)
  })

  it('signup_duplicate_email', async () => {
    const existingEmail = 'existing@example.com'
    User.findOne.mockReturnValue({ email: existingEmail })

    const response = await supertest(app)
      .post(url)
      .send({
        email: existingEmail,
        password: 'password',
      })

    expect(response.status).toBe(409)
  })
})


describe('login controller', () => {
  const url = '/api/auth/login'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('login_successfully', async () => {
    const userData = {
      _id: 'id',
      name: 'name',
      email: 'email@example.com',
      password: await bcrypt.hash('password', await bcrypt.genSalt(10)),
    }

    const user = {
      ...userData,
      toJSON: jest.fn().mockReturnValue(userData),
    }

    User.findOne.mockReturnValue(user)

    const response = await supertest(app)
      .post(url)
      .send({
        email: 'email@example.com',
        password: 'password',
      })

    expect(response.status).toBe(200)
    expect(user.toJSON).toHaveBeenCalled()
  })

  it('login_wrong_credentials', async () => {
    const user = {
      _id: 'id',
      name: 'name',
      email: 'email@example.com',
      password: await bcrypt.hash('password', await bcrypt.genSalt(10)),
    }

    User.findOne.mockReturnValue(user)

    const response = await supertest(app)
      .post(url)
      .send({
        email: 'email@example.com',
        password: 'wrong_password',
      })

    expect(response.status).toBe(400)
  })

  it('login_user_not_found', async () => {
    User.findOne.mockReturnValue(null)

    const response = await supertest(app)
      .post(url)
      .send({
        _id: 'id',
        email: 'email@example.com',
        password: 'password',
      })

    expect(response.status).toBe(404)
  })

  it('login_no_email', async () => {
    const response = await supertest(app)
      .post(url)
      .send({
        password: 'password',
      })

    expect(response.status).toBe(400)
  })

  it('login_no_password', async () => {
    const response = await supertest(app)
      .post(url)
      .send({
        email: 'email@example.com',
      })

    expect(response.status).toBe(400)
  })
})


describe('logout controller', () => {
  const url = '/api/auth/logout'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('logout_unauthorized', async () => {
    const response = await supertest(app)
      .post(url)
      .send()

    expect(response.status).toBe(401)
  })

  it('logout_successfully', async () => {
    const userData = {
      _id: 'id',
      name: 'name',
      email: 'email@example.com',
      password: await bcrypt.hash('password', await bcrypt.genSalt(10)),
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

    const response = await supertest(app)
      .post(url)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send()

    expect(response.status).toBe(200)
  })

  it('login_logout_logoutSecondTime', async () => {
    const userData = {
      _id: 'id',
      name: 'name',
      email: 'email@example.com',
      password: await bcrypt.hash('password', await bcrypt.genSalt(10)),
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

    const responseFirstLogout = await supertest(app)
      .post(url)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send()

    expect(responseFirstLogout.status).toBe(200)

    const responseSecondLogout = await supertest(app)
      .post(url)
      .send()

    expect(responseSecondLogout.status).toBe(401)
  })
})
