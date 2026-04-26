/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Monitor, 
  Cpu, 
  Zap, 
  Layout, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Workflow, 
  MousePointer2,
  Mail,
  Trash2,
  Plus,
  X,
  Lock
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  technologies: string[];
  mainLink: string;
  secondLink?: string;
  createdAt?: string;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden mb-6 border border-gray-100 group-hover:shadow-xl transition-all duration-500">
        <img 
          src={project.image} 
          alt={project.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {project.technologies.map((tech) => (
          <span key={tech} className="text-[10px] uppercase tracking-wider font-bold bg-gray-50 px-2 py-1 rounded text-gray-400 border border-gray-100">{tech}</span>
        ))}
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors">{project.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>
      
      <div className="flex gap-4">
        <a href={project.mainLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold border-b border-black hover:border-brand hover:text-brand transition-all pb-0.5">İncele</a>
        {project.secondLink && (
          <a href={project.secondLink} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-black transition-colors flex items-center">GitHub / Diğer</a>
        )}
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm' : 'bg-white py-6 border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.ibb.co/C5Hwr6JV/a9800aed-6c9d-4361-84a9-45c1ac6fe15f.png" 
            alt="Vireon Systems Logo" 
            className="w-8 h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">
            VIREON <span className="font-light text-gray-500">SYSTEMS</span>
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#home" className="text-black transition-colors">Ana Sayfa</a>
          <a href="#about" className="hover:text-black transition-colors">Hakkımızda</a>
          <a href="#work" className="hover:text-black transition-colors">Çalışma Alanımız</a>
          <a href="#projects" className="hover:text-black transition-colors">Projeler</a>
          <a href="#contact" className="hover:text-black transition-colors">İletişim</a>
        </div>

        <a 
          href="https://wa.me/905522231141"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
        >
          İletişime Geç
        </a>
      </div>
    </nav>
  );
};

