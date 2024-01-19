<template>
  <div class='flex justify-center text-dbl lg:w-screen'>
    <div class='w-1/2 text-center lg:text-left lg:ml-12'>
      <div class='mt-36 text-5xl font-bold'>Wise Wallet</div>
      <div class='mt-5 text-xl'>
        Organize your financial life with Wise Wallet. Easily record expenses, income, and savings goals. Simplify your
        money management and stay on top of your financial goals.
      </div>

      <router-link :to="{ name: 'Signup' }">
        <button class='bg-red-500 hover:bg-red-700 text-white px-4 py-2 mt-6 rounded-full'>
          <div class='flex items-center'>
            <div>SIGN UP</div>

            <div class='ml-2'>
              <svg xmlns='http://www.w3.org/2000/svg' height='16' width='12' viewBox='0 0 384 512'>
                <path fill='#ffffff'
                      d='M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z' />
              </svg>
            </div>
          </div>
        </button>
      </router-link>

    </div>
    <div class='hidden lg:flex w-[80rem] h-[38rem] select-none lg:ml-12'>
      <img src='../assets/HomePageImage.svg' alt=''>
    </div>
  </div>
</template>
