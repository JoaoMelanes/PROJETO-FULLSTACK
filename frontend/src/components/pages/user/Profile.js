import formStyles from '../../form/Form.module.css'
import style from './Profile.module.css'
import Input from '../../form/Input'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'

// hooks
import {useState, useEffect} from 'react'



function Profile(){
    const [user, setUser] = useState({})
    const [preview, setPreview] = useState('')
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()

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
        setPreview(e.target.files[0])
        setUser({ ...user, [e.target.name]: e.target.files[0]})

    }

    function handleOnChange(e){
        setUser({ ...user, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e){
        e.preventDefault()
        
        let msgType = 'success'
        const formData = new FormData()

        await Object.keys(user).forEach((key) => {formData.append(key, user[key])})

        const data = await api.patch(`/users/edit/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {

            return response.data

        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return(
        <section>
            <div className={style.profile_header}>
                <h1>Perfil</h1>
                {(user.image || preview) && (
                    <img src={preview ? URL.createObjectURL(preview) : `${process.env.REACT_APP_API}/images/users/${user.image}`} alt={user.name} />)}
            </div>
            <form onSubmit={handleSubmit} className={formStyles.form_container}>
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
                    value={user.email ||''}
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