const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-16 px-10 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Project Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    technologies: "",
    mainLink: "",
    secondLink: ""
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        // Sort by createdAt desc if possible
        const sortedData = Array.isArray(data) ? [...data].sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }) : [];
        setProjects(sortedData);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setError("Projeler yüklenirken format hatası oluştu.");
      }
    } catch (err) {
      console.error("Projeler yüklenemedi", err);
      setError("Projeler sunucudan alınamadı.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAdmin(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
      setPassword("");
      setError("");
    } else {
      setError("Şifre hatalı");
      setTimeout(() => setError(""), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", image: "", technologies: "", mainLink: "", secondLink: "" });
    setEditingId(null);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setAlertMessage("Lütfen bir resim seçin.");
      return;
    }
    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        resetForm();
        fetchProjects();
      }
    } catch (err) {
      console.error("Proje kaydedilemedi", err);
    }
  };

  const handleEditInit = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(", "),
      mainLink: project.mainLink,
      secondLink: project.secondLink || ""
    });
    setEditingId(project.id);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        // Convert to WebP Base64
        const webpBase64 = canvas.toDataURL('image/webp', 0.8);
        setFormData({ ...formData, image: webpBase64 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProjects();
        setShowDeleteConfirm(null);
      } else {
        const errorData = await response.json();
        setAlertMessage(`Silme işlemi başarısız: ${errorData.error || response.statusText}`);
      }
    } catch (err) {
      console.error("Proje silinemedi", err);
      setAlertMessage("Proje silinirken teknik bir hata oluştu.");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.15 }
  };

  return (
    <div className="bg-[#FAFAFA] text-gray-900 font-sans selection:bg-black/10">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="min-h-[70vh] flex items-center pt-32 pb-16 px-10 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4 tracking-tight">
              Daha sade, daha hızlı, daha kullanışlı <span className="text-brand">masaüstü yazılımlar.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-8">
              Vireon Systems, günlük bilgisayar kullanımını kolaylaştıran, hafif ve kullanıcı odaklı masaüstü uygulamalar geliştiren bir yazılım oluşumudur.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#work"
                className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-all flex items-center gap-2 group shadow-sm"
              >
                Çalışma Alanımız
              </a>
              <a 
                href="#projects"
                className="px-6 py-3 text-gray-600 font-medium hover:text-black flex items-center transition-all group"
              >
                Projeleri Gör
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Hero Image/Logo Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center pt-12"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative p-12 bg-white rounded-[40px] shadow-2xl border border-gray-50 flex items-center justify-center group"
            >
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-brand/5 rounded-[50px] blur-2xl group-hover:bg-brand/10 transition-colors -z-10" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-light rounded-full blur-3xl opacity-40" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-100/40 rounded-full blur-3xl opacity-30" />

              <img 
                src="https://i.ibb.co/C5Hwr6JV/a9800aed-6c9d-4361-84a9-45c1ac6fe15f.png" 
                alt="Vireon Systems Logo" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 filter drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bio / About Wrapper */}
      <div id="about">
        {/* Hakkımızda & Yaklaşımımız */}
        <div className="flex flex-col lg:flex-row px-10 py-12 gap-12 max-w-7xl mx-auto border-t border-gray-100 bg-white">
        <motion.div {...fadeInUp} className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Hakkımızda</h3>
          <h2 className="text-xl font-semibold mb-3">Basit görünen ama gerçekten işe yarayan yazılımlar.</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Amacımız, karmaşık görünen bilgisayar işlemlerini daha anlaşılır ve kolay hale getiren masaüstü çözümler üretmektir. Vireon Systems olarak hız, sadelik ve kullanılabilirliği ön planda tutuyoruz.
          </p>
        </motion.div>
        <div className="hidden lg:block w-px bg-gray-100"></div>
        <motion.div {...fadeInUp} className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Yaklaşımımız</h3>
          <h2 className="text-xl font-semibold mb-3">Az karmaşa, daha fazla rahatlık.</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Bir uygulamanın iyi olması için karmaşık görünmesine gerek yoktur. Biz, kullanıcının neye ihtiyaç duyduğunu anlayan ve bunu en sade şekilde sunan yazılımlar geliştirmeyi hedefliyoruz.
          </p>
        </motion.div>
      </div>

      {/* Çalışma Alanımız */}
      <Section id="work" className="bg-[#F8F8F8] border-y border-gray-100">
        <div className="mb-12">
          <motion.h2 {...fadeInUp} className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Çalışma Alanımız
          </motion.h2>
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100">
              <Layout className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-sm font-bold mb-2">Kullanıcı Dostu Arayüzler</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Her seviyeden kullanıcının rahatça anlayabileceği sade ve net arayüzler tasarlarız.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-sm font-bold mb-2">Hafif ve Hızlı Uygulamalar</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sistemi yormayan, hızlı açılan ve verimli çalışan masaüstü araçları geliştiririz.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100">
              <Workflow className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-sm font-bold mb-2">Günlük Problemlere Çözüm</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dosya düzenleme ve üretkenlik gibi gerçek ihtiyaçlara odaklanan yardımcı araçlar geliştiririz.
            </p>
          </motion.div>
        </motion.div>
      </Section>
    </div>

      {/* Projeler */}
      <Section id="projects" className="bg-white">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
          <motion.div {...fadeInUp} className="text-xs text-gray-400 font-medium uppercase tracking-widest">Projelerimiz</motion.div>
          <motion.button {...fadeInUp} className="text-sm font-bold border-b border-black">Tümünü İncele</motion.button>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-12"
        >
          {error && (
            <div className="col-span-3 p-4 bg-red-50 text-red-500 rounded-lg text-center text-sm border border-red-100 mb-4">
              {error}
            </div>
          )}
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
            />
          ))}
          {projects.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400">Henüz proje eklenmemiş.</p>
            </div>
          )}
        </motion.div>
      </Section>

      {/* İletişim */}
      <Section id="contact" className="bg-[#F8F8F8]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-semibold mb-3 tracking-tight text-[#1A1A1A]">Bir fikir veya iş birliği için bize ulaşın.</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 italic max-w-lg mx-auto">
              Vireon Systems, masaüstü yazılım fikirleri, iş birlikleri ve yeni projeler için açık bir oluşumdur.
            </p>
            <a 
              href="https://wa.me/905522231141"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-all inline-flex items-center gap-2 group"
            >
              İletişime Geç
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-black text-white px-10 py-8 flex flex-col md:flex-row items-center justify-between mt-auto relative">
        <div className="flex items-center gap-4">
          <img 
            src="https://i.ibb.co/C5Hwr6JV/a9800aed-6c9d-4361-84a9-45c1ac6fe15f.png" 
            alt="Vireon Systems Logo" 
            className="w-10 h-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-lg font-bold mb-0 leading-tight tracking-tight">Vireon Systems</h4>
            <p className="text-xs text-gray-400">Kullanıcı odaklı masaüstü yazılımlar.</p>
          </div>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <p className="text-xs text-gray-400">© 2026 Vireon Systems. Tüm hakları saklıdır.</p>
        </div>
        
        {/* Hidden Admin Entry */}
        <div 
          onClick={() => setShowLoginModal(true)}
          className="absolute bottom-2 right-2 w-2 h-2 bg-white opacity-[0.08] hover:opacity-[0.25] cursor-pointer rounded-sm transition-opacity"
        />
      </footer>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Emin misiniz?</h3>
            <p className="text-sm text-gray-500 mb-8">Bu işlem geri alınamaz ve proje kalıcı olarak silinecektir.</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="py-3 bg-gray-100 text-gray-600 font-bold rounded-md hover:bg-gray-200 transition-all text-sm"
              >
                İptal Et
              </button>
              <button 
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-all text-sm shadow-lg shadow-red-200"
              >
                Evet, Sil
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-100">
              <Plus className="w-8 h-8 text-brand rotate-45" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bilgi</h3>
            <p className="text-sm text-gray-500 mb-8">{alertMessage}</p>
            <button 
              onClick={() => setAlertMessage(null)}
              className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-all text-sm"
            >
              Tamam
            </button>
          </motion.div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 relative"
          >
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100">
                <Lock className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Yönetici Girişi</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Şifre</label>
                <input 
                  type="password" 
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifreyi girin..."
                />
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800 transition-all text-sm"
              >
                Giriş Yap
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-10 relative my-8"
          >
            <button onClick={() => setShowAdminPanel(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center border border-cyan-100">
                <Plus className={`w-6 h-6 text-brand transition-transform ${editingId ? 'rotate-45' : ''}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{editingId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h2>
                <p className="text-sm text-gray-400">Proje detaylarını aşağıdan yönetebilirsiniz.</p>
              </div>
              {editingId && (
                <button 
                  onClick={resetForm}
                  className="ml-auto text-xs font-bold text-gray-400 hover:text-black border border-gray-100 px-3 py-1.5 rounded-lg"
                >
                  Yeni Ekleme Moduna Geç
                </button>
              )}
            </div>

            <div className="grid lg:grid-cols-5 gap-10">
              {/* Form Section */}
              <div className="lg:col-span-3">
                <form onSubmit={handleAddProject} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 col-span-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Proje İsmi</label>
                      <input 
                        required
                        className="w-full bg-gray-50 border border-gray-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Örn: V-System Helper"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Açıklama</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Projenin amacını kısaca açıklayın..."
                      />
                    </div>
                  </div>

                    <div className="space-y-4">
                     <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Resim URL veya Dosya</label>
                       <div className="flex gap-2">
                        <input 
                           className="flex-1 bg-gray-50 border border-gray-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                           value={formData.image}
                           onChange={(e) => setFormData({...formData, image: e.target.value})}
                           placeholder="https://...veya dosya seçin"
                         />
                         <div className="relative">
                            <input 
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <button type="button" className="h-full bg-gray-100 px-3 rounded-md hover:bg-gray-200 transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                         </div>
                       </div>
                       {formData.image && (
                         <div className="mt-2 relative w-20 h-12 rounded border overflow-hidden bg-gray-50 shadow-sm">
                           <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                         </div>
                       )}
                     </div>
                     <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Teknolojiler (Virgülle)</label>
                       <input 
                         required
                         className="w-full bg-gray-50 border border-gray-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                         value={formData.technologies}
                         onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                         placeholder="React, Rust, Tauri..."
                       />
                     </div>
                   </div>

                   <div className="space-y-4">
                     <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Ana Link</label>
                       <input 
                         required
                         className="w-full bg-gray-50 border border-gray-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                         value={formData.mainLink}
                         onChange={(e) => setFormData({...formData, mainLink: e.target.value})}
                         placeholder="https://..."
                       />
                     </div>
                     <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">İkinci Link (Opsiyonel)</label>
                       <input 
                         className="w-full bg-gray-50 border border-gray-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                         value={formData.secondLink}
                         onChange={(e) => setFormData({...formData, secondLink: e.target.value})}
                         placeholder="https://github.com/..."
                       />
                     </div>
                   </div>

                  <div className="col-span-2 pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-cyan-600 transition-all shadow-lg shadow-brand/20"
                    >
                      {editingId ? 'Projeyi Güncelle' : 'Projeyi Ekle'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Minimal List Section */}
              <div className="lg:col-span-2 flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Mevcut Projeler ({projects.length})</label>
                <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 space-y-3 custom-scrollbar">
                  {projects.map((project) => (
                    <div key={project.id} className={`p-3 rounded-xl border flex items-center gap-3 group transition-all ${editingId === project.id ? 'bg-cyan-50 border-cyan-100' : 'bg-white border-gray-100'}`}>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={project.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{project.name}</h4>
                        <div className="flex gap-1 mt-1">
                          {project.technologies.slice(0, 2).map(t => (
                            <span key={t} className="text-[8px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded italic">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditInit(project)}
                          className="p-1.5 bg-gray-50 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                          title="Düzenle"
                        >
                          <MousePointer2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="p-1.5 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="py-10 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      Henüz proje yok.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
