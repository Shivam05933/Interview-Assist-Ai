import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            await handleLogin({email,password})
            navigate('/home')
        } catch (err) {
            setError(err.message || "Login failed. Please try again.")
        }
    }

    if(loading){
        return (
            <main className="grid min-h-screen place-items-center text-white">
                <h1>Loading.......</h1>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0b0b0d] text-white">
            <div className="max-w-[400px] w-full mx-auto p-[32px] border border-[1px] border-[#2a2a2a] rounded-[16px] bg-[#121217]">
                
                <h1 className="text-[24px] font-[700] mb-[24px]">Login</h1>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    
                    <div className="mb-[16px] flex flex-col gap-[8px]">
                        <label htmlFor="email" className="text-[14px]">Email</label>
                        <input
                            className="border border-[1px] border-[#3a3a3a] rounded-[12px] px-[12px] py-[10px] bg-[#0f0f14] text-white outline-none"
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>

                    <div className="mb-[16px] flex flex-col gap-[8px]">
                        <label htmlFor="password" className="text-[14px]">Password</label>
                        <input
                            className="border border-[1px] border-[#3a3a3a] rounded-[12px] px-[12px] py-[10px] bg-[#0f0f14] text-white outline-none"
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    <button className="mt-[16px] px-[20px] py-[12px] rounded-[999px] bg-[#d20d3b] text-white font-[600] transition hover:-translate-y-[1px]">
                        Login
                    </button>

                    {error ? <p className='mt-[12px] text-[#ff4d4f] text-[14px]'>{error}</p> : null}

                </form>

                <p className="mt-[20px] text-[14px] text-[#b0b0b0]">
                    Don't have an account?{" "}
                    <Link to={"/signup"} className="text-[#d20d3b]">
                        Register
                    </Link>
                </p>

            </div>
        </main>
    )
}

export default Login