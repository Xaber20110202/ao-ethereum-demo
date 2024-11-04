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

  <button @click="test">
    test create wallet to get hello
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Arweave from 'arweave'
import { connect } from '@permaweb/aoconnect'
import { fromDecimalToUnit, fromUnitToDecimal, isArweaveAddress, isEthereumAddress } from './utils'
import { getAOTokenBalance, transferAoToken } from './ao'
import { utils } from 'ethers'

import * as WarpArBundles from 'warp-arbundles'
var pkg = (WarpArBundles as any).default ? (WarpArBundles as any).default : WarpArBundles
var { createData, ArweaveSigner } = pkg
function createDataItemSigner(wallet: any) {
  const signer = async ({ data, tags, target, anchor }: any) => {
    const signer2 = new ArweaveSigner(wallet)
    const dataItem = createData(data, signer2, { tags, target, anchor })
    return dataItem.sign(signer2).then(async () => ({
      id: await dataItem.id,
      raw: await dataItem.getRaw()
    }))
  }
  return signer
}

const arweave = Arweave.init({})

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

    const defaultAOConfig = {
      CU_URL: 'https://cu.ao-testnet.xyz',
      MU_URL: 'https://mu.ao-testnet.xyz',
      GATEWAY_URL: 'https://g8way.io:443'
    }

    const ao = connect(defaultAOConfig)

    const getProcessResult = async (message: string, process: string) => {
      const { Messages, Error, Output, Spawns } = await ao.result({
        message: message,
        process: process
      })
      return { message: Messages, output: Output, spawns: Spawns, err: Error }
    }

    const test = async () => {
      const jwk = await arweave.wallets.generate()
      console.log('jwk', jwk)

      const signer = createDataItemSigner(jwk)
      const helloProcess = '-v4cUCUcRiJH67jPMUt-Uhn-K4PHxrkoySM2uqAjAF0'

      const claimHelloMessageId = await ao.message({
        process: helloProcess,
        signer,
        tags: [
          { name: 'Action', value: 'Claim' },
        ]
      })
      console.log('claimHelloMessageId', claimHelloMessageId)

      const claimHelloResult = await getProcessResult(claimHelloMessageId, helloProcess)
      console.log('claimHelloResult', claimHelloResult)

    }

    watch(account, updateBalance)

    const recipient = ref('')

    return {
      account,
      test,
      recipient,
      balance,
      connectWithMetamask,
      transfer,
      connectWithArConnect
    }
  },
})
</script>
