import formStyles from '../../form/Form.module.css'
import style from './Profile.module.css'
import Input from '../../form/Input'
import api from '../../../utils/api'

// hooks
import {useState, useEffect} from 'react'



function Profile(){
    const [user, setUser] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {

        api.get('users/checkuser',{
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setUser(response.data)
        })

    }, [token])

    function onFileChage(e){

    }

    function handleOnChange(e){

    }

    return(
        <section>
            <div className={style.profile_header}>
                <h1>Perfil</h1>
                <p>Preview Image</p>
            </div>
            <form className={formStyles.form_container}>
                <Input 
                    text="Imagem"
                    type="file"
                    name="image"
                    handleOnChange={onFileChage}
                />
                <Input 
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu email"
                    handleOnChange={handleOnChange}
                    value={user.name ||''}
                />

                <Input 
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleOnChange}
                    value={user.name || ''}
                />

                <Input 
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleOnChange}
                    value={user.phone || ''}
                />

                <Input 
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleOnChange}
                />

                <Input 
                    text="Confirme a senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleOnChange}
                />

                <input type='submit' value="Editar" />
            </form>
        </section>
    )
}

export default Profile