import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f4ef] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md">
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
