import { redirect } from 'next/navigation'

// Sign up now lives as a tab on the unified /login auth card — redirect old links here.
const Register = () => {
    redirect('/login')
}

export default Register
