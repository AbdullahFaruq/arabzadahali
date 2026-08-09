import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-white font-black text-lg">A</span>
          </div>
          <div>
            <span className="block font-black text-xl text-white">Arabzada</span>
            <span className="block text-[10px] text-amber-500 tracking-widest uppercase">Fine Carpets</span>
          </div>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
