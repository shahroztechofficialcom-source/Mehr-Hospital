import * as React from "react"; import {cn} from "@/lib/utils";
export function Select({className,...p}:React.SelectHTMLAttributes<HTMLSelectElement>){return <select className={cn("w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100",className)} {...p}/>}
