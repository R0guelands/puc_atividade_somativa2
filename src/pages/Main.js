import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Main() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cancelarObservador = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsuario(docSnap.data());
      }

      setCarregando(false);
    });

    return () => cancelarObservador();
  }, [navigate]);

  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
  }

  function formatarData(data) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  if (carregando) {
    return (
      <div className="container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Página Principal</h1>
        {usuario && (
          <div className="dados-usuario">
            <div className="dado">
              <span className="dado-label">Nome</span>
              <span className="dado-valor">{usuario.nome}</span>
            </div>
            <div className="dado">
              <span className="dado-label">Sobrenome</span>
              <span className="dado-valor">{usuario.sobrenome}</span>
            </div>
            <div className="dado">
              <span className="dado-label">Data de Nascimento</span>
              <span className="dado-valor">{formatarData(usuario.dataNascimento)}</span>
            </div>
            <div className="dado">
              <span className="dado-label">E-mail</span>
              <span className="dado-valor">{usuario.email}</span>
            </div>
          </div>
        )}
        <button className="btn-sair" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default Main;
