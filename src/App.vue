<template>
  <button v-if="!account" @click="connectWithArConnect">
    connect with arconnect
  </button>
  <button v-if="!account" @click="connectWithMetamask">
    connect with metamask
  </button>
  <div v-if="account">
    connected: {{ account }}
  </div>
  <div style="margin-top: 16px;">
    balance: {{ balance }} Hello
  </div>
  <div style="margin-top: 16px;">
    Transfer 1 AO Test Token Hello to
  </div>
  <div style="margin-top: 16px;">
    Recipient:
    <input
      v-model="recipient"
      style="width: 400px;"
      placeholder="Please input Arweave address or Ethereum Address"
    >
  </div>

  <button style="margin-top: 16px;" @click="transfer">
    transfer
  </button>

  <div style="margin-top: 24px;">
    <div>How to get test Hello Token?</div>
    <ul>
      <li>1. vist <a href="https://www.permaswap.network/#/ao" target="_blank">https://www.permaswap.network/#/ao</a></li>
      <li>follow this two steps</li>
    </ul>
    <img style="width: 700px;" src="./images/demo1.jpg">
    <br>
    <img style="width: 700px;" src="./images/demo2.jpg">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { fromDecimalToUnit, fromUnitToDecimal, isArweaveAddress, isEthereumAddress } from './utils'
import { getAOTokenBalance, transferAoToken } from './ao'
import { utils } from 'ethers'

export default defineComponent({
  setup() {
    const account = ref('')
    const accChainType = ref('arweave')
    const balance = ref('-')
    const helloTokenProcessId = '-v4cUCUcRiJH67jPMUt-Uhn-K4PHxrkoySM2uqAjAF0'
    const helloDecimals = 12

    const updateBalance = async () => {
      if (account.value) {
        const decimalBalance = await getAOTokenBalance(helloTokenProcessId, account.value)
        balance.value = fromDecimalToUnit(decimalBalance, helloDecimals)
      } else {
        balance.value = '0'
      }
    }

    const connectWithArConnect = async () => {
      account.value = await window.arweaveWallet.getActiveAddress()
      accChainType.value = 'arweave'
    }

    const connectWithMetamask = async () => {
      await (window as any).ethereum.enable()
      account.value = utils.getAddress((window as any).ethereum.selectedAddress)
      accChainType.value = 'ethereum'
    }

    const transfer = async () => {
      if (!account.value) {
        alert('Please connect first')
        return
      }
      if (isArweaveAddress(recipient.value) || isEthereumAddress(recipient.value)) {
        const amount = '1'
        const decimalAmount = fromUnitToDecimal(amount, helloDecimals)
        const messageId = await transferAoToken(
          accChainType.value,
          helloTokenProcessId,
          decimalAmount,
          isEthereumAddress(recipient.value) ? utils.getAddress(recipient.value) : recipient.value
        )
        alert(`transfer success https://ao_marton.g8way.io/#/message/${messageId}`)
        updateBalance()
      } else {
        alert('please input correct arweave address or ethereum address')
      }
    }

    watch(account, updateBalance)

    const recipient = ref('')

    return {
      account,
      recipient,
      balance,
      connectWithMetamask,
      transfer,
      connectWithArConnect
    }
  },
})
</script>
