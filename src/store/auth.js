import localStorage from "@/common/lib/local-storage"

const defaultState = {
  role: null,
  configApp: null,
  loadingData: null
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },

  mutations: {
    SET_ROLE(state, role) {
      state.role = role
    },

    SET_CONFIG(state, data) {
      state.configApp = data
    },

    SET_LOADING(state, data) {
      state.loadingData = data
    },

    CLEAR(state) {
      state.role = defaultState.role
    }
  },

  actions: {
    async initApp({ commit }) {
      const roleApp = process.env.NODE_ENV
      console.log("roleApp", roleApp)

      let configApp
      if (roleApp == "demo") {
        const tokenName = process.env.VUE_APP_DEBIO_USE_TOKEN_NAME
        const escrowETHAddress = process.env.VUE_APP_DEBIO_ESCROW_ETH_ADDRESS
        const substrateWs = process.env.VUE_APP_DEBIO_SUBSTRATE_WS
        const urlFaucet = process.env.VUE_APP_URL_FAUCET
        const web3Rpc = process.env.VUE_APP_WEB3_RPC
        const labDashboardUrl = process.env.VUE_APP_DEBIO_FRONTEND_URL
        
        configApp = {
          tokenName,
          escrowETHAddress,
          substrateWs,
          urlFaucet,
          web3Rpc,
          labDashboardUrl
        }
      } else {
        const tokenName = process.env.VUE_APP_DEV_DEBIO_USE_TOKEN_NAME
        const escrowETHAddress = process.env.VUE_APP_DEV_DEBIO_ESCROW_ETH_ADDRESS
        const substrateWs = process.env.VUE_APP_DEV_DEBIO_SUBSTRATE_WS
        const urlFaucet = process.env.VUE_APP_DEV_URL_FAUCET
        const web3Rpc = process.env.VUE_APP_DEV_WEB3_RPC
        const labDashboardUrl = process.env.VUE_APP_DEV_DEBIO_FRONTEND_URL
        configApp = {
          tokenName,
          escrowETHAddress,
          substrateWs,
          urlFaucet,
          web3Rpc,
          labDashboardUrl
        } 
      }
      commit("SET_CONFIG", configApp)
    },

    async getRole({ commit, rootGetters }) {
      try {
        let keystore = localStorage.getKeystore()
        keystore = JSON.parse(keystore)
        const accountContract = rootGetters["ethereum/contracts/getAccountContract"]
        let role = await accountContract.methods.myRole().call({ from: keystore.address })
        console.log("In Get Role: ", role)
        if (role == "") {
          role = "customer"
        }
        commit("SET_ROLE", role)

      } catch (err) {
        commit("SET_ROLE", null)
        throw new Error("Error on getting role from account Contract ", err.message)
      }
    },

    clearAuth({ commit }) {
      localStorage.removeAddress()
      commit("CLEAR")
    }
  },

  getters: {
    getRole(state) {
      return state.role
    },

    getConfig(state) {
      return state.configApp
    },

    getLoading(state) {
      return state.loadingData
    }

  }
}
