import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, Globe } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { Button } from "../../components/ui/Button";

const ADMIN_EMAIL = "psychompop@gmail.com";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === ADMIN_EMAIL) {
        // Ensure admin document exists
        const adminRef = doc(db, "admins", user.uid);
        const adminDoc = await getDoc(adminRef);
        
        if (!adminDoc.exists()) {
          await setDoc(adminRef, {
            email: user.email,
            role: "super_admin",
            createdAt: new Date().toISOString()
          });
        }
        
        navigate("/admin/dashboard");
      } else {
        setError("Akses ditolak. Email Anda tidak terdaftar sebagai admin.");
        await auth.signOut();
      }
    } catch (err: any) {
      setError("Login gagal. Terjadi kesalahan saat autentikasi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-elegant/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-12 rounded-3xl border border-white/5 shadow-2xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gold-elegant rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Globe className="text-matte-black" size={32} />
            </div>
            <h1 className="text-3xl font-cinzel text-white mb-2">Admin Sanctuary</h1>
            <p className="text-cream/50 text-sm tracking-widest uppercase">Pusat Kurasi Kakawin Nusantara</p>
          </div>

          <div className="space-y-6">
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full py-6 rounded-xl text-lg font-bold flex items-center justify-center gap-3"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
                  Masuk dengan Google
                </>
              )}
            </Button>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center font-medium"
              >
                {error}
              </motion.p>
            )}
          </div>

          <p className="mt-10 text-center text-cream/30 text-xs leading-relaxed uppercase tracking-widest">
            Hanya kurator terverifikasi yang diperbolehkan mengolah arsip digital museum.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
