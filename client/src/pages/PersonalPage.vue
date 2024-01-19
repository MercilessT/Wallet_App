<template>
  <div class='flex justify-center items-center'>
    <div class='mt-8 bg-black w-9/12 h-48 rounded-lg shadow flex flex-col items-center justify-center'>
      <div class='flex items-center justify-between w-full'>
        <div class='ml-10 text-2xl font-black text-white'>
          <span class='text-2xl font-black text-white'>{{ formatNumberWithSpaces(balance) }}</span>
          <span class='ml-1 text-2xl font-black text-gray-400'>UAH</span>
        </div>
        <div class='flex items-center mr-10 gap-6'>

          <button
            id='toggle_show_chart_button'
            @click='toggleShowChart'
                  class='w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-700 flex items-center justify-center'>
            <chart-icon class='text-white' />
          </button>

          <button
            id='plus_button'
            @click='isShowPopup = true'
            class='text-2xl text-white bg-green-600 hover:bg-green-700 w-10 h-10 flex items-center justify-center rounded-full'>
            <i class='fas fa-plus'></i>
          </button>
        </div>
      </div>

    </div>
  </div>

  <div v-if='chartVisible' class='flex justify-center mt-6'>
    <div class='chart-container' style='position: relative; height:500px; width:60%'>
      <canvas id='myChart'></canvas>
    </div>
  </div>


  <div class='flex justify-center text-black' :class="{ 'mt-8': !chartVisible }">
    <div class='w-9/12 rounded-lg shadow flex flex-col bg-gradient-to-r from-green-300 to-blue-50'>
      <div class='flex justify-between items-center m-3'>
        <div class='font-semibold text-xl text-dbl'>
          Records
        </div>
        <div class='flex items-center'>
          <button
            id='show_transactions_button'
            @click='toggleShowTransactions'>
            <svg :class="{ 'rotate-180': !isShowTransactions, 'rotate-0': isShowTransactions }"
                 xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24'
                 stroke='currentColor'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' />
            </svg>
          </button>
        </div>
      </div>
      <hr v-if='isShowTransactions'>

      <div v-if='isShowTransactions'>
        <div v-for='(date, index) in uniqueDates.slice().reverse()' :key='index' class='mt-5'>

          <div class='flex justify-between mb-2 ml-3 mr-3'>
            <div class='text-lg text-dbl'>
              <strong>{{ date }}</strong>
            </div>
            <div
              :class="{'text-green-500': dateTransactionsSum(date) > 0,
              'text-red-500': dateTransactionsSum(date) < 0}"
              class='text-lg text-dbl'>
              <strong>{{ formatNumberWithSpaces(dateTransactionsSum(date)) }}</strong>
            </div>
          </div>

          <div v-for='(transaction, index) in dateTransactions(date).slice().reverse()' :key='index'>
            <div class='flex items-center justify-between mb-2 mr-3 ml-3'>
              <div class='flex items-center'>
                <button
                  id='show_record_button'
                  @click='transactionInfo(transaction)'
                        class='w-10 h-10 flex items-center justify-center bg-white rounded-full border'>
                  <i :class="{'fas fa-arrow-right text-green-500': transaction.amount > 0,
                   'fas fa-arrow-left text-red-500': transaction.amount < 0}">
                  </i>
                </button>

                <div class='flex flex-col ml-2'>
                  <div>
                    {{ transaction.target ? transaction.target.length > 37 ? transaction.target.slice(0, 34) + '...' : transaction.target : ''
                    }}
                  </div>

                  <div>
                    {{ formatTime(transaction.createdAt) }}
                  </div>

                </div>
              </div>

              <div :class="{'text-green-500': transaction.amount > 0, 'text-red-500': transaction.amount < 0}">
                {{ formatNumberWithSpaces(transaction.amount) }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>


  <div v-if='isShowPopup' class='fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50'>
    <div class='bg-green-300 p-8 rounded-lg w-1/2 relative'>
      <button
        id='close_add_popup_button'
        @click='closeAddPopup'
              class='absolute top-3.5 right-5 text-gray-600 hover:text-gray-800'>
        <i class='fas fa-times text-xl'></i>
      </button>

      <div class='absolute top-2 left-1/2 transform -translate-x-1/2 text-gray-600 font-semibold text-lg'>
        Adding record
      </div>

      <div class='block text-gray-600 mb-2 mt-8'>
        <div class='block text-gray-600 mb-1'><strong>Amount</strong></div>
        <div>
          <input
            v-model.lazy='inputMoney'
            type='number'
            class='pl-2 pr-2 pt-1 pb-1 w-full rounded-lg'
            name='inputMoney' />
        </div>
      </div>
      <div
        id='input_money_error'
        v-if='inputMoneyError'
        class='text-red-500 text-sm'>{{ inputMoneyError }}</div>

      <div class='block text-gray-600 mb-1 mt-4'><strong>Target</strong></div>
      <textarea
        v-model.lazy='targetInput'
        class='p-2 w-full max-h-96 overflow-y-auto rounded-lg' style='height: 4rem;'
        placeholder='Not required'
        name='inputTarget'
      />


      <div class='flex justify-center'>
        <button
          id='add_record_button'
          @click='addTransaction'
          class='bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 mt-8 font-semibold'>
          Add record
        </button>
      </div>
    </div>
  </div>


  <div v-if='isShowTransactionInfo' class='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
    <div class='bg-green-300 p-8 rounded-lg w-1/2 relative'>
      <button @click='closeTransactionInfoPopup'
              class='absolute top-3.5 right-5 text-gray-600 hover:text-gray-800'>
        <i class='fas fa-times text-xl'></i>
      </button>

      <div class='absolute top-2 left-1/2 transform -translate-x-1/2 text-gray-600 font-semibold text-lg'>
        Record info
      </div>

      <div class='block text-gray-600 mb-2 mt-8'>
        <strong>Amount:</strong> {{ formatNumberWithSpaces(selectedTransaction.amount) }}
      </div>

      <div class='block text-gray-600 mb-2 mt-4' style='text-align: justify; overflow-wrap: break-word;'>
        <strong>Target:</strong> {{ selectedTransaction.target ? selectedTransaction.target : 'target not specified' }}
      </div>

      <div class='block text-gray-600 mb-8 mt-4'>

        <strong>Date:</strong> {{ formatDateAndTime(selectedTransaction.createdAt) }}
      </div>

      <button
        id='delete_record_button'
        @click='deleteTransaction'
              class='absolute bottom-5 right-5'>
        <i class='text-red-500 fa-solid fa-trash-can text-2xl'></i>
      </button>

    </div>
  </div>

  <loading-spin v-if='isLoading' />


</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'
import Chart from 'chart.js/auto'
import ChartIcon from '../components/ui/ChartIcon.vue'
import LoadingSpin from '../components/ui/LoadingSpin.vue'

export default {
  components: { LoadingSpin, ChartIcon },
  async created() {
    const user = this.$store.getters.getUser
    if (user) {
      try {
        const res = await this.$store.dispatch('updateUserToken', { id: user._id })
      } catch (err) {
        console.log(err)
      }
    }
  },
  data() {
    return {
      inputMoney: null,
      inputMoneyError: '',
      targetInput: '',
      isShowPopup: false,
      isShowTransactions: false,
      isShowTransactionInfo: false,
      selectedTransaction: undefined,
      chartVisible: false,
      isDropdownOpen: false,
      isLoading: false,
      isShowChart: false,
    }
  },
  methods: {
    closeTransactionInfoPopup() {
      this.isShowTransactionInfo = false
      this.selectedTransaction = undefined
    },
    closeAddPopup() {
      this.isShowPopup = false
      this.inputMoney = null
      this.targetInput = ''
      this.inputMoneyError = ''
    },
    toggleShowTransactions() {
      this.isShowTransactions = !this.isShowTransactions
    },
    formatNumberWithSpaces(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },
    toggleShowChart() {
      this.chartVisible = !this.chartVisible

      if (this.chartVisible) {
        this.$nextTick().then(this.showChart)
      }
    },
    async addTransaction() {
      if (!isNaN(parseInt(this.inputMoney)) && this.inputMoney) {
        this.isLoading = true
        await this.$store.dispatch('addTransaction', {
          amount: this.inputMoney,
          target: this.targetInput,
        })
        this.isLoading = false
        this.inputMoney = null
        this.targetInput = ''
        this.isShowPopup = false
        this.inputMoneyError = ''
      } else {
        this.inputMoneyError = 'Please enter the correct value'
      }
    },
    formatDate(dateTimeString) {
      const date = new Date(dateTimeString)
      const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
      return date.toLocaleDateString('en-US', dateOptions)
    },
    formatTime(dateTimeString) {
      const date = new Date(dateTimeString)
      const timeOptions = { hour: 'numeric', minute: 'numeric' }
      return date.toLocaleTimeString('en-US', timeOptions)
    },
    formatDateAndTime(dateTimeString) {
      const date = new Date(dateTimeString)
      const dateAndTimeOptions = {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric',
      }
      return date.toLocaleDateString('en-US', dateAndTimeOptions)
    },
    dateTransactions(date) {
      return this.transactions.filter(transaction => this.formatDate(transaction.createdAt) === date)
    },
    dateTransactionsSum(date) {
      return this.dateTransactions(date).reduce((acc, transaction) => acc + transaction.amount, 0)
    },
    transactionInfo(transaction) {
      this.isShowTransactionInfo = true
      this.selectedTransaction = transaction
    },
    chartData() {
      const groupedTransactions = this.transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.createdAt)
        const month = date.toLocaleString('en-US', { month: 'long' })

        acc[month] = (acc[month] || []).concat(transaction)

        return acc
      }, {})

      return Object.fromEntries(
        Object.entries(groupedTransactions).map(([month, transactions]) => [
          month, transactions.reduce((total, transaction) => total + transaction.amount, 0),
        ]),
      )
    },
    getRandomColor(alphaColor, alphaBorder) {
      const red = Math.floor(Math.random() * 256)
      const green = Math.floor(Math.random() * 256)
      const blue = Math.floor(Math.random() * 256)

      return {
        color: `rgba(${red},${green},${blue},${alphaColor})`,
        border: `rgba(${red},${green},${blue},${alphaBorder})`,
      }
    },
    showChart() {
      const ctx = document.getElementById('myChart')
      const existingChart = Chart.getChart(ctx)

      if (existingChart) {
        existingChart.destroy()
      }

      const monthlySums = this.chartData()
      const months = Object.keys(monthlySums)
      const sums = Object.values(monthlySums)

      const colorsAndBorders = Array.from({ length: 12 }, () => this.getRandomColor(0.2, 1))
      const backgroundColors = colorsAndBorders.map(c => c.color)
      const borderColors = colorsAndBorders.map(c => c.border)


      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{
            // label: 'Monthly Revenue/Expense',
            data: sums,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          }],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Monthly Revenue/Expense',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },

        },
      })
    },
    async deleteTransaction() {
      this.isLoading = true
      await this.$store.dispatch('deleteTransaction', {
        transaction_id: this.selectedTransaction._id,
      })
      this.isLoading = false
      this.isShowTransactionInfo = false
    },

  },
  computed: {
    transactions() {
      const user = this.$store.getters.getUser
      return user ? user.transactions : []
    },
    balance() {
      return this.transactions.reduce((total, transaction) => total + transaction.amount, 0)
    },
    uniqueDates() {
      return Array.from(new Set(this.transactions.map(transaction => this.formatDate(transaction.createdAt))))
    },
  },
  watch: {
    balance() {
      if (this.chartVisible) {
        this.showChart()
      }
    },
  },
}

</script>


<style scoped>

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.rotate-0 {
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}
</style>
