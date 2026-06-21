import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/principal');
    } catch (error) {
      setErro('Usuário não cadastrado ou senha incorreta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>
          {erro && <p className="erro">{erro}</p>}
          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Acessar Página Principal'}
          </button>
        </form>
        <p className="link-pagina">
          Não tem conta? <Link to="/">Cadastrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
