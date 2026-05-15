import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";
import { uploadToCloudinary } from "../../services/uploadService";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [image_url, setImage_url] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    navigate("/admin/dashboard");
  };

  // TEST UPLOAD CLOUDINARY
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const uploaded = await uploadToCloudinary(file);

    console.log(uploaded);

    setImage_url(uploaded.url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-elegant/5 blur-[120px] rounded-full" />
      </div>

      {/* Card */}
      <div className="glass p-12 rounded-3xl border border-white/5 shadow-2xl relative z-10 max-w-md w-full">
        {/* Logo */}
        <div className="w-16 h-16 bg-gold-elegant rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          <Globe className="text-matte-black" size={32} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-cinzel text-white text-center mb-2">
          Admin Portal
        </h1>

        <p className="text-cream/50 text-sm tracking-widest uppercase text-center mb-10">
          Kakawin Library Control Center
        </p>

        {/* Form */}
        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email Admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-gold-elegant transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-gold-elegant transition-all"
          />

          {errorMsg && (
            <div className="text-red-400 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-6 rounded-xl text-lg font-bold flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Memproses...
              </>
            ) : (
              "Masuk Dashboard"
            )}
          </Button>

          {/* TEST UPLOAD */}
          <div className="pt-6 border-t border-white/10">
            <input
              type="file"
              onChange={handleUpload}
              className="w-full text-sm text-white"
            />

            {image_url && (
              <img
                src={image_url}
                alt="Uploaded"
                className="mt-4 rounded-xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
