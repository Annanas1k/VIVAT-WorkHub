import { useNavigate } from 'react-router'; // Opțional, pentru navigare internă React

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/'); 
  };

  return (
    <section style={styles.page404}>
      <div style={styles.container}>
        <div style={styles.row}>
          <div style={styles.col12}>
            <div style={styles.textCenter}>
              
              {/* Fundalul animat cu textul 404 */}
              <div style={styles.fourZeroFourBg}>
                <h1 style={styles.fourZeroFourH1}>404</h1>
              </div>

              {/* Caseta cu text și buton */}
              <div style={styles.contentBox404}>
                <h3 style={styles.h2}>Look like you're lost</h3>
                <p style={styles.p}>the page you are looking for not available!</p>
                
                <a 
                  href="/" 
                  onClick={handleGoHome} 
                  style={styles.link404}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2e8b28')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#39ac31')}
                >
                  Go to Home
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Stiluri Tipizate TypeScript (Business-ul Visual) ---
const styles: { [key: string]: React.CSSProperties } = {
  page404: {
    padding: '40px 0',
    background: '#fff',
    fontFamily: "'Arvo', serif",
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: '1140px',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  col12: {
    flex: '0 0 100%',
    maxWidth: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  fourZeroFourBg: {
    backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
    height: '400px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fourZeroFourH1: {
    fontSize: '80px',
    margin: 0,
    fontWeight: 'bold',
    color: '#333',
  },
  contentBox404: {
    marginTop: '-50px',
  },
  h2: {
    fontSize: '36px',
    margin: '10px 0',
    color: '#222',
  },
  p: {
    fontSize: '16px',
    color: '#666',
    margin: '10px 0',
  },
  link404: {
    color: '#fff',
    padding: '10px 20px',
    backgroundColor: '#39ac31',
    margin: '20px 0',
    display: 'inline-block',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    fontWeight: '500',
  },
};