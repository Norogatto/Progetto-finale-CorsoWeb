import { useState } from 'react';

export default function SimpleTest() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testBasicConnection = async () => {
        setLoading(true);
        setResult('Testando...');
        
        try {
            console.log('🔍 Tentativo di connessione a localhost:8080...');
            
            const response = await fetch('http://localhost:8080/api/test');
            
            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📦 Data ricevuti:', data);
                setResult(`✅ SUCCESS: ${JSON.stringify(data, null, 2)}`);
            } else {
                setResult(`❌ HTTP ERROR: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('💥 Fetch error:', error);
            setResult(`❌ FETCH ERROR: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testLogin = async () => {
        setLoading(true);
        setResult('Testando login...');
        
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@test.com',
                    password: 'test'
                })
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (response.ok) {
                setResult(`✅ LOGIN SUCCESS: ${JSON.stringify(data, null, 2)}`);
            } else {
                setResult(`❌ LOGIN FAILED: ${JSON.stringify(data, null, 2)}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            setResult(`❌ LOGIN ERROR: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>🔧 DEBUG SERVER CONNECTION</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testBasicConnection} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        marginRight: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '⏳ Testing...' : '🔍 Test Connection'}
                </button>
                
                <button 
                    onClick={testLogin} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '⏳ Testing...' : '🔑 Test Login'}
                </button>
            </div>
            
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                minHeight: '100px',
                whiteSpace: 'pre-wrap'
            }}>
                <strong>Result:</strong><br/>
                {result || 'Premi un bottone per testare...'}
            </div>
            
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                <strong>Istruzioni:</strong><br/>
                1. Assicurati che il server sia avviato con: <code>node test-server.js</code><br/>
                2. Controlla che non ci siano errori nella console del browser (F12)<br/>
                3. Il server dovrebbe essere su http://localhost:8080
            </div>
        </div>
    );
}