// api
import api from "../utils/api";

import {useStates, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

export default function useAuth(){

    async function register(user) {
        try{
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })

            console.log(data)
        }catch(e){
            console.log(e)
        }
    }

    return {register}
}