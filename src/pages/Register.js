import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    senha: '',
    nome: '',
    sobrenome: '',
    dataNascimento: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.senha
      );

      const uid = credencial.user.uid;

      await setDoc(doc(db, 'usuarios', uid), {
        uid,
        nome: form.nome,
        sobrenome: form.sobrenome,
        dataNascimento: form.dataNascimento,
        email: form.email,
      });

      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErro('Este e-mail já está cadastrado.');
      } else if (error.code === 'auth/weak-password') {
        setErro('A senha deve ter pelo menos 6 caracteres.');
      } else if (error.code === 'auth/invalid-email') {
        setErro('E-mail inválido.');
      } else {
        setErro('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="campo">
            <label>Sobrenome</label>
            <input
              type="text"
              name="sobrenome"
              value={form.sobrenome}
              onChange={handleChange}
              placeholder="Seu sobrenome"
              required
            />
          </div>
          <div className="campo">
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={form.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="campo">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          {erro && <p className="erro">{erro}</p>}
          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="link-pagina">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
