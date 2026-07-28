"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";


export default function Home(): React.JSX.Element {
    const { data: session } = authClient.useSession();
    const user = session?.user;
	return (
		<div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
			<div className="space-y-8">
				<h1 className="font-bold text-5xl text-center">SIIRA Admin Front</h1>
                <div className="flex items-center justify-center">

                    { user
                        ? <Button>
                            <Link href="/dashboard">
                                Ir al dashboard
                            </Link>
                        </Button>

                        : <Button>
                            <Link href="/auth/sign-in">
                                Iniciar sesión
                            </Link>
                        </Button>
                    }
                </div>
			</div>
		</div>
	);
}
