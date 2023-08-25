import { useEffect, useState } from 'react'
import './App.css'

import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {

  const [password, setPassword] = useState()
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [repeatedPassword, setRepeatedPassword] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [validationMessage, setValidationMessage] = useState()


  async function updatePassword() {
    console.log(password, repeatedPassword)
    if (password !== repeatedPassword) setErrorMessage("Les mots de passe ne sont pas identiques")
    if (password === repeatedPassword) {
      setErrorMessage()
      const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/

      if (regex.test(password)) {
        const { error } = await supabase.auth.updateUser({ password: password })
        if (error) {
          console.log(error)
          setErrorMessage("Une erreur est survenue, veuillez réessayer")
        }
        else {
          setValidationMessage("Votre mot de passe a été mis à jour ! Vous pouvez rouvrir l'application et vous connecter")
        }
      } else {
        setErrorMessage("Votre mot de passe doit contenir au moins 8 charactères, un charactères spécial, et une majuscule")
      }
    }
  }

  async function getUser() {
    const session = await supabase.auth.getSession()
    console.log("🚀 ~ file: UserContext.js:15 ~ updateUser ~ session:", session)
  }

  useEffect(() => {
    getUser()
  })

  return (
    <>
      <h1>Choisissez un nouveau mot de passe: </h1>
      <label>Nouveau mot de passe :</label>
      <input onBlur={e => setPassword(e.target.value)} placeholder='nouveau mot de passe' type={passwordHidden ? 'password' : 'text'} />
      <label>Répétez le nouveau mot de passe</label>
      <input onBlur={e => setRepeatedPassword(e.target.value)} placeholder='répéter le nouveau de passe' type={passwordHidden ? 'password' : 'text'} />
      <p onClick={() => setPasswordHidden(!passwordHidden)} className='seePassword'>Voir le mot de passe {passwordHidden ? <FaEyeSlash /> : <FaEye />}</p>
      <button onClick={updatePassword}>Valider</button>
      <p>{errorMessage}</p>
      <p>{validationMessage}</p>
    </>
  )
}


export default App
