
import { register } from './service'

export default {
    namespace: 'register',

    state: {
    },

    effects: {
        *submit({ payload }, { call }){
            const response = yield call(register,payload)
            return response
        },
    }
}