import axios from "axios";

const state = {
  forecasts:[],
  dusseldorf:{},
  weather:{}
}

  const actions = {
  async get({ commit}) {
    await axios.get(process.env.API)
      .then((res) => {
        if (res.status === 200) {
          commit('get', res.data.data)
        }
      })
  },

    async getPeak({ commit }) {
      await axios.get(process.env.API+'/weather/peak')
        .then(({ data }) => {
          return data

      }).catch(error => {
          console.log(error.response.data.errors)
          commit('set', error.response.data.errors)
        })
    },


  }

const mutations = {
  setForecast(state, forecast) {
    let forecastArray = state.forecasts
    forecastArray.push(forecast)
  },
  setDusseldorf(state, forecast) {
    state.dusseldorf = forecast
  },
}


export function setWeather(state, data) {
  state.weather = data
}

const getters = {
  dusseldorf (state) {
    return state.dusseldorf
  }
}

export default {
  namespaced : true,
  state,
  mutations,
  actions,
  getters

}
