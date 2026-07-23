import { ProcessConfigView } from "@/components/process-configs/process-config-view";

export default function Home(): React.JSX.Element {
	return (
		<div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
			<div className="space-y-8">
				<h1 className="font-bold text-5xl text-center">SIIRA Admin Front</h1>

				<ProcessConfigView />
			</div>
		</div>
	);
}
