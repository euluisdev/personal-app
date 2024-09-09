

import Link from "next/link";
import "./page.module.css";

 const Home = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo à Aplicação</h1>
      <p>Por favor, faça login ou registre-se para continuar.</p>
      <input />
      <div style={{ marginTop: '20px' }}>
        <Link href="/register">
          <p style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none' }}>Registrar-se</p>
        </Link>
      </div>
    </div>
  );

}
export default Home;