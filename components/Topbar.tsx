import { ModeToggle } from "./toggle-theme";

const Topbar = () => {
     return (
          <div className="flex justify-between items-center p-4">
               <span className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">MasterJi</span>
               <span className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">Live Dashboard</span>
               <ModeToggle />
          </div>
     )
}

export default Topbar