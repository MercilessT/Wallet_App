<template>
  <div class='absolute top-[1.2rem] right-8'>
    <!--    <button @click='toggleMenu'-->
    <!--            class='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>-->
    <!--      <span class='absolute -inset-1.5' />-->
    <!--      <img class='h-8 w-8 rounded-full'-->
    <!--           src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'-->
    <!--           alt='' />-->
    <!--    </button>-->

    <button
      id='userMenuMainButton'
      @click='toggleMenu'
            class='relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
      <svg class='h-6 w-6 rounded-full' xmlns='http://www.w3.org/2000/svg' height='16' width='14' viewBox='0 0 448 512'
           fill='#252944'>
        <path
          d='M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z' />
      </svg>
    </button>

    <transition name='fade'>
      <div v-if='isMenuOpen'
           class='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
        <div class='block px-4 py-2 text-sm text-dbl'>Hi, {{ name }}</div>

        <router-link :to='{}'>
          <button class='w-full text-left px-4 py-2 text-sm text-dbl hover:text-purple-600 hover:bg-gray-100'>
            <i class='fa-solid fa-gear mr-1'></i>
            Settings
          </button>
        </router-link>

        <router-link :to="{name: 'Home' }">
          <button
            id='userMenuLogoutButton'
            @click='handleLogout'
                  class='w-full text-left px-4 py-2 text-sm text-dbl hover:text-purple-600 hover:bg-gray-100'>
            <i class='fas fa-sign-out mr-1'></i>
            Log out
          </button>
        </router-link>

      </div>
    </transition>

  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'

export default {
  props: {
    isMobileMenuOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      isMenuOpen: false,
    }
  },
  methods: {
    toggleMenu() {
      if (this.isMobileMenuOpen && !this.isMenuOpen) {
        this.$emit('closeMobileMenu')
      }
      this.isMenuOpen = !this.isMenuOpen
    },
    async handleLogout() {
      await this.$store.dispatch('handleLogout')
    },
    closeMenuOnRouteChange() {
      this.isMenuOpen = false
    },
    handleClickOutside(event) {
      const button = this.$el.querySelector('.absolute button')
      const menu = this.$el.querySelector('.absolute .w-48')

      if (button && menu && !button.contains(event.target) && !menu.contains(event.target)) {
        this.isMenuOpen = false
      }
    },
  },
  mounted() {
    window.addEventListener('click', this.handleClickOutside)

    this.$router.beforeEach((to, from, next) => {
      this.closeMenuOnRouteChange()
      next()
    })
  },
  computed: {
    name() {
      return this.$store.getters.getUser.name
    }
  }
}
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.1s ease-out;
}

.fade-enter, .fade-leave-to {
  transform: translateY(0px);
  opacity: 0;
}

.fade-enter-from, .fade-leave-active {
  transition: all 0.1s ease-out;
  opacity: 0;
  transform: translateY(-20px);
}
</style>