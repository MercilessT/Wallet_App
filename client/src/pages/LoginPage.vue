<template>
  <div class='mt-[5px] min-h-[38rem] bg-bl text-gray-900 flex justify-center'>
    <div class='max-w-screen-xl m-0 bg-blue-200 shadow lg:rounded-lg flex justify-center flex-1'>
      <div class='lg:w-1/2 p-6 sm:p-12'>
        <div class='flex flex-col items-center mt-14'>
          <h1 class='text-3xl font-extrabold'>
            Log In
          </h1>
          <div class='w-full flex-1 mt-16'>
            <!--            <div class='flex flex-col items-center'>-->
            <!--              <button-google-auth class='bg-indigo-100'>-->
            <!--                Log In with Google-->
            <!--              </button-google-auth>-->
            <!--            </div>-->
            <!--            <div class='my-4 mb-8 text-center border-b'>-->
            <!--              <div-->
            <!--                class='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>-->
            <!--                Or log in with e-mail-->
            <!--              </div>-->
            <!--            </div>-->

            <div class='mx-auto max-w-xs'>

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
                @click='login'
                class='bg-indigo-500 hover:bg-indigo-700'
                name='login_button'>
                <login-icon />
                <span class='ml-3'>Log In</span>
              </button-auth>

              <p class='mt-6 text-base text-gray-600 text-center'>
                Don't have an account?
                <router-link :to="{ name: 'Signup' }"
                             class='border-b border-gray-500 border-dotted'>Sign Up
                </router-link>
              </p>

            </div>
          </div>
        </div>
      </div>

      <div class='flex-1 bg-blue-200 text-center hidden lg:flex lg:rounded-r'>
        <div class='m-12 lg:m-16 w-full bg-contain bg-center bg-no-repeat'
             style="background-image: url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg');">
        </div>
      </div>

    </div>
  </div>

  <loading-spin v-if='isLoading' />


</template>


<script>
import ButtonGoogleAuth from '../components/common/ButtonGoogleAuth.vue'
import EyeToggle from '../components/common/EyeToggle.vue'
import ButtonAuth from '../components/common/ButtonAuth.vue'
import LoginIcon from '../components/ui/LoginIcon.vue'
import LoadingSpin from '../components/ui/LoadingSpin.vue'

export default {
  components: {
    LoadingSpin,
    LoginIcon,
    ButtonGoogleAuth,
    EyeToggle,
    ButtonAuth,
  },

  data() {
    return {
      isPasswordHidden: true,
      emailError: '',
      passwordError: '',
      email: '',
      password: '',
      isLoading: false,
    }
  },

  methods: {
    async login() {
      this.emailError = ''
      this.passwordError = ''
      this.isLoading = true

      try {
        const loginData = await this.$store.dispatch('handleLogin', {
          email: this.email,
          password: this.password,
        })

        if (loginData.status === 200) {
          this.$router.push({ name: 'Personal' })
        } else {
          if (loginData.status === 404 || loginData.status === 400) {
            this.passwordError = 'Password or email is not correct'
            this.emailError = 'Password or email is not correct'
          }
        }
      } catch (err) {
        console.log('login err', err)
      } finally {
        this.isLoading = false
      }
    },

    handleToggleVisibility(isHidden) {
      this.isPasswordHidden = isHidden
    },
  },
}

</script>
