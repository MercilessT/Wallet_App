<template>
  <div class='mt-[5px] min-h-[38rem] bg-bl text-gray-900 flex justify-center'>
    <div class='max-w-screen-xl m-0 bg-green-200 shadow lg:rounded-lg flex justify-center flex-1'>
      <div class='lg:w-1/2 p-6 sm:p-12'>
        <div class='flex flex-col items-center mt-14'>
          <h1 class='text-3xl font-extrabold'>
            Sign Up
          </h1>
          <div class='w-full flex-1 mt-16'>
            <!--            <div class='flex flex-col items-center'>-->

            <!--              <button-google-auth class='bg-green-100'>-->
            <!--                Sign Up with Google-->
            <!--              </button-google-auth>-->

            <!--            </div>-->

            <!--            <div class='my-4 mb-8 text-center border-b'>-->
            <!--              <div-->
            <!--                class='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>-->
            <!--                Or sign up with e-mail-->
            <!--              </div>-->
            <!--            </div>-->

            <div class='mx-auto max-w-xs'>
              <input
                v-model='name'
                class='mb-5 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white'
                placeholder='Name'
                name='name_input'
              />

              <input
                v-model='email'
                class='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white'
                type='email' placeholder='Email'
                name='email_input'
              />

              <div
                id='email_error'
                v-if='emailError'
                class='text-red-500 text-sm mt-1'>{{ emailError }}
              </div>

              <div class='relative mt-5'>

                <input
                  v-model='password'
                  :type="isPasswordHidden ? 'password' : 'text'"
                  class='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white pr-10'
                  placeholder='Password'
                  name='password_input'
                />

                <div class='absolute inset-y-0 right-0 flex items-center pr-3'>
                  <eye-toggle @toggle-visibility='handleToggleVisibility' />
                </div>

              </div>

              <div
                id='password_error'
                v-if='passwordError'
                class='text-red-500 text-sm mt-1'>{{ passwordError }}
              </div>

              <button-auth
                @click='signup'
                class='bg-green-500 hover:bg-green-700'
                name='signup_button'>
                <signup-icon />
                <span class='ml-3'>Sign Up</span>
              </button-auth>

              <p class='mt-6 text-base text-gray-600 text-center'>
                Have an account?
                <router-link :to="{ name: 'Login' }"
                             class='border-b border-gray-500 border-dotted'>Log In
                </router-link>
              </p>

            </div>
          </div>
        </div>
      </div>

      <div class='flex-1 bg-green-200 text-center hidden lg:flex rounded-r'>
        <div class='m-12 lg:m-16 w-full bg-contain bg-center bg-no-repeat'
             style="background-image: url('https://svgshare.com/i/zs4.svg');">
        </div>
      </div>

    </div>

    <loading-spin v-if='isLoading' />

  </div>
</template>

<script>
import EyeToggle from '../components/common/EyeToggle.vue'
import ButtonAuth from '../components/common/ButtonAuth.vue'
import SignupIcon from '../components/ui/SignupIcon.vue'
import { handleSignup } from '../services/auth.js'
import LoadingSpin from '../components/ui/LoadingSpin.vue'

export default {
  components: {
    LoadingSpin,
    // ButtonGoogleAuth,
    EyeToggle,
    ButtonAuth,
    SignupIcon,
  },

  data() {
    return {
      isPasswordHidden: true,
      emailError: '',
      passwordError: '',
      email: '',
      password: '',
      name: '',
      isLoading: false,
    }
  },

  methods: {
    async signup() {
      this.emailError = ''
      this.passwordError = ''


      if (!this.validateEmail(this.email)) {
        this.emailError = 'Email is not valid'
      }

      const passwordValidationResult = this.validatePassword(this.password)
      if (passwordValidationResult) {
        this.passwordError = passwordValidationResult
      }

      if (this.passwordError || this.emailError) {
        return
      }

      try {
        this.isLoading = true
        const signupData = await handleSignup(this.email, this.password, this.name)

        if (signupData.status === 201) {
          this.$router.push({ name: 'Login' })
        } else {
          if (signupData.status === 409) {
            this.emailError = 'User with this email already exists'
          }
        }
      } catch (err) {
        console.log('signup err', err)
      } finally {
        this.isLoading = false
      }

    },

    handleToggleVisibility(isHidden) {
      this.isPasswordHidden = isHidden
    },

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    validatePassword(password) {
      if (/\s/.test(password)) {
        return 'Password can\'t contain spaces'
      }

      if (password.length < 8) {
        return 'Password must be at least 8 characters'
      }

      return ''
    },
  },
}

</script>

