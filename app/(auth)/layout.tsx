import { Egg } from "lucide-react"
import Image from "next/image"
import { ReactNode } from "react"



const layout = async ({ children }: { children: ReactNode }) => {

    return (
        <main className="relative flex flex-col-reverse text-light-100 sm:flex-row">
            <section className="my-auto flex h-full min-h-screen flex-1 items-center bg-pattern bg-cover bg-top bg-dark-100 px-5 py-10">
                <div className="gradient-vertical mx-auto flex max-w-xl flex-col gap-6 rounded-lg p-10">
                    <div className="flex flex-row gap-3">
                    <Egg className="h-12 w-12 mb-4" /> 
                    <h1 className="text-2xl font-semibold text-black">A&E Poultry</h1>
                    </div>

                    <div>{children}</div>
                </div>
            </section>

            <section className="sticky h-40 w-full sm:top-0 sm:h-screen sm:flex-1">
                <Image
                    src='/images/poult.jpg'
                    alt="poultry image"
                    height={1000}
                    width={1000}
                    className="size-full object-cover"
                    />
            </section>
        </main>
    )
};

export default layout;