<template>
  <div class='shadow'>
    <div class='mx-auto px-12 shadow'>
      <div class='flex items-center justify-between py-4 h-16'>

        <router-link :to="{ name: 'Home' }">
          <logo-icon />
        </router-link>

        <div class="hidden lg:flex lg:items-center gap-8" :class="{ 'mr-[7.5rem]': $store.getters.getUser, 'mr-[-3.3rem]': !$store.getters.getUser }">

          <router-link :to="{ name: 'Home' }"
                       class='text-dbl text-base font-semibold hover:text-purple-600'>Home
          </router-link>

          <router-link :to="{name: 'Personal'}"
                       class='text-dbl text-base font-semibold hover:text-purple-600'>Wallet
          </router-link>

          <router-link :to='{}'
                       class='text-dbl text-base font-semibold hover:text-purple-600'>About
          </router-link>

        </div>

        <div v-if='!$store.getters.getUser'
             class='hidden lg:flex lg:items-center'>

          <router-link :to="{ name: 'Login' }"
                       class='bg-gr text-dbl text-base font-semibold hover:bg-gr-2 mr-2 border px-4 py-1 rounded-lg'>
            Log in
          </router-link>

          <router-link :to="{ name: 'Signup' }"
                       class='bg-dbl text-white text-base font-semibold px-4 py-1 rounded-lg hover:text-bl hover:bg-black'>
            Sign up
          </router-link>

        </div>

        <div v-else>
          <user-menu :is-mobile-menu-open='isMobileMenuOpen' @closeMobileMenu='closeMobileMenu' />
        </div>

        <button
          class='lg:hidden cursor-pointer group absolute'
          @click='toggleMobileMenu'
          :style="{ right: $store.getters.getUser ? '4.5rem' : '2rem' }">
          <svg xmlns='http://www.w3.org/2000/svg' class='w-6 h-6 fill-current text-black group-hover:text-purple-600'
               viewBox='0 0 24 24'>
            <path d='M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' />
          </svg>
        </button>


      </div>

      <Transition name='slide-fade'>
        <div v-if='isMobileMenuOpen' class='absolute w-full left-0 lg:hidden bg-bl border-t-2 py-2'
             style='z-index: 1000;'>
          <div class='ml-12 mr-12 flex flex-col'>

            <router-link :to="{ name: 'Home' }"
                         class='text-dbl text-base font-semibold hover:text-purple-600 mb-1'>Home
            </router-link>

            <router-link :to="{ name: 'Personal' }"
                         class='text-dbl text-base font-semibold hover:text-purple-600 mb-1'>Wallet
            </router-link>

            <router-link :to='{}'
                         class='text-dbl text-base font-semibold hover:text-purple-600 mb-1'>About
            </router-link>

            <div class='flex justify-between items-center border-t-2 pt-2'>
              <template v-if='!$store.getters.getUser'>
                <router-link :to="{ name: 'Login' }"
                             class='text-dbl bg-gr text-base font-semibold hover:bg-gr-2 mr-4 border px-4 py-1 rounded-lg'>
                  Log in
                </router-link>

                <router-link :to="{ name: 'Signup' }"
                             class='text-white bg-dbl text-base font-semibold border px-4 py-1 rounded-lg hover:text-bl hover:bg-black'>
                  Sign up
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>


<script>
import LogoIcon from '../ui/LogoIcon.vue'
import UserMenu from '../common/UserMenu.vue'

export default {
  emits: ['closeMobileMenu'],
  data() {
    return {
      isMobileMenuOpen: false,
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
  },
  mounted() {
    this.$router.beforeEach((to, from, next) => {
      this.closeMobileMenu()
      next()
    })
  },
  components: {
    LogoIcon,
    UserMenu,
  },
}

</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
  position: fixed;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
  position: fixed;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
