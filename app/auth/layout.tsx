import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f4ef] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md">
          {/* Logo centré */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3f2f85] to-[#a3ade8] flex items-center justify-center mx-auto mb-3">
              <span className="text-[#e8b41f] font-bold text-xl">PS</span>
            </div>
            <h1 className="text-2xl font-bold text-[#3f2f85]">Parents School</h1>
            <p className="text-sm text-slate-500 mt-1">École des parents par les parents et pour les parents</p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-xl shadow-sm border border-[#a3ade8]/30 p-8">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
