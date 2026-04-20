
import React, { useState } from 'react';
import { Smartphone, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface LoginViewProps {
  onLogin: (user: string, pass: string) => Promise<boolean>;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const success = await onLogin(user, pass);
      if (!success) {
        setError('Usuário ou senha inválidos no sistema.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Erro capturado na View:', err);
      
      // Tradução de erros comuns do Firebase
      if (err.code === 'auth/unauthorized-domain') {
        setError('ERRO: Domínio não autorizado. Verifique as configurações do Firebase.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('ERRO: Login com E-mail/Senha desativado.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-mail inválido. Use um formato como seu@email.com');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError(`Erro ao entrar: ${err.message}`);
      }
      
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user || !user.includes('@')) {
      setError('Para recuperar a senha, digite seu E-mail no campo "E-mail ou Usuário" primeiro.');
      return;
    }

    setIsResetting(true);
    setError('');
    setSuccessMsg('');

    try {
      await api.recoverPassword(user);
      setSuccessMsg(`E-mail de recuperação enviado para: ${user}. Verifique sua caixa de entrada ou spam.`);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('E-mail não encontrado no sistema.');
      } else {
        setError(`Erro ao tentar recuperar a senha: ${err.message}`);
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-500/20 mb-4">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">PainelCell</h1>
            <p className="text-slate-400 font-medium text-[11px] uppercase tracking-widest">Gestão de Assistência e Acessórios</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input 
                  type="text"
                  required
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  placeholder="E-mail ou Usuário"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input 
                  type={showPass ? 'text' : 'password'}
                  required
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="Sua Senha"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs font-bold text-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs font-bold text-center animate-in slide-in-from-top-2">
                {successMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading || isResetting}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar no Sistema <ArrowRight size={18} />
                </>
              )}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting || isLoading}
                className="text-xs text-slate-400 hover:text-white transition-colors font-medium relative group"
              >
                {isResetting ? 'Mandando o E-mail...' : 'Esqueceu sua senha?'}
                <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all"></div>
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest leading-relaxed">
              Sistema de Gestão Profissional v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